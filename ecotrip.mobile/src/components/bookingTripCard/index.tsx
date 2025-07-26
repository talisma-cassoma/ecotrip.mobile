import { IconArrowRight } from "@tabler/icons-react-native"
import { View, Alert, Text, useWindowDimensions, StyleSheet } from "react-native"
import { fontFamily, colors } from "@/styles/theme"
import { useTrip } from "@/context/tripContext"
import { formatDistance, formatDuration } from "@/utils/converter"

export function BookingTripCard() {

    const { originCoords, destinationCoords, distance, duration, price } = useTrip();

    return (
        <View style={{flexDirection:"column", alignItems:"center", gap:10, margin:20}}>
            {distance && <Text> {formatDistance(distance)}</Text>}
            <View style={{ width: "auto", flexDirection: "row", gap: 12, justifyContent: "center" }}>
                <Text>{originCoords?.name}</Text>
                <IconArrowRight
                    width={24}
                    height={24}
                    color={colors.gray[600]}
                />
                <Text>{destinationCoords?.name}</Text>
            </View>
            <View style={{ flexDirection: "column", alignSelf: "center" }}>
                {distance && (
                    <Text style={{
                        color: colors.gray[600],
                        fontSize: 18,
                        fontFamily: fontFamily.semiBold,
                    }}>{price} Francos</Text>
                )}
            </View>
            <Text >{duration ? (`el tempo previsto de viaje es ${formatDuration(duration)}`) : ("")}</Text>
        </View>)

}