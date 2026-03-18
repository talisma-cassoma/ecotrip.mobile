import React, { useEffect, useRef } from "react";
import { Slot, router } from "expo-router";
import { useUserAuth } from "@/hooks/useUserAuth";
import { Loading } from "@/components/loading";
import { useAuth } from "@clerk/clerk-expo";



export default function ProtectedLayout() {
  const { user, isLoggedIn, isLoaded } = useUserAuth();
  const hasNavigated = useRef(false);

  console.log("ola daqui _layout")
  
  console.log("DEBUG LAYOUT:", {
  isLoaded,
  user,
  hasNavigated: hasNavigated.current
});
  
useEffect(() => {
  if (!isLoaded || hasNavigated.current) return;

  // 🚨 Espera user estar resolvido MESMO
  if (user === undefined) return;

  console.log("USER NO LAYOUT:", user);

  if (!user) {
    router.replace("/(public)/login");
    hasNavigated.current = true;
    return;
  }

  if (user.role.type === "driver") {
    router.replace("/driver/driverScreen");
  } else if (user.role.type === "passenger") {
    router.replace("/passenger/passengerScreen");
  } else {
    router.replace("/(public)/login");
  }

  hasNavigated.current = true;
}, [isLoaded, user]);

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

  // Mostrar conteúdo baseado no tipo de usuário
   return isLoaded ? <Slot /> : <Loading />
}
