import React, { createContext, useContext, useEffect, useState } from "react";
import SocketBuilder from "../services/socketBuilder";
import { constants } from "../configs/constants";
import { Socket } from "socket.io-client";
import { useUserAuth } from "@/hooks/useUserAuth";
import { AuthUser, AvailableDriverProps, DriverRole } from "@/types";
import { TripRequestProps } from "@/types";
import { useToast } from "@/context/toastContext";
//import { router } from "expo-router";
import { useTrip } from "@/context/tripContext";
import { api } from "@/services/api";

export interface PassengerContextProps {
  socket: Socket | null;
  isConnected: boolean;
  usersOnline: string[];
  newTrip: { user: AuthUser | null; trip: TripRequestProps | null } | null;
  setNewTrip: React.Dispatch<React.SetStateAction<{ user: AuthUser | null; trip: TripRequestProps | null } | null>>;
  availableDrivers: AvailableDriverProps[];
  requestNewTrip: (user: AuthUser, room?: TripRequestProps) => void;
  updateTrip: (roomId: string, updates: Partial<TripRequestProps>) => void;
  fetchDrivers: () => Promise<void>;
  resetPassengerState: () => void;
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
  const [newTrip, setNewTrip] = useState<{ user: AuthUser | null, trip: TripRequestProps | null } | null>(null);
  
  const { showToast } = useToast();

  const { user } = useUserAuth();
  const { distance, duration, price, originCoords, destinationCoords } = useTrip();

  const updateTrip = (roomId: string, updates: Partial<TripRequestProps>) => {
    if (!socket) return;
    if (!roomId) return;

    socket.emit(
      constants.event.UPDATE_ROOM,
      { roomId, updates },
      (response: any) => {
        if (!response?.success) {
          showToast(response?.error || "Não foi possível atualizar", "warning");
          return;
        }

        //showToast("Atualizado com sucesso", "success");
      }
    );
  };

  const fetchDrivers = async (): Promise<void> => {
    if (!user || !socket?.id) return;

    try {
      const room = {
        id: "", // Será preenchido após criação da viagem
        owner: {
          ...user,
          id: user.id,
          socketId: socket.id,
        },
        status: "requested",
        price: price ?? 0,
        origin: {
          name: originCoords?.name || "",
          location: {
            lat: originCoords?.latitude || 0,
            lng: originCoords?.longitude || 0,
          },
        },
        destination: {
          name: destinationCoords?.name || "",
          location: {
            lat: destinationCoords?.latitude || 0,
            lng: destinationCoords?.longitude || 0,
          },
        },
        distance: distance ?? 0,
        duration: duration ?? 0,
        directions: {},
        email: user.email,
      };

      // console.log("user:", user);
      console.log("user id:", user?.id);;

      const response = await api.post(
        "/trips/new-trip",
        room,
        {
          headers: {
            access_token: user.access_token,
            refresh_token: user.refresh_token,
          },
        }
      );

      const trip_id = response.data.tripId;
      console.log("trip_id:", trip_id);

      room.id = trip_id

      requestNewTrip(room.owner, room as TripRequestProps);

    } catch (error) {
      console.error("Erro ao criar viagem", error);
    }
  };

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
          //router.replace("/(protected)/passenger/passengerScreen");
          showToast(reason || "A viagem foi cancelada", "warning");
          resetPassengerState();

          //router.replace("/(protected)/passenger/passengerScreen");
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

  useEffect(() => {
  if (newTrip?.trip?.status === "cancelled" || 
      newTrip?.trip?.status === "completed") {
    resetPassengerState();
  }
}, []);

  const requestNewTrip = (userParam: AuthUser, roomParam?: TripRequestProps) => {
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

    setNewTrip({ user: userParam, trip: roomParam || {} as TripRequestProps });

    socket.emit(constants.event.JOIN_ROOM, { user: userForBackend, room: roomParam });
  };

  const resetPassengerState = () => {
  setNewTrip(null);
  setAvailableDrivers([]);
  setUsersOnline([]);
};

  return (
    <PassengerContext.Provider
      value={{ socket, isConnected, usersOnline, availableDrivers, requestNewTrip, newTrip, setNewTrip, updateTrip, fetchDrivers, resetPassengerState }}
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
