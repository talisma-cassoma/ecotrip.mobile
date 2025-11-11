import { useRef } from "react"
import { Text, useWindowDimensions } from "react-native"
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet"

import { s } from "./styles"
import { Place} from "../place"
import { BookRideDialog } from "../bookRideDialog"
import { useTrip } from "@/context/tripContext"
import { PlaceProps } from "@/types"

type RideModalProps = {
  data: PlaceProps[]
}


export function RideModal({ data }: RideModalProps) {
  const dimensions = useWindowDimensions()
  const bottomSheetRef = useRef<BottomSheet>(null)

  const { userLocation,setDestinationCoords, 
    setOriginCoords 
  } = useTrip();

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
        keyExtractor={(item: PlaceProps, index: number) => item.id + index}
        renderItem={({ item }:{item: PlaceProps}) => (
          <Place
            {...item} 
            onPress={() => {
              if (item.latitude && item.longitude){
                //userLocation();
                setOriginCoords({latitude: 1.8575468799281134, longitude: 9.773508861048843, name:"Ubicatión atual"});
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
