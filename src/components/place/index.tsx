import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  Image,
} from "react-native"
import { IconInfoCircleFilled } from "@tabler/icons-react-native"

import { s } from "./styles"
import { colors } from "@/styles/theme"

import { PlaceProps } from "@/types"


export function Place({ id, name, description, cover, ...rest }: PlaceProps & TouchableOpacityProps) {
  return (
    <TouchableOpacity style={s.container} {...rest}>
      <Image style={s.image} source={{ uri: cover }} />

      <View style={s.content}>
        <Text style={s.name}>{name}</Text>
        <Text style={s.description} numberOfLines={2}>
          {description}
        </Text>

        <View style={s.footer}>
          <IconInfoCircleFilled size={16} fill={colors.green.base} />
          <Text style={s.tickets}>{/*data.coupons*/} clique para mais informaciones</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
