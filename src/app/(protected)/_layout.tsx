import React, { useEffect, useRef } from "react";
import { Slot, router } from "expo-router";
import { useUserAuth } from "@/hooks/useUserAuth";
import { Loading } from "@/components/loading";


export default function ProtectedLayout() {
  const { user, isLoggedIn, isLoaded } = useUserAuth();
  const hasNavigated = useRef(false);

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

    //console.log("🔍 Protected layout - isLoggedIn:", isLoggedIn, "user:", user);

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
      router.replace("/(protected)/driver/newTripRequests");
      
    } else if (user?.role.type === "passenger") {
      console.log("✅ Redirecionando passenger para /home");
      router.replace("/(protected)/passenger/home");
     
    } else {
      console.warn("⚠️ Papel de usuário desconhecido, redirecionando para /login");
      router.replace("/login");   
    }
    hasNavigated.current = true;
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

  // Mostrar conteúdo baseado no tipo de usuário
    return (  
      isLoaded ? <Slot />:<Loading />
  );
}
