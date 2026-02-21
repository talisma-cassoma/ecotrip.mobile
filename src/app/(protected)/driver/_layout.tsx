import { Stack } from "expo-router";
import { DriverProvider } from "@/context/driverContext";
import { useUserAuth } from "@/hooks/useUserAuth";
import { colors } from "@/styles/theme";

export default function DriverLayout() {
  const { isLoaded, user } = useUserAuth();

  if (!isLoaded || !user) return null;

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