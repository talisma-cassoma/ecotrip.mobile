import React, { createContext, useContext, useCallback, useRef, useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import SocketBuilder from "@/services/socketBuilder";
import { constants } from "@/configs/constants";
import { useToast } from "@/context/toastContext";
import { useUserAuth } from "@/hooks/useUserAuth";
import { AuthUser, TripRequestProps } from "@/types";

type DriverState = "idle" | "pending" |  "confirmed";


interface DriverContextType {
  availableTrips: TripRequestProps[];
  lobbySocket: Socket | null;
  roomSocket: Socket | null;
  connectLobby: () => void;
  disconnectLobby: () => void;
  selectTrip: (user: AuthUser, room: TripRequestProps) => void;
  setOnConfirmedTrip: (callback: (trip: TripRequestProps) => void) => void;
  setOnLobbyUpdated: (callback: (rooms: TripRequestProps[]) => void) => void;
  driverState: DriverState;
  setDriverState: React.Dispatch<React.SetStateAction<DriverState>>;
  confirmedTrip: TripRequestProps | null;
  resetDriverState: () => void;
}

const DriverContext = createContext<DriverContextType | null>(null);

export const DriverProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUserAuth();
  const { showToast } = useToast();

  const [driverState, setDriverState] = useState<DriverState>("idle" );

  const [availableTrips, setAvailableTrips] = useState<TripRequestProps[]>([]);
  const lobbySocketRef = useRef<Socket | null>(null);
  const roomSocketRef = useRef<Socket | null>(null);
  const selectedTripRef = useRef<{ user: AuthUser; room: TripRequestProps } | null>(null);

  const onConfirmedTripRef = useRef<((trip: TripRequestProps) => void) | null>(null);
  const onLobbyUpdatedRef = useRef<((rooms: TripRequestProps[]) => void) | null>(null);

  const [selectedTrip, setSelectedTrip] = useState<TripRequestProps | null>(null);
  const [pendingTripId, setPendingTripId] = useState<string | null>(null);
  const [confirmedTrip, setConfirmedTrip] = useState<TripRequestProps | null>(null);

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
        setAvailableTrips(rooms);

        // 🔥 Se a trip que estou aguardando sumiu da lista
        if (pendingTripId && !rooms.find(r => r.id === pendingTripId)) {
          resetDriverState
();
        }

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

    if (room.id) {
      setSelectedTrip(room);
      setPendingTripId(room?.id); // 🔥 ativa disabled + animação
      selectedTripRef.current = { user, room };
    }

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

        setConfirmedTrip(selectedTripRef.current?.room ?? null);
        setPendingTripId(null);
        setDriverState("confirmed");

        showToast("Viagem aceita!", "success");
      }
    });

    roomSock.on(constants.event.TRIP_CANCELED, (payload) => {
      if (payload?.status === "cancelled") {
        showToast(payload.message || "Viagem cancelada", "warning");
        setDriverState("idle");

        // Limpa a viagem confirmada e permite que a FlatList volte a aparecer
        resetDriverState
();
      }
    });

    roomSocketRef.current = roomSock;
  };

  const setOnConfirmedTrip = (callback: (trip: TripRequestProps) => void) => {
    onConfirmedTripRef.current = callback;
  };

  const resetDriverState
 = () => {
    setSelectedTrip(null);
    setConfirmedTrip(null);
    setPendingTripId(null);
    selectedTripRef.current = null;

    if (roomSocketRef.current) {
      roomSocketRef.current.disconnect();
      roomSocketRef.current = null;
    }
  };

  //Cleanup
  useEffect(() => {
    return () => {
      disconnectLobby();
      if (roomSocketRef.current) roomSocketRef.current.disconnect();
    };
  }, [disconnectLobby]);

  useEffect(() => {
    return () => {
      resetDriverState
();
    };
  }, []);

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
        confirmedTrip,
        resetDriverState,
        driverState,
        setDriverState
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