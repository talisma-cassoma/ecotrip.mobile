import React, { createContext, useState, useEffect, useContext } from "react";
import SocketBuilder from "../services/socketBuilder";
import { constants } from "../configs/constants";
import { AuthUser } from "../configs/database";
import { Socket } from "socket.io-client";
import { TripRequestProps} from "@/types";


interface DriverContextType {
  availableTrips: TripRequestProps[];
  lobbySocket: Socket | null;
  roomSocket: Socket | null;
  selectTrip: (user: AuthUser, room: TripRequestProps) => void;
}

const DriverContext = createContext<DriverContextType | null>(null);

export function DriverProvider({
  user,
  children,
}: {
  user: AuthUser;
  children: React.ReactNode;
}) {
  const [availableTrips, setAvailableTrips] = useState<TripRequestProps[]>([]);
  const [lobbySocket, setLobbySocket] = useState<Socket | null>(null);
  const [roomSocket, setRoomSocket] = useState<Socket | null>(null);

  // ✅ Conexão com o LOBBY
  useEffect(() => {
    const lobbyInstance = new SocketBuilder({
      socketUrl: constants.socketUrl,
      namespace: constants.socketNamespaces.lobby,
    })
      .setOnUserConnected(() => console.log("Driver conectado ao lobby"))
      .setOnUserDisconnected(() => console.log("Driver desconectado do lobby"))
      .build();

    lobbyInstance.on("connect_error", (err) => {
      console.warn("[Lobby Socket Error]", err.message);
    });

    // ✅ Escutar atualizações do lobby
    lobbyInstance.on(constants.events.LOBBY_UPDATED, (trips: TripRequestProps[]) => {
      const newTrips: TripRequestProps[] = trips.map((trip) => ({
        id: trip.id ?? "",
        status: trip.status ?? "requested",
        distance: trip.distance ,
        duration: trip.duration ,
        price: trip.price ?? 0,
        directions: {} as any,
        driver_id: null,
        passengerId: trip.owner,
        origin: {
          name: trip.origin?.name ?? "",
          location: {
            lat: trip.origin?.location?.lat ?? 0,
            lng: trip.origin?.location?.lng ?? 0,
          },
        },
        destination: {
          name: trip.destination?.name ?? "",
          location: {
            lat: trip.destination?.location?.lat ?? 0,
            lng: trip.destination?.location?.lng ?? 0,
          },
        },
        isSelected: false,
        onAccept: (t: TripRequestProps) => selectTrip(user, trip),
      }));
      console.log("LOBBY_UPDATED recebido:", JSON.stringify(newTrips));
      setAvailableTrips(newTrips);
    });

    setLobbySocket(lobbyInstance);

    return () => {
      lobbyInstance.removeAllListeners();
      lobbyInstance.disconnect();
    };
  }, [user?.id]);

  // ✅ Conexão com o ROOM
  const selectTrip = (user: AuthUser, room: TripRequestProps) => {
    if (roomSocket) {
      roomSocket.disconnect();
      setRoomSocket(null);
    }

    const builder = new SocketBuilder({
      socketUrl: constants.socketUrl,
      namespace: constants.socketNamespaces.room,
    });

    const clientSocket = builder
      .setOnConnect(() => console.log("Driver conectado ao room"))
      .setOnDisconnect(() => console.log("Driver desconectado do room"))
      .setOnUserConnected((u: { id: string; message: string }) => {
        console.log("USER_CONNECTED recebido:", u);
      })
      .setOnUserDisconnected((id: string) => {
        console.log("USER_DISCONNECTED recebido:", id);
      })
      .build();

    clientSocket.emit(constants.events.JOIN_ROOM, { user, room });
    setRoomSocket(clientSocket);
  };

  // ✅ Sempre renderiza o provider (não retorna null)
  const value: DriverContextType = {
    availableTrips,
    lobbySocket,
    roomSocket,
    selectTrip,
  };

  return (
    <DriverContext.Provider value={value}>{children}</DriverContext.Provider>
  );
}

export const useDriver = () => {
  const context = useContext(DriverContext);
  if (!context) throw new Error("useDriver deve ser usado dentro de DriverProvider");
  return context;
};
