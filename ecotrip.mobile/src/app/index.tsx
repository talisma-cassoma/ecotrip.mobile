import { View, Text } from "react-native"
import { router, Stack } from "expo-router"

import { Steps } from "@/components/steps"
import { Button } from "@/components/button"
import { Welcome } from "@/components/welcome"
import { useUserAuth } from "@/context/userAuthContext"
import Home from "@/app/home"

export default function Index() {
  const { user }= useUserAuth()
  return (
        <View style={{ flex: 1, padding: 40, gap: 40 }}>
          <Welcome />
          <Steps />

          <Button onPress={() => router.navigate("/login")} style={{ marginTop: 40 }}>
            <Button.Title>
              Comenzar
            </Button.Title>
          </Button>
        </View>)
}
