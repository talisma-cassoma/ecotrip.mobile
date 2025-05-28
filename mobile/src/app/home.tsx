import { useEffect, useState, useRef } from "react"
import { View, Alert, Text } from "react-native"
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps"

import { router } from "expo-router"

import { api } from "@/services/api"
import { fontFamily, colors } from "@/styles/theme"

import { Places } from "@/components/places"
import { PlaceProps } from "@/components/place"
import { Categories, CategoriesProps } from "@/components/categories"
import MapViewDirections from "react-native-maps-directions"
import { useLocation } from "@/context/locationContext"
import { LocationCoords, LocationContext, LocationProvider } from "@/context/locationContext"

type MarketsProps = PlaceProps & {
  latitude: number
  longitude: number
}

export default function Home() {
  const mapRef = useRef<MapView>(null)

  const [categories, setCategories] = useState<CategoriesProps>([])
  const [category, setCategory] = useState("")
  const [markets, setMarkets] = useState<MarketsProps[]>([])
  const [origin, setorigin] = useState<LocationCoords>({latitude: 1.8017427763217277, longitude: 10.684559752006317})
  
  const [destination, setDestination] = useState<LocationCoords>(null)
  const { originCoords, destinationCoords } = useLocation();


  async function fetchCategories() {
    try {
      const { data } = await api.get("/categories")
      setCategories(data)
      setCategory(data[0].id)
    } catch (error) {
      console.log(error)
      Alert.alert("Categorias", "Não foi possível carregar as categorias.")
    }
  }

  async function fetchMarkets() {
    try {
      if (!category) return
      const { data } = await api.get("/markets/category/" + category)
      setMarkets(data)
    } catch (error) {
      console.log(error)
      Alert.alert("Locais", "Não foi possível carregar os locais.")
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchMarkets()
  }, [category])

  useEffect(() => {
    (async () => {
      if (originCoords && destinationCoords) {
        setorigin(originCoords)
        setDestination(destinationCoords)
        console.log("Origin:", originCoords)
        console.log("Destination:", destinationCoords)
      }
    })()
  }, [originCoords, destinationCoords])

  return (
    <LocationContext.Provider value={{ originCoords, destinationCoords, setOriginCoords: setorigin, setDestinationCoords: setDestination }}>
      <View style={{ flex: 1, backgroundColor: "#CECECE" }}>
        <Categories
          data={categories}
          onSelect={setCategory} 
          selected={category}
        />

        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          initialRegion={{
            latitude: 1.8575468799281134, 
            longitude: 9.773508861048843,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker
            identifier="current"
            coordinate={{latitude: 1.8575468799281134, 
            longitude: 9.773508861048843}}
            image={require("@/assets/location.png")}
          />

          {markets.map((item) => (
            <Marker
              key={item.id}
              identifier={item.id}
              coordinate={{
                latitude: item.latitude,
                longitude: item.longitude,
              }}
              image={require("@/assets/pin.png")}
            >
              <Callout onPress={() => router.navigate(`/market/${item.id}`)}>
                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.gray[600],
                      fontFamily: fontFamily.medium,
                    }}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.gray[600],
                      fontFamily: fontFamily.regular,
                    }}
                  >
                    {item.address}
                  </Text>
                </View>
              </Callout>
            </Marker>
          ))}

          {origin && destination && (
            <>
              <MapViewDirections
                key={`route-${origin.latitude}-${origin.longitude}`}
                origin={{
                  latitude: origin.latitude,
                  longitude: origin.longitude
                }}
                destination={{
                  latitude: destination.latitude,
                  longitude: destination.longitude

                }}
                apikey={String(process.env.EXPO_PUBLIC_GOOGLE_MAPS_APIKEY)}
                strokeWidth={4}
                strokeColor="blue"
                onReady={(result) => {
                  mapRef.current?.fitToCoordinates(result.coordinates, {
                    edgePadding: {
                      top: 50,
                      right: 50,
                      bottom: 50,
                      left: 50,
                    },
                  })
                }}
                onError={(error) =>
                  console.warn("Erro ao calcular rota:", error)
                }
              />
              {/* <Marker
                coordinate={origin}
                title="Starting Point"
              />
              <Marker
                coordinate={{
                  latitude: 34.25125262015284,
                  longitude: -6.5724847169095355

                }}
                title="Destination Point"
              /> */}
            </>
          )}
        </MapView>

        <Places data={markets} />
      </View>
      </LocationContext.Provider>
  )
}
