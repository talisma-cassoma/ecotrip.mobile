import React, { createContext, useContext, useEffect, useState } from "react";
import SocketBuilder from "../services/socketBuilder";
import { constants } from "../configs/constants";
import { Socket } from "socket.io-client";
import { useUserAuth } from "@/hooks/useUserAuth";
import { AuthUser, AvailableDriverProps, DriverRole } from "@/types";
import { TripRequestProps } from "@/types";
import { useToast } from "@/context/toastContext";


export type LocationPoint = {
  name: string;
  location: {
    lat: number;
    lng: number;
  };
};

export type TripStatus = "requested" | "offered" | "accepted" | "in_progress" | "completed" | "cancelled";


interface PassengerContextProps {
  socket: Socket | null;
  isConnected: boolean;
  usersOnline: string[];
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
  const { showToast } = useToast();

  const { user } = useUserAuth();

  console.log(`Passenger renderizado para passenger :${user?.id} e socket: ${socket?.id}`);

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
        setIsConnected(true)
        showToast("Passenger conectado ao room", "success");
      }
      )
      .setOnDisconnect(() => setIsConnected(false))
      .setOnUserConnected((_user) => {
        setUsersOnline((prev) => [...new Set([...prev, _user.id])]);
      })
      .setOnUserDisconnected((userId: string) => {
        setUsersOnline((prev) => prev.filter((u) => u !== userId));
      })
      .build();

  clientSocket.on(constants.events.JOIN_ROOM, (usersInRoom: AuthUser[]) => {
  console.log("🔵 JOIN_ROOM recebido:", usersInRoom.length, "users");

  const drivers: AvailableDriverProps[] = usersInRoom
    .filter(
      (u): u is AuthUser & { role: { type: "driver"; data: DriverRole["data"] } } =>
        u.id !== user.id && u.role.type === "driver"
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
});


    setSocket(clientSocket);

    return () => {
      clientSocket.off("connect");
      clientSocket.off("disconnect");
      clientSocket.off(constants.events.USER_CONNECTED);
      clientSocket.off(constants.events.USER_DISCONNECTED);
      clientSocket.off(constants.events.JOIN_ROOM);
      clientSocket.disconnect();
    };
  }, [user]);

  const createRoom = (userParam: AuthUser, roomParam?: TripRequestProps) => {
    if (!socket) return console.warn("⚠️ Socket não inicializado ainda.");
    showToast("Criando sala de viagem...", "info");
    socket.emit(constants.events.JOIN_ROOM, { user: userParam, room: roomParam });
  };

  return (
    <PassengerContext.Provider
      value={{ socket, isConnected, usersOnline, availableDrivers, createRoom }}
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
