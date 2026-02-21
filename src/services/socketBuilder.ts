import { io, Socket } from "socket.io-client";
import { constants } from "../configs/constants";



interface SocketBuilderOptions {
  socketUrl: string;
  namespace: string; // OBRIGATÓRIO - sempre deve ter um namespace
}

type EventHandler = (...args: any[]) => void;

export default class SocketBuilder {
  private socketUrl: string;
  private onUserConnected: EventHandler = () => {};
  private onUserDisconnected: EventHandler = () => {};
  private onConnect?: EventHandler;
  private onDisconnect?: EventHandler;
  private events: Map<string, EventHandler> = new Map();

  constructor({ socketUrl, namespace }: SocketBuilderOptions) {
    if (!namespace || namespace.trim() === '') {
      throw new Error('Namespace é obrigatório para conectar ao servidor Socket.IO');
    }
    this.socketUrl = `${socketUrl}/${namespace}`;
    console.log("Socket URL final:", this.socketUrl);
  }

  on(event: string, handler: EventHandler): this {
    this.events.set(event, handler);
    return this;
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
    //reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 2000,
    timeout: 20000,
  });

  for (const [event, handler] of this.events.entries()) {
    socket.on(event, handler);
  }

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

  // Handler validado para USER_CONNECTED
  const validatedUserConnectedHandler = (payload: any) => {
    try {
      if (!payload || typeof payload !== 'object') {
        console.error("[USER_CONNECTED] Payload inválido:", payload);
        return;
      }

      if (!payload.socketId) {
        console.warn("[USER_CONNECTED] Payload sem socketId:", payload);
      }

      console.log("[USER_CONNECTED] Payload válido recebido:", payload);
      this.onUserConnected(payload);
    } catch (error) {
      console.error("[USER_CONNECTED] Erro ao processar payload:", error);
    }
  };

  // Handler validado para USER_DISCONNECTED
  const validatedUserDisconnectedHandler = (payload: any) => {
    try {
      if (!payload) {
        console.error("[USER_DISCONNECTED] Payload inválido:", payload);
        return;
      }

      console.log("[USER_DISCONNECTED] User desconectado:", payload);
      this.onUserDisconnected(payload);
    } catch (error) {
      console.error("[USER_DISCONNECTED] Erro ao processar payload:", error);
    }
  };

  socket.on(constants.event.USER_CONNECTED, validatedUserConnectedHandler);
  socket.on(constants.event.USER_DISCONNECTED, validatedUserDisconnectedHandler);

  return socket;
}

}