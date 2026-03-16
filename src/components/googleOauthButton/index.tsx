import * as React from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { View, Text } from "react-native";
import { Button } from "@/components/button";
import { colors, fontFamily } from "@/styles/theme";
import { IconBrandGoogleFilled } from "@tabler/icons-react-native";
import * as AuthSession from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

export function GoogleOauthButton() {

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    //iosClientId: "ID_IOS.apps.googleusercontent.com",
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    // Expo Go:
    redirectUri: AuthSession.makeRedirectUri({
      scheme: "ecotrip",
      //path: "oauth2redirect", // opcional
    }),
  });

  React.useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      if (authentication?.accessToken) {
        getUserInfo(authentication.accessToken);
      }
    }
  }, [response]);

  const getUserInfo = async (token: string) => {
    try {
      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await res.json();
      console.log("DADOS DO USUÁRIO:", user);
    } catch (error) {
      console.log("Erro ao buscar dados:", error);
    }
  };

  return (
    <Button
      style={{
        justifyContent: "space-between",
        backgroundColor: colors.green.dark,
      }}
      disabled={!request}
      onPress={() => {
        promptAsync();
      }}
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
          <Text
            style={{
              color: colors.white,
              fontSize: 16,
              fontFamily: fontFamily.semiBold,
            }}
          >
            Login com Google
          </Text>
        </Button.Title>
      </View>
    </Button>
  );
}