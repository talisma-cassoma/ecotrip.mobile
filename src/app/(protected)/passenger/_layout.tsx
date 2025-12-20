import React from "react";
import { PassengerProvider } from "@/context/passengerContext";
import { Stack } from "expo-router";
import { colors } from "@/styles/theme";
import { TripProvider } from "@/context/tripContext";
import { useUserAuth } from "@/hooks/useUserAuth";

export default function PassengerLayout() {
  const {isLoaded } = useUserAuth();

if(isLoaded){
  return (
    <TripProvider>
      <PassengerProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.gray[100] },
          }}
        />
      </PassengerProvider>
    </TripProvider>
  );
}
  return null
}