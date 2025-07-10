import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  Image,
} from "react-native"
import { IconInfoCircleFilled} from "@tabler/icons-react-native"

import { s } from "./styles"
import { colors } from "@/styles/theme"

export type PlaceProps = {
  id: string
  name: string
  description: string
  coupons: number
  cover: string
  address: string
}

type Props = TouchableOpacityProps & {
  data: PlaceProps
}

export function Place({ data, ...rest }: Props) {
  return (
    <TouchableOpacity style={s.container} {...rest}>
      <Image style={s.image} source={{ uri: data.cover }} />

      <View style={s.content}>
        <Text style={s.name}>{data.name}</Text>
        <Text style={s.description} numberOfLines={2}>
          {data.description}
        </Text>

        <View style={s.footer}>
          <IconInfoCircleFilled size={16} fill={colors.green.base} />
          <Text style={s.tickets}>{/*data.coupons*/} clique para mais informaciones</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
