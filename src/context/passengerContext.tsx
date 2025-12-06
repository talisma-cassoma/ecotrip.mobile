import React, { createContext, useContext, useEffect, useState } from "react";
import SocketBuilder from "../services/socketBuilder";
import { constants } from "../configs/constants";
import { Socket } from "socket.io-client";
import { useUserAuth } from "@/hooks/useUserAuth";
import { AuthUser } from "@/types";
import { TripRequestProps} from "@/types";


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
  availableDrivers: AuthUser[];
  createRoom: (user: AuthUser, room?: TripRequestProps) => void;
}


const PassengerContext = createContext<PassengerContextProps | null>(null);

export const PassengerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [usersOnline, setUsersOnline] = useState<string[]>([]);
  const [availableDrivers, setAvailableDrivers] = useState<AuthUser[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  const { user } = useUserAuth();

  console.log("Passenger renderizado para usuário:", user?.id);

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
    .setOnConnect(() => setIsConnected(true))
    .setOnDisconnect(() => setIsConnected(false))
    .setOnUserConnected((_user) => {
      setUsersOnline((prev) => [...new Set([...prev, _user.id])]);
    })
    .setOnUserDisconnected((userId: string) => {
      setUsersOnline((prev) => prev.filter((u) => u !== userId));
    })
    .build();

  clientSocket.on(constants.events.JOIN_ROOM, (usersInRoom: AuthUser[]) => {
    const drivers = usersInRoom.filter((u) => u.id !== user.id && u.role.type === "driver");
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
