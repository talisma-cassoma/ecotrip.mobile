import React, { useEffect, useRef } from "react";
import { Stack, router } from "expo-router";
import { colors } from "@/styles/theme";
import { PassengerProvider } from "@/context/passengerContext";
import { DriverProvider } from "@/context/driverContext";
import { TripProvider } from "@/context/tripContext";
import { useUserAuth } from "@/hooks/useUserAuth";
import { Loading } from "@/components/loading";

export default function ProtectedLayout() {
  const { user, isLoggedIn, isLoaded } = useUserAuth();
  const hasNavigated = useRef(false);
console.log("oi estou logado", user);
  useEffect(() => {
    // Aguardar até que o contexto termine de carregar
    if (!isLoaded) {
      console.log("⏳ Aguardando carregamento do usuário...");
      return;
    }

    if (hasNavigated.current) {
      console.log("✅ Navegação já realizada");
      return;
    }

    console.log("🔍 Protected layout - isLoggedIn:", isLoggedIn, "user:", user);

    // Se não autenticado, redireciona para login
    if (!isLoggedIn) {
      console.log("❌ Usuário não autenticado, redirecionando para /login");
      router.replace("/login");
      hasNavigated.current = true;
      return;
    }

    // Usuário autenticado — redireciona conforme papel
    if (user?.role.type === "driver") {
      console.log("✅ Redirecionando driver para /newTripRequests");
      router.replace("/(protected)/newTripRequests");
      hasNavigated.current = true;
    } else if (user?.role.type === "passenger") {
      console.log("✅ Redirecionando passenger para /home");
      router.replace("/(protected)/home");
      hasNavigated.current = true;
    } else {
      console.warn("⚠️ Papel de usuário desconhecido, redirecionando para /login");
      router.replace("/login");
      hasNavigated.current = true;
    }
  }, [isLoaded, isLoggedIn, user?.role.type]);

  // Timeout de segurança
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isLoaded && !hasNavigated.current) {
        console.error("⏱️ Timeout ao carregar usuário (5s)");
        router.replace("/login");
        hasNavigated.current = true;
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [isLoaded]);

  // Mostrar loading enquanto carrega
  if (!isLoaded) {
    return <Loading />;
  }

  // Mostrar conteúdo baseado no tipo de usuário
  return (
    <TripProvider>
      {user?.role.type === "driver" ? (
        <DriverProvider user={user}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.gray[100] },
            }}
          />
        </DriverProvider>
      ) : user?.role.type === "passenger" ? (
        <PassengerProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.gray[100] },
            }}
          />
        </PassengerProvider>
      ) : null}
    </TripProvider>
  );
}
