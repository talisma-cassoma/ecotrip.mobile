import { io, Socket } from "socket.io-client";
import { constants } from "../configs/constants";
import { socket } from "./api";


interface SocketBuilderOptions {
  socketUrl: string;
  namespace?: string;
  token?: string; // opcional, para autenticação via Socket.IO auth
}

type EventHandler = (...args: any[]) => void;

export default class SocketBuilder {
  private socketUrl: string;
  private onUserConnected: EventHandler = () => {};
  private onUserDisconnected: EventHandler = () => {};
  private onConnect?: EventHandler;
  private onDisconnect?: EventHandler;
  private token?: string;

  constructor({ socketUrl, namespace, token }: SocketBuilderOptions) {
    this.socketUrl = namespace ? `${socketUrl}/${namespace}` : socketUrl;
    this.token = token;
    console.log("Socket URL final:", this.socketUrl);
  }

  setOnUserConnected(fn: EventHandler): this {
    this.onUserConnected = fn;
    return this;
  }

  setOnUserDisconnected(fn: EventHandler): this {
    this.onUserDisconnected = fn;
    return this;
  }

  setOnConnect(fn: EventHandler): this {
    this.onConnect = fn;
    return this;
  }

  setOnDisconnect(fn: EventHandler): this {
    this.onDisconnect = fn;
    return this;
  }

 build(): Socket {
  const socket: Socket = io(this.socketUrl, {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 2000,
    timeout: 20000,
    auth: this.token ? { token: this.token } : undefined,
  });

  const tryReconnect = () => {
    if (!socket.connected) {
      console.log("[SocketBuilder] Forçando reconexão...");
      socket.connect();
    }
  };

  // Se falhar na conexão inicial, continua tentando
  socket.on("connect_error", (err) => {
    console.warn("[connect_error]", err.message);
    setTimeout(tryReconnect, 3000);
  });

  socket.on("disconnect", () => {
    console.warn("[disconnect] perdido, tentando reconectar...");
    setTimeout(tryReconnect, 2000);
  });

  socket.on("reconnect_attempt", (a) =>
    console.log("Tentando reconectar… tentativa:", a)
  );

  socket.on("connect", (...args) => {
    console.log("Conectado ao servidor!", socket.id);
   

    if (this.onConnect) this.onConnect(...args);
  });

  socket.on("reconnect", (attempt) =>
    console.log("Reconectado com sucesso na tentativa:", attempt)
  );

  socket.on(constants.events.USER_CONNECTED, this.onUserConnected);
  socket.on(constants.events.USER_DISCONNECTED, this.onUserDisconnected);

  return socket;
}

}