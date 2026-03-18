import * as React from "react";
import * as WebBrowser from "expo-web-browser";
import { View, Text, Alert } from "react-native";
import { Button } from "@/components/button";
import { colors, fontFamily } from "@/styles/theme";
import { IconBrandGoogleFilled } from "@tabler/icons-react-native";
import { useSSO, useUser, useAuth } from "@clerk/clerk-expo";
import { useUserAuth } from "@/hooks/useUserAuth";
import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { storeUser } from "@/configs/database";
import { router } from "expo-router";
import * as Linking from "expo-linking";

WebBrowser.maybeCompleteAuthSession();

const redirectUrl = Linking.createURL("/sso-callback");

export function GoogleOauthButton() {
  const { startSSOFlow } = useSSO();  // apenas inicia o OAuth
  const { user } = useUser();         // apenas lê os dados do usuário
  const { getToken } = useAuth();     // pega o token de autenticação
  const { login } = useUserAuth();  // seu storage local
  const [isLoading, setIsLoading] = useState(false);

  const { signOut } = useAuth();

  async function handleGoogleSignIn() {
    try {
      setIsLoading(true);

      // inicia login OAuth Google via Clerk
      const { createdSessionId, setActive, authSessionResult } =
        await startSSOFlow({ strategy: "oauth_google", redirectUrl });

      if (authSessionResult?.type !== "success") {
        console.log("Login cancelado");
        setIsLoading(false);
        return;
      }

      // ativa a sessão no Clerk
      if (setActive && createdSessionId) {
        await setActive({ session: createdSessionId });
      } else {
        // This is an unexpected state, you might want to handle it
        throw new Error("Failed to activate session");
      }

      // After session is active, user object should be updated
      // We will add a small delay to ensure the user object is updated
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error("Erro na criação do passageiro:", error);
      //Alert.alert("Erro ao registrar", "Verifique os dados e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {

    try {
      WebBrowser.warmUpAsync();
    } catch (err) {
      console.log("WebBrowser warmUpAsync erro:", err);
    }

    return () => {
      WebBrowser.coolDownAsync().catch(err => {
        console.log("WebBrowser coolDownAsync erro:", err);
      });
    }
  }, []);

  return (
    <Button
      style={{ justifyContent: "center", backgroundColor: colors.green.dark }}
      disabled={isLoading}
      isLoading={isLoading}
      onPress={handleGoogleSignIn}
    >
      <View
        style={{
          width: 60,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.green.base,
          borderRadius: 10,
          height: "100%",
        }}
      >
        <Button.Icon icon={IconBrandGoogleFilled} />
      </View>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button.Title>
          <Text style={{ color: colors.white, fontSize: 16, fontFamily: fontFamily.semiBold }}>
            Login com Google
          </Text>
        </Button.Title>
      </View>
    </Button>
  );
}