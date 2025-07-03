import { useRef } from "react"
import { Text, useWindowDimensions } from "react-native"
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet"

import { s } from "./styles"
import { Place, PlaceProps } from "../place"
import { BookRideDialog } from "../bookRideDialog"
import { useLocation } from "@/context/locationContext"


type RidesProps = PlaceProps & {
  latitude: number
  longitude: number
  categoryId: string
  name: string
  description: string
  coupons: number
  address: string
  phone: string
  cover: string
}

type RideModalProps = {
  data: RidesProps[]
}


export function RideModal({ data }: RideModalProps) {
  const dimensions = useWindowDimensions()
  const bottomSheetRef = useRef<BottomSheet>(null)

  const { userLocation,setDestinationCoords, 
    setOriginCoords 
  } = useLocation();

  const snapPoints = {
    min: 378,
    max: dimensions.height - 368,
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={[snapPoints.min, snapPoints.max]}
      index={1} // começa no snapPoint maior
      handleIndicatorStyle={s.indicator}
      backgroundStyle={s.container}
      enableOverDrag={false} 
      enablePanDownToClose={false} 
    >
      <BookRideDialog />
      <BottomSheetFlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Place
            data={item}
            onPress={() => {
              if (item.latitude && item.longitude){
                //userLocation();
                setOriginCoords({latitude: 1.8575468799281134, longitude: 9.773508861048843, name:"ma position"});
                setDestinationCoords({ latitude: item.latitude, longitude: item.longitude , name: item.name});
              }
            }}
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
