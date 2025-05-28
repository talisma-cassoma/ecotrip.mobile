import { Image, Text, View } from "react-native"

import { s } from "./styles"

export function Welcome() {
  return (
    <View>

      <Image source={require("@/assets/logoPreta.png")} style={s.logo} />

      <Text style={s.title}>¡Bienvenido a EcoTrip!</Text>

      <Text style={s.subtitle}>
        Puedes pedir o realizar viajes en nuestra{"\n"}
        plataforma.
      </Text>
    </View>
  )
}
