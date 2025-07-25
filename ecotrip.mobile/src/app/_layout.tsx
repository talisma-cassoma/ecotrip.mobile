import { Stack } from "expo-router"
import { colors } from "@/styles/theme"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { TripProvider } from "@/context/tripContext"
import { UserAuthProvider } from "@/context/userAuthContext"
import {
  useFonts,
  Rubik_600SemiBold,
  Rubik_400Regular,
  Rubik_500Medium,
  Rubik_700Bold,
} from "@expo-google-fonts/rubik"

import { Loading } from "@/components/loading"

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Rubik_600SemiBold,
    Rubik_400Regular,
    Rubik_500Medium,
    Rubik_700Bold,
  })

  if (!fontsLoaded) {
    return <Loading />
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserAuthProvider>
      <TripProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.gray[100] },
          }}
        />
      </TripProvider>
      </UserAuthProvider>
    </GestureHandlerRootView>

  )
}
