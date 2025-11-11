import React from "react";
import { useUserAuth } from "../context/userAuthContext"; // o teu UserAuthContext
import { PassengerProvider } from "./passengerContext";
import { DriverProvider } from "./driverContext";
import { AuthUser } from "../configs/database";

interface SocketProviderProps {
  children: React.ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const { user } = useUserAuth();

  if (!user) {
    // opcional: renderiza um fallback enquanto carrega o user
    console.log("SocketProvider: usuário não autenticado.", user);
    return <>{children}</>;
  }

  if (user.role.type === "driver") {
    return (
      <DriverProvider user={user}>
        {children}
      </DriverProvider>
    );
  }

  if (user.role.type === "passenger") {
    return (
      <PassengerProvider>
        {children}
      </PassengerProvider>
    );
  }

  // fallback caso o role seja desconhecido
  return <>{children}</>;
}
