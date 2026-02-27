import { IconArrowRight } from "@tabler/icons-react-native"
import { View, Alert, Text, useWindowDimensions, StyleSheet } from "react-native"
import { fontFamily, colors } from "@/styles/theme"
import { useTrip } from "@/context/tripContext"
import { formatDistance, formatDuration } from "@/utils/converter"
import { PriceInput } from "@/components/priceInput"

export function BookingTripCard() {

    const { originCoords, destinationCoords, distance, duration, price } = useTrip();

    return (
        <View style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            padding: 12, // Padding interno do card
            marginHorizontal: 16,
        }}>
            <View style={{ flexDirection: "column", alignItems: "center", gap: 10, margin: 20 }}>
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
                {distance && <Text> {formatDistance(distance)}</Text>}
                <Text >{duration ? (`el tempo previsto de viaje es ${formatDuration(duration)}`) : ("")}</Text>
            </View>
            {price && (
                <PriceInput
                    initialValue={price}
                    currencySymbol="Francos"
                    step={price / 10}
                />

            )}
        </View>)

}