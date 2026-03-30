import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "@/context/userAuthContext";
import { ToastProvider } from "@/context/toastContext";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import {
  useFonts,
  Rubik_600SemiBold,
  Rubik_400Regular,
  Rubik_500Medium,
  Rubik_700Bold,
} from "@expo-google-fonts/rubik";

import { Loading } from "@/components/loading";
import { Platform , Image } from "react-native";


const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string;

if (!publishableKey) {
  throw new Error('Add your Clerk Publishable Key to the .env file');
}

export default function RootLayout() {
 if (Platform.OS === "web") {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
        padding: 20,
        textAlign: "center",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Image source={require("@/assets/logo.png")} style={{ width: 300, height: 300, marginTop: 24, marginBottom: 2, alignSelf: 'center' }} />

      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16, color: "#1F2937" }}>
        Olá 👋
      </h1>

      <p style={{ fontSize: 18, color: "#4B5563", marginBottom: 24, maxWidth: 400 }}>
        O Ecotrip ainda não está disponível no navegador.
      </p>

      <a
        href="https://expo.dev/artifacts/eas/f7suK8LWPeY1jP9bMGoX7z.apk"
        style={{
          backgroundColor: "#10B981",
          color: "#fff",
          padding: "12px 24px",
          borderRadius: 8,
          textDecoration: "none",
          fontWeight: 600,
          fontSize: 16,
          boxShadow: "0px 4px 12px rgba(16, 185, 129, 0.3)",
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        Baixar App
      </a>
    </div>
  );
}
  const [fontsLoaded] = useFonts({
    Rubik_600SemiBold,
    Rubik_400Regular,
    Rubik_500Medium,
    Rubik_700Bold,
  });


  if (!fontsLoaded) {
    return <Loading />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <ToastProvider>
          <AuthProvider>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
          </AuthProvider>
        </ToastProvider>
      </ClerkProvider>
    </GestureHandlerRootView>
  );
}