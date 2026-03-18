import { useAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useUserAuth } from "@/context/userAuthContext";
import { api } from "@/services/api";
import { useUser } from "@clerk/clerk-expo";

export default function SSOCallback() {
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const { login } = useUserAuth();
 
  console.log("ola daqui sso")


  async function handleSignIn() {
    if (isSignedIn) {
      if (user && user.fullName && user.primaryEmailAddress) {
        // pega token do Clerk (JWT)
        const clerkToken = await getToken();

        // pega dados do usuário do Clerk
        const newUser = {
          name: user.fullName,
          email: user.primaryEmailAddress.emailAddress,
          role: "oauth_user",
          telephone: "",
          image: user.imageUrl,
        };
        try{

        // envia para seu backend para criar/retornar usuário
        const response = await api.post("/users/oauth", newUser, {
          headers: {
            Authorization: `Bearer ${clerkToken}`,
          },
        });

        const { oauth_user } = response.data;
        console.log("passanger: ", oauth_user);

        if (oauth_user) {
          await login({
            id: oauth_user.user.id,
            name: user.fullName,
            email: user.primaryEmailAddress.emailAddress,
            image: user.imageUrl,
            telephone: oauth_user.user.telephone,
            access_token: oauth_user.session.access_token,
            refresh_token: oauth_user.session.refresh_token,
            role: {
              type: "passenger",
            },
          });

          console.log("Usuário autenticado com sucesso");
        }
      }catch{
        console.log("erro ao registrar na api")
        router.replace("/(public)/login");

        }

      } else {
        console.log("User data not available after OAuth flow");
      }

      return router.replace("/(protected)/passenger/passengerScreen");
    }
    // else{
    //   return router.replace("/login");
    // }

  }

  useEffect(() => {
    handleSignIn();
  }, [isSignedIn]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
