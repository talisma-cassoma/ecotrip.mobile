import { useRef } from "react"
import { Text, useWindowDimensions } from "react-native"
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet"
import { router } from "expo-router"

import { s } from "./styles"
import { Place, PlaceProps } from "../place"
import { BookRideDialog } from "../bookRideDialog"

type Props = {
  data: PlaceProps[]
}

export function RideModal({ data }: Props) {
  const dimensions = useWindowDimensions()
  const bottomSheetRef = useRef<BottomSheet>(null)

  const snapPoints = {
    min: 378,
    max: dimensions.height - 268,
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={[snapPoints.min, snapPoints.max]}
      handleIndicatorStyle={s.indicator}
      backgroundStyle={s.container}
      enableOverDrag={false}
    >
      <BookRideDialog />
      <BottomSheetFlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Place
            data={item}
            onPress={() => router.navigate(`./ride/${item.id}`)}
          />
        )}
        contentContainerStyle={s.content}
        ListHeaderComponent={() => (
          <Text style={s.title}>Lugares cercanos de interes</Text>
        )}
        showsVerticalScrollIndicator={false}
      />
    </BottomSheet>
  )
}
