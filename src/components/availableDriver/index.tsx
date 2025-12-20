
import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  Image,
} from "react-native"
import { IconPhone, IconMessage, IconStarFilled } from "@tabler/icons-react-native"

import { styles } from "./styles"
import { colors, fontFamily } from "@/styles/theme"

import { AvailableDriverProps } from "@/types"

export interface AvailableDriverCompProps
  extends AvailableDriverProps,
    Omit<TouchableOpacityProps, 'id'> {}


export function AvailableDriver({ email, name, image, telephone, isSelected,
  car_model, car_plate, car_color, rating, complited_rides, ...rest }: AvailableDriverCompProps) {
  const handleCall = () => {
    // Implement call functionality
    console.log(`Calling ${telephone}`);
  }
  const handleMessage = () => {
    // Implement message functionality
    console.log(`Messaging ${telephone}`);
  }


  return (
    <TouchableOpacity style={styles.container} {...rest}>

      <View style={{ flexDirection: "row", flex: 1, alignItems: "center", gap: 4, justifyContent: "space-around" }}>

        <Image style={styles.image} source={{ uri: image }} />

        <View style={{ flexDirection: "column", alignItems: "center" }}>
          <Text style={styles.name}>{name}</Text>
          <Text style={{
            fontSize: 12,
            fontFamily: fontFamily.regular,
            color: colors.gray[400], alignItems: "center"
          }}>Calificación<Text style={{
            color: colors.green.base,
            fontFamily: fontFamily.semiBold,
            fontSize: 16
          }}> {rating} </Text> <IconStarFilled size={14} fill="#FFA500" /></Text>
        </View>

        <View style={{ flexDirection: "column", alignItems: "center", }}>
          <Text style={styles.label}>{car_model}</Text>
          <Text style={styles.label}> de color: {car_color}</Text>
          <Text style={styles.label}>{car_plate}</Text>
        </View>

      </View>

      {!isSelected && (
        <View style={{ flexDirection: "column", gap: 4, justifyContent: "space-around", alignItems: "center", width: 50 }}>
          <TouchableOpacity onPress={handleCall}>
            <IconPhone size={24} color={colors.green.light} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleMessage}>
            <IconMessage size={24} color={colors.green.light} />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  )
}