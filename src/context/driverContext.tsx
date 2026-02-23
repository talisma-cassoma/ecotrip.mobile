import React, { createContext, useContext, useCallback, useRef, useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import SocketBuilder from "@/services/socketBuilder";
import { constants } from "@/configs/constants";
import { useToast } from "@/context/toastContext";
import { useUserAuth } from "@/hooks/useUserAuth";
import { AuthUser, TripRequestProps } from "@/types";

interface DriverContextType {
  availableTrips: TripRequestProps[];
  lobbySocket: Socket | null;
  roomSocket: Socket | null;
  connectLobby: () => void;
  disconnectLobby: () => void;
  selectTrip: (user: AuthUser, room: TripRequestProps) => void;
  setOnConfirmedTrip: (callback: (trip: TripRequestProps) => void) => void;
  setOnLobbyUpdated: (callback: (rooms: TripRequestProps[]) => void) => void;

}

const DriverContext = createContext<DriverContextType | null>(null);

export const DriverProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUserAuth();
  const { showToast } = useToast();

  const [availableTrips, setAvailableTrips] = useState<TripRequestProps[]>([]);
  const lobbySocketRef = useRef<Socket | null>(null);
  const roomSocketRef = useRef<Socket | null>(null);
  const selectedTripRef = useRef<{ user: AuthUser; room: TripRequestProps } | null>(null);

  const onConfirmedTripRef = useRef<((trip: TripRequestProps) => void) | null>(null);
  const onLobbyUpdatedRef = useRef<((rooms: TripRequestProps[]) => void) | null>(null);

  // Lobby
  const connectLobby = useCallback(() => {
    if (lobbySocketRef.current) {
      console.log("[DriverContext] Lobby já conectado");
      return;
    }

    console.log("[DriverContext] connectLobby chamado");

    const lobby = new SocketBuilder({
      socketUrl: constants.socketUrl,
      namespace: constants.socketNamespaces.lobby,
    })
      .setOnConnect(() => console.log("[DriverContext] Lobby conectado"))
      .setOnDisconnect((reason) => console.log("[DriverContext] Lobby desconectado:", reason))
      .on(constants.event.LOBBY_UPDATED, (rooms: TripRequestProps[]) => {
        console.log("[DriverContext] LOBBY_UPDATED recebido com", rooms.length, "rooms");
        setAvailableTrips(rooms);
        onLobbyUpdatedRef.current?.(rooms);
      })
      .build();

    lobbySocketRef.current = lobby;
  }, []);

  const disconnectLobby = useCallback(() => {
    const socket = lobbySocketRef.current;
    if (socket) {
      console.log("[DriverContext] Lobby desconectado intencionalmente");
      socket.disconnect();
      lobbySocketRef.current = null;
      //setAvailableTrips([]);
    }
  }, []);

  const setOnLobbyUpdated = (callback: (rooms: TripRequestProps[]) => void) => {
    onLobbyUpdatedRef.current = callback;
  };

  //Room
  const selectTrip = async (user: AuthUser, room: TripRequestProps) => {
  selectedTripRef.current = { user, room };

  if (roomSocketRef.current) {
    roomSocketRef.current.disconnect();
  }

  const roomSock = new SocketBuilder({
    socketUrl: constants.socketUrl,
    namespace: constants.socketNamespaces.room,
  })
    .setOnConnect(() => {
      console.log("[DriverContext] Conectado ao room", room.id);
      showToast("Conectado à sala", "success");
    })
    .setOnDisconnect((reason) => console.log("[DriverContext] Room desconectado:", reason))
    .build();

  // Função para emitir (evita repetição de código)
  const emitJoinRoom = () => {
    // ⚠️ CERTIFIQUE-SE QUE constants.event.JOIN_ROOM === "joinRoom"
    roomSock.emit(constants.event.JOIN_ROOM, { user, room }, (response: any) => {
      console.log('JOIN_ROOM callback response:', response);
    });
  };

  // ✅ Previne Race Condition: Verifica se já conectou rápido demais
  if (roomSock.connected) {
    emitJoinRoom();
  } else {
    roomSock.on('connect', emitJoinRoom);
  }
      // Eventos do room
      roomSock.on(constants.event.TRIP_ACCEPTED, (payload) => {
      if (payload?.status === "accepted") {
        showToast(payload.message || "Viagem aceita!", "success");
        onConfirmedTripRef.current?.(room);
      }
    });

    roomSock.on(constants.event.TRIP_CANCELED, (payload) => {
      if (payload?.status === "cancelled") {
        showToast(payload.message || "Viagem cancelada", "warning");
      }
    });
    
    roomSock.on('connect', () => {
      roomSock.emit(constants.event.JOIN_ROOM, { user, room }, (response: any) => {
        console.log('JOIN_ROOM callback response:', response);
      });
    });

    roomSocketRef.current = roomSock;
  };

  const setOnConfirmedTrip = (callback: (trip: TripRequestProps) => void) => {
    onConfirmedTripRef.current = callback;
  };

  //Cleanup
  useEffect(() => {
    return () => {
      disconnectLobby();
      if (roomSocketRef.current) roomSocketRef.current.disconnect();
    };
  }, [disconnectLobby]);

  return (
    <DriverContext.Provider
      value={{
        availableTrips,
        lobbySocket: lobbySocketRef.current,
        roomSocket: roomSocketRef.current,
        connectLobby,
        disconnectLobby,
        selectTrip,
        setOnConfirmedTrip,
        setOnLobbyUpdated,
      }}
    >
      {children}
    </DriverContext.Provider>
  );
};

export const useDriver = () => {
  const ctx = useContext(DriverContext);
  if (!ctx) throw new Error("useDriver must be used dentro do DriverProvider");
  return ctx;
};