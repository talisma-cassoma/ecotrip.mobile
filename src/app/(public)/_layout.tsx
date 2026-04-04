import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ToastProvider } from "@/context/toastContext";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { Redirect, Stack } from 'expo-router'
import { useUserAuth } from "@/hooks/useUserAuth";
import { useEffect } from "react";


export default function AuthRoutesLayout() {
  const { user, isLoaded } = useUserAuth();

  // console.log("PUBLIC LAYOUT:", { user, isLoaded });

  // ⏳ Espera contexto carregar
  if (!isLoaded) return null;

  // ✅ Se já tem user → manda para protected
  if (user) {
    if (user.role.type === "driver") {
      return <Redirect href="/driver/driverScreen" />;
    }

    return <Redirect href="/passenger/passengerScreen" />;
  }


  // ❌ Se não tem user → fica no public
  return <Stack screenOptions={{ headerShown: false }}/>;
}