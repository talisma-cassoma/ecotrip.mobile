import { io, Socket } from "socket.io-client";
import { constants } from "../configs/constants";

interface SocketBuilderOptions {
  socketUrl: string;
  namespace: string;
}

type EventHandler = (...args: any[]) => void;

export default class SocketBuilder {
  private socketUrl: string;
  private onUserConnected: EventHandler;
  private onUserDisconnected: EventHandler;
  private onConnect?: EventHandler;
  private onDisconnect?: EventHandler;

  constructor({ socketUrl, namespace }: SocketBuilderOptions) {
  // Não forçar o namespace se ele for vazio
  this.socketUrl = namespace
    ? `${socketUrl}/${namespace}`
    : socketUrl;

  console.log("Socket URL final:", this.socketUrl);

  this.onUserConnected = () => {};
  this.onUserDisconnected = () => {};
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
      withCredentials: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => console.log("Conectado ao servidor!"));
    socket.on("disconnect", (reason) => console.log("Desconectado:", reason));
    socket.on("reconnect_attempt", (attempt) => console.log("Tentando reconectar, tentativa:", attempt));
    socket.on("reconnect_error", (err) => console.log("Erro na reconexão:", err));
    socket.on("reconnect_failed", () => console.log("Falha ao reconectar"));
    socket.on("reconnect", (attempt) => console.log("Reconectado com sucesso na tentativa:", attempt));
    socket.on("connect_error", (err) => console.log("Erro ao conectar:", err));


    socket.on(constants.events.USER_CONNECTED, this.onUserConnected);
    socket.on(constants.events.USER_DISCONNECTED, this.onUserDisconnected);

    return socket;
  }
}
