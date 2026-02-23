import React, { createContext, useContext, useEffect, useState } from "react";
import SocketBuilder from "../services/socketBuilder";
import { constants } from "../configs/constants";
import { Socket } from "socket.io-client";
import { useUserAuth } from "@/hooks/useUserAuth";
import { AuthUser, AvailableDriverProps, DriverRole} from "@/types";
import { TripRequestProps } from "@/types";
import { useToast } from "@/context/toastContext";

export interface PassengerContextProps {
  socket: Socket | null;
  isConnected: boolean;
  usersOnline: string[];
  newTrip: TripRequestProps | null;
  availableDrivers: AvailableDriverProps[];
  createRoom: (user: AuthUser, room?: TripRequestProps) => void;
}


const PassengerContext = createContext<PassengerContextProps | null>(null);

const mockupDriver: AvailableDriverProps = {
  id: "tester-driver-001",
  name: "Driver Tester",
  email: "test.driver@ecotrip.com",
  image: "https://i.pinimg.com/736x/02/c5/a8/02c5a82909a225411008d772ee6b7d62.jpg",
  telephone: "+1234567890",
  car_model: "Toyota Prius",
  car_plate: "XYZ-1234",
  car_color: "Blue",
  rating: 4.8,
  complited_rides: 150
}

export const PassengerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [usersOnline, setUsersOnline] = useState<string[]>([]);
  const [availableDrivers, setAvailableDrivers] = useState<AvailableDriverProps[]>([mockupDriver]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [newTrip, setNewTrip] = useState<TripRequestProps | null>(null);
  const { showToast } = useToast();

  const { user } = useUserAuth();

  useEffect(() => {

    if (!user) {
      setAvailableDrivers([]);
      setUsersOnline([]);
      setSocket(null);
      return;
    }

    const builder = new SocketBuilder({
      socketUrl: constants.socketUrl,
      namespace: constants.socketNamespaces.room,
    });

    const clientSocket = builder
      .setOnConnect(() => {
        showToast("Passenger conectado ao room", "success");
        console.log("✅ [PassengerContext] Socket conectado, listeners registrados");
      }
      )
      .setOnDisconnect(() => setIsConnected(false))
      .setOnUserConnected((_payload: any) => {
        try {
          // Validar payload
          if (!_payload || typeof _payload !== 'object') {
            console.error("❌ [PassengerContext] USER_CONNECTED: Payload inválido", _payload);
            return;
          }

          // Extrair e validar socketId ou id
          const userId = _payload.socketId || _payload.id;
          if (!userId) {
            console.warn("⚠️ [PassengerContext] USER_CONNECTED sem socketId/id");
            return;
          }

          console.log("✅ [PassengerContext] USER_CONNECTED válido:", userId);
          setUsersOnline((prev) => [...new Set([...prev, userId])]);
        } catch (error) {
          console.error("❌ [PassengerContext] Erro ao processar USER_CONNECTED:", error);
        }
      })
      .setOnUserDisconnected((userId: string) => {
        if (!userId) {
          console.warn("⚠️ [PassengerContext] USER_DISCONNECTED sem userId");
          return;
        }
        setUsersOnline((prev) => prev.filter((u) => u !== userId));
      })
      .build();

    // Listener robusto para JOIN_ROOM com validação
    const handleJoinRoom = (payload: any) => {
      try {
        console.log("🔵 [PassengerContext] JOIN_ROOM evento recebido, payload:", payload);

        // Validar payload
        if (!payload) {
          console.warn("⚠️ [PassengerContext] JOIN_ROOM: Payload é null/undefined");
          return;
        }

        // Aceitar array ou objeto
        const usersInRoom = Array.isArray(payload) ? payload : [payload];
        
        if (!Array.isArray(usersInRoom)) {
          console.error("❌ [PassengerContext] JOIN_ROOM: Payload não é um array", payload);
          return;
        }

        console.log("✅ [PassengerContext] JOIN_ROOM válido:", usersInRoom.length, "users");
        console.log("Users in room:", usersInRoom);

        const drivers: AvailableDriverProps[] = usersInRoom
          .filter(
            (u): u is AuthUser & { role: { type: "driver"; data: DriverRole["data"] } } =>
              u && u.id !== user?.id && u.role?.type === "driver"
          )
          .map((driver) => ({
            id: driver.id!,
            name: driver.name,
            email: driver.email,
            image: driver.image ?? "",
            telephone: driver.telephone ?? "",
            carModel: driver.role.data.car_model,
            carPlate: driver.role.data.car_plate,
            carColor: driver.role.data.car_color,
            rating: driver.role.data.rating,
            complited_rides: driver.role.data.complited_rides,
          }));

        setAvailableDrivers(drivers);
      } catch (error) {
        console.error("❌ [PassengerContext] Erro ao processar JOIN_ROOM:", error);
      }
    };

    clientSocket.on(constants.event.JOIN_ROOM, handleJoinRoom);

    // ✅ Listeners prontos, agora marcar como conectado
    setIsConnected(true);

    // Listener para TRIP_ACCEPTED - quando um driver aceita a viagem
    const handleTripAccepted = (payload: any) => {
      try {
        console.log("🎉 [PassengerContext] TRIP_ACCEPTED recebido:", payload);

        if (!payload || typeof payload !== 'object') {
          console.error("❌ [PassengerContext] TRIP_ACCEPTED: Payload inválido", payload);
          return;
        }

        const { tripId, driver, status, message } = payload;

        if (!tripId || !driver) {
          console.warn("⚠️ [PassengerContext] TRIP_ACCEPTED: Faltam dados críticos", { tripId, driver });
          return;
        }

        if (status === 'accepted') {
          console.log("✅ [PassengerContext] Trip aceita por driver:", driver.id);
          showToast(`${driver.username} aceitou sua viagem!`, "success");
          
          // Aqui você pode atualizar UI, navegar, etc.
          // Por exemplo, abrir tela de detalhes do motorista
        }
      } catch (error) {
        console.error("❌ [PassengerContext] Erro ao processar TRIP_ACCEPTED:", error);
      }
    };

    clientSocket.on(constants.event.TRIP_ACCEPTED, handleTripAccepted);

    // Listener para TRIP_CANCELED - quando uma trip é cancelada
    const handleTripCanceled = (payload: any) => {
      try {
        console.log("❌ [PassengerContext] TRIP_CANCELED recebido:", payload);

        if (!payload || typeof payload !== 'object') {
          console.error("❌ [PassengerContext] TRIP_CANCELED: Payload inválido", payload);
          return;
        }

        const { tripId, status, reason } = payload;

        if (status === 'cancelled') {
          console.log("Trip cancelada:", reason);
          showToast(reason || "A viagem foi cancelada", "warning");
          // Aqui você pode:
          // - Limpar estado da viagem
          // - Voltar para lista de viagens
          // - Mostrar modal de cancelamento
        }
      } catch (error) {
        console.error("❌ [PassengerContext] Erro ao processar TRIP_CANCELED:", error);
      }
    };

    clientSocket.on(constants.event.TRIP_CANCELED, handleTripCanceled);

    setSocket(clientSocket);

    return () => {
      clientSocket.off("connect");
      clientSocket.off("disconnect");
      clientSocket.off(constants.event.USER_CONNECTED);
      clientSocket.off(constants.event.USER_DISCONNECTED);
      clientSocket.off(constants.event.JOIN_ROOM, handleJoinRoom);
      clientSocket.off(constants.event.TRIP_ACCEPTED, handleTripAccepted);
      clientSocket.off(constants.event.TRIP_CANCELED, handleTripCanceled);
      clientSocket.disconnect();
    };
  }, [user]);

  const createRoom = (userParam: AuthUser, roomParam?: TripRequestProps) => {
    if (!socket) return console.warn("⚠️ Socket não inicializado ainda.");
    showToast("Criando sala de viagem...", "info");
    
    // Convert AuthUser to backend User format
    const userForBackend = {
      id: userParam.id,
      socketId: socket.id,
      username: userParam.name, // name → username
      email: userParam.email,
      image: userParam.image,
      telephone: userParam.telephone,
      role: userParam.role, // Send full role object
    };
    
    socket.emit(constants.event.JOIN_ROOM, { user: userForBackend, room: roomParam });
  };

  return (
    <PassengerContext.Provider
      value={{ socket, isConnected, usersOnline, availableDrivers, createRoom, newTrip }}
    >
      {children}
    </PassengerContext.Provider>
  );
};

export function usePassenger() {
  const context = useContext(PassengerContext);
  if (!context) throw new Error("usePassenger must be used inside a PassengerProvider");
  return context;
}
