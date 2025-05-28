import { View, Text } from "react-native"
import { router } from "expo-router"

import { Steps } from "@/components/steps"
import { Button } from "@/components/button"
import { Welcome } from "@/components/welcome"
import { LocationProvider } from "@/context/locationContext"

export default function Index() {
  return (
    <LocationProvider>
    <View style={{ flex: 1, padding: 40, gap: 40 }}>
      <Welcome />
      <Steps />

      <Button onPress={() => router.navigate("/home")}>
        <Button.Title>
          Comenzar
        </Button.Title>
      </Button>
    </View>
      </LocationProvider>
  )
}
