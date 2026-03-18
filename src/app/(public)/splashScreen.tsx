import { View, Text } from "react-native"
import { router, Stack } from "expo-router"
import { Steps } from "@/components/steps"
import { Button } from "@/components/button"
import { Welcome } from "@/components/welcome"
import Toast from 'react-native-toast-message';
import { useEffect } from "react"
import * as ScreenOrientation from 'expo-screen-orientation';

//AsyncStorage.clear().then(() => console.log('AsyncStorage limpo!'));

export default function SplashScreen() {
   useEffect(() => {
    const unlockScreenOerientation = async () => {
      await ScreenOrientation.unlockAsync()
    }
    unlockScreenOerientation()
  }, [])
  return (
    <View style={{ flex: 1, padding: 40, gap: 40 }}>
      <Welcome />
      <Steps />

      <Button onPress={() => router.push("/login")} style={{ marginTop: 40 }}>
        <Button.Title>
          Comenzar
        </Button.Title>
      </Button>
     <Toast />
    </View>)
}
