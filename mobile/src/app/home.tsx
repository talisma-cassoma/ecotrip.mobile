import { useEffect, useState, useRef } from "react"
import { View, Alert, Text } from "react-native"
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps"

import { router } from "expo-router"

import { api } from "@/services/api"
import { fontFamily, colors } from "@/styles/theme"

import { RideModal } from "@/components/rideModal"
import { PlaceProps } from "@/components/place"
import { Categories, CategoriesProps } from "@/components/categories"
import MapViewDirections from "react-native-maps-directions"
import { useLocation } from "@/context/locationContext"
import { LocationCoords, LocationContext, LocationProvider } from "@/context/locationContext"
import { DropDownMenu } from "@/components/dropDownMenu"

type RidesProps = PlaceProps & {
  latitude: number
  longitude: number
}
const whiteMapStyle = [
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e9e9e9"
            },
            {
                "lightness": 17
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f5f5"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 17
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 29
            },
            {
                "weight": 0.2
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 18
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f5f5"
            },
            {
                "lightness": 21
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dedede"
            },
            {
                "lightness": 21
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#ffffff"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "saturation": 36
            },
            {
                "color": "#333333"
            },
            {
                "lightness": 40
            }
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f2f2f2"
            },
            {
                "lightness": 19
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#fefefe"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#fefefe"
            },
            {
                "lightness": 17
            },
            {
                "weight": 1.2
            }
        ]
    }
]

export default function Home() {
  const mapRef = useRef<MapView>(null)

  const [categories, setCategories] = useState<CategoriesProps>([])
  const [category, setCategory] = useState("")
  const [rides, setRides] = useState<RidesProps[]>([])
  const [origin, setorigin] = useState<LocationCoords>({latitude: 1.8017427763217277, longitude: 10.684559752006317})
  
  // const [destination, setDestination] = useState<LocationCoords>(null)
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

  async function fetchRides() {
    try {
      if (!category) return
      const { data } = await api.get("/rides/category/" + category)
      setRides(data)
    } catch (error) {
      console.log(error)
      Alert.alert("Locais", "Não foi possível carregar os locais.")
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchRides()
  }, [category])

  // useEffect(() => {
  //   (async () => {
  //     if (originCoords && destinationCoords) {
  //       setorigin(originCoords)
  //       setDestination(destinationCoords)
  //       console.log("Origin:", originCoords)
  //       console.log("Destination:", destinationCoords)
  //     }
  //   })()
  // }, [originCoords, destinationCoords])

  return (
    <>
       <DropDownMenu/>
      <View style={{ flex: 1, backgroundColor: "#CECECE" }}>
        <Categories
          data={categories}
          onSelect={setCategory} 
          selected={category}
        />

        <MapView
          ref={mapRef}
          customMapStyle={whiteMapStyle}
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
            // image={require("@/assets/location.png")}
          />

          {/* {rides.map((item) => (
            <Marker
              key={item.id}
              identifier={item.id}
              coordinate={{
                latitude: item.latitude,
                longitude: item.longitude,
              }}
              image={require("@/assets/pin.png")}
            >
              <Callout onPress={() => router.navigate(`/ride/${item.id}`)}>
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
          ))} */}

          {originCoords?.latitude && destinationCoords?.latitude && (
            <>
              <MapViewDirections
                key={`route-${originCoords.latitude}-${originCoords.longitude}`}
                origin={{
                  latitude: originCoords.latitude,
                  longitude: originCoords.longitude
                }}
                destination={{
                  latitude: destinationCoords.latitude,
                  longitude: destinationCoords.longitude

                }}
                apikey={String(process.env.EXPO_PUBLIC_GOOGLE_MAPS_APIKEY)}
                strokeWidth={4}
                strokeColor="#007bc9"
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
              <Marker
                key={`origin-${originCoords.latitude}-${originCoords.longitude}`}
                coordinate={{
                  latitude: originCoords.latitude,
                  longitude: originCoords.longitude
                }}
                image={require("@/assets/location.png")}
                title="Starting Point"
                onDragEnd={(event) => {
                  const { latitude, longitude } = event.nativeEvent.coordinate;
                  setorigin({ latitude, longitude });
                  console.log("Origin updated:", { latitude, longitude });
                }
                }
              />
              <Marker
                key={`destination-${destinationCoords.latitude}-${destinationCoords.longitude}`}
                coordinate={{
                  latitude: destinationCoords.latitude,
                  longitude: destinationCoords.longitude
                }}
                image={require("@/assets/pin.png")}
                title="Destination Point"
              />
            </>
          )}
        </MapView>

        <RideModal data={rides} />
      </View>
      </>
  )
}
