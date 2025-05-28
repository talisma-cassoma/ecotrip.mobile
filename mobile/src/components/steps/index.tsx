import { View, Text } from "react-native"
import { IconMapPin, IconCoinFilled, IconCarFilled, IconCar, IconCoin  } from "@tabler/icons-react-native"

import { s } from "./styles"
import { Step } from "../step"

export function Steps() {
  return (
    <View style={s.container}>
      <Text style={s.title}>Veja como funciona:</Text>

      <Step
        icon={IconMapPin}
        title="Solicita viajes"
        description="Elige un origen y un destino para tu viaje"
      />

      <Step
        icon={IconCoin}
        title="Acuerda el precio"
        description="Selecciona una tarifa o establece tu precio"
      />

      <Step
        icon={IconCar}
        title="Selecciona un conductor"
        description="Elige al conductor adecuado para el viaje"
      />
    </View>
  )
}
