import React from "react";
import { DriverProvider } from "@/context/driverContext";
import { Stack } from "expo-router";
import { colors } from "@/styles/theme";
import { useUserAuth } from "@/hooks/useUserAuth";

export default function DriverLayout() {
  const { user } = useUserAuth();

  // Nota: garantimos que user existe e é driver antes de chegar aqui por causa do redirect do parent layout

  return (
    <DriverProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.gray[100] },
        }}
      />
    </DriverProvider>
  );
}