import React, { createContext, useState, useEffect, useContext } from "react";
import SocketBuilder from "../services/socketBuilder";
import { constants } from "../configs/constants";
import { AuthUser } from "@/types";
import { Socket } from "socket.io-client";
import { TripRequestProps } from "@/types";
import { useToast } from "@/context/toastContext";
import { useUserAuth } from "@/hooks/useUserAuth";

interface DriverContextType {
  availableTrips: TripRequestProps[];
  lobbySocket: Socket | null;
  roomSocket: Socket | null;
  selectTrip: (user: AuthUser, room: TripRequestProps) => void;
  setOnConfirmedTrip: (callback: (trip: TripRequestProps) => void) => void; // novo
}


const DriverContext = createContext<DriverContextType | null>(null);

const mockTrip: TripRequestProps = {
  id: "trip-tester-001",
  origin: {
    name: "Origin Tester",
    location: { lat: 40.7128, lng: -74.0060 },
  },
  destination: {
    name: "Destination Tester",
    location: { lat: 40.73061, lng: -73.935242 },
  },
  price: 25.50,
  status: "requested",
  distance: 10,
  duration: 15,
};


export const DriverProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [availableTrips, setAvailableTrips] = useState<TripRequestProps[]>([mockTrip]);
  const [lobbySocket, setLobbySocket] = useState<Socket | null>(null);
  const [roomSocket, setRoomSocket] = useState<Socket | null>(null);
  const { showToast } = useToast();
  const { user } = useUserAuth();
  const [onConfirmedTrip, setOnConfirmedTripState] = useState<((trip: TripRequestProps) => void) | null>(null);

  const onConfirmedTripRef = React.useRef<
    ((trip: TripRequestProps) => void) | null
  >(null);

  const setOnConfirmedTrip = (callback: (trip: TripRequestProps) => void) => {
    onConfirmedTripRef.current = callback;
  };



  console.log(`DriverProvider renderizado para driver com socket: ${lobbySocket?.id}`);

  const handleLobbyUpdate = (rooms: TripRequestProps[]) => {
    console.log('[Lobby] LOBBY_UPDATED recebido:', rooms);

    setAvailableTrips(rooms);

    const acceptedRooms = rooms.filter(
      (room) => room.status === 'accepted'
    );

    if (acceptedRooms.length === 1) {
      console.log('🚨 Existe exatamente UMA room com status ACCEPTED:', acceptedRooms[0]);
      onConfirmedTripRef.current?.(acceptedRooms[0]);
    }
  };

  // ✅ Conexão com o LOBBY
  useEffect(() => {
    let lobbyInstance: Socket;

    const connectLobby = () => {
      lobbyInstance = new SocketBuilder({
        socketUrl: constants.socketUrl,
        namespace: constants.socketNamespaces.lobby,
      })
        .setOnConnect(() => {
          console.log('Driver conectado ao lobby');
        })
        .build();

      // ✅ ÚNICO EVENTO NECESSÁRIO
      lobbyInstance.on(
        constants.events.LOBBY_UPDATED,
        handleLobbyUpdate
      );

      setLobbySocket(lobbyInstance);
    };

    connectLobby();

    return () => {
      if (lobbyInstance) {
        lobbyInstance.off(
          constants.events.LOBBY_UPDATED,
          handleLobbyUpdate
        );
        lobbyInstance.disconnect();
      }
    };
  }, []);

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
      .setOnConnect(() => {
        console.log("Driver conectado ao room")
        showToast("Driver conectado ao room", "success");
      })
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


  return (
    <DriverContext.Provider value={{
      availableTrips,
      lobbySocket,
      roomSocket,
      selectTrip,
      setOnConfirmedTrip,
    }}>
      {children}
    </DriverContext.Provider>

  );
}

export const useDriver = () => {
  const context = useContext(DriverContext);
  if (!context) throw new Error("useDriver deve ser usado dentro de DriverProvider");
  return context;
};
