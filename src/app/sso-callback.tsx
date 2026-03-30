// import { useAuth } from "@clerk/clerk-expo";
// import { router } from "expo-router";
// import { useEffect } from "react";
// import { View, ActivityIndicator } from "react-native";
// import { useUserAuth } from "@/context/userAuthContext";
// import { api } from "@/services/api";
// import { useUser } from "@clerk/clerk-expo";
// import { AuthUser } from "@/types";

// export default function SSOCallback() {
//   const { isSignedIn, getToken } = useAuth();
//   const { user } = useUser();
//   const { login } = useUserAuth();
 
//   console.log("ola daqui sso")


//   async function handleSignIn() {
    
//     if (isSignedIn) {
//       if (user && user.fullName && user.primaryEmailAddress) {
//         // pega token do Clerk (JWT)
//         const clerkToken = await getToken();

//         // pega dados do usuário do Clerk
//         const newUser = {
//           name: user.fullName,
//           email: user.primaryEmailAddress.emailAddress,
//           role: "oauth_user",
//           telephone: "",
//           image: user.imageUrl,
//         };
//         try{

//         // envia para seu backend para criar/retornar usuário
//         const response = await api.post("/users/oauth", newUser, {
//           headers: {
//             Authorization: `Bearer ${clerkToken}`,
//           },
//         });
// ;

//       if (!response.data || !response.data.session || !response.data.user) {
//         throw new Error("Resposta inválida do servidor");
//       }

//       const { session, oauth_user } = response.data;

//       // ✅ Validar tokens
//       if (!session.access_token || !session.refresh_token) {
//         throw new Error("Tokens não fornecidos pelo servidor");
//       }

//       // Mapear resposta da API → AuthUser
//       const userData: AuthUser = oauth_user.role === 'driver'
//         ? {
//           id: oauth_user.id,
//           name: oauth_user.name,
//           email: oauth_user.email,
//           image: oauth_user.image,
//           access_token: session.access_token,
//           refresh_token: session.refresh_token,
//           telephone: oauth_user.telephone,
//           role: {
//             type: 'driver',
//             data: {
//               car_model: oauth_user.carModel,
//               car_plate: oauth_user.carPlate,
//               car_color: oauth_user.carColor,
//               license_number: oauth_user.licenseNumber,
//             },
//           },
//         }
//         : {
//           id: oauth_user.id,
//           name: oauth_user.name,
//           email: oauth_user.email,
//           image: oauth_user.image,
//           access_token: session.access_token,
//           refresh_token: session.refresh_token,
//           role: {
//             type: 'passenger',
//           },
//         };

//       // ✅ Aguardar login completo (inclusive persistência)
//       // ✅ Aguardar login completo (inclusive persistência)
//       await login(userData);

//       console.log("✅ Login bem-sucedido para:", userData.email);

//       // Redirecionar explicitamente para o grupo protegido.
//       // Se tiver papel, enviar direto para a rota apropriada para evitar um passo extra.
//       if (userData.role?.type === "driver") {
//         router.replace("/(protected)/driver/driverScreen");
//       } else {
//         router.replace("/(protected)/passenger/passengerScreen");
//       }
//       // O redirecionamento automático acontece em (protected)/_layout.tsx
//       }catch{
//         console.log("erro ao registrar na api")
//         router.replace("/(public)/login");

//         }

//       } else {
//         console.log("User data not available after OAuth flow");
//       }

//       //return router.replace("/(protected)/passenger/passengerScreen");
//     }
//     // else{
//     //   return router.replace("/login");
//     // }

//   }

//   useEffect(() => {
//     handleSignIn();
//   }, [isSignedIn]);

//   return (
//     <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
//       <ActivityIndicator size="large" />
//     </View>
//   );
// }
