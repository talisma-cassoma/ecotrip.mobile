import { useEffect, useState, useRef } from "react"
import { View, Alert, Text, useWindowDimensions, StyleSheet } from "react-native"
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps"
import { IconArrowLeft } from "@tabler/icons-react-native"
import { fontFamily, colors } from "@/styles/theme"

import { AvailableDriverProps } from "@/components/availableDriver"

import MapViewDirections from "react-native-maps-directions"
import { useTrip } from "@/context/tripContext"

import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet"
import { AvailableDriver } from "@/components/availableDriver"
import { Button } from "@/components/button"
import { router } from "expo-router"

import { api, socket } from "@/services/api"
import { useUserAuth } from "@/context/userAuthContext"
import { BookingTripCard } from "@/components/bookingTripCard"

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

const driverMockData: AvailableDriverProps[] = [
    {
        id: "1",
        name: "brian Johnson",
        description: "Experienced driver with a clean record.",
        image: "https://picsum.photos/id/237/200/300",
        telephone: "+1234567890",
        carModel: "Toyota Corolla",
        carPlate: "ABC-1234",
        carColor: "Blue",
    }, {
        id: "2",
        name: "John Doe",
        description: "Friendly and reliable driver.",
        image: "https://picsum.photos/id/237/200/300",
        telephone: "+0987654321",
        carModel: "Honda Civic",
        carPlate: "XYZ-5678",
        carColor: "Red",
    },
    {
        id: "3",
        name: "david oliver",
        description: "Friendly and reliable driver.",
        image: "https://picsum.photos/id/237/200/300",
        telephone: "+0987654321",
        carModel: "Ford Focus",
        carPlate: "LMN-9012",
        carColor: "Black",
    }, {
        id: "4",
        name: "Paul Walker",
        description: "Friendly and reliable driver.",
        image: "https://picsum.photos/id/237/200/300",
        telephone: "+0987654321",
        carModel: "Chevrolet Malibu",
        carPlate: "QRS-3456",
        carColor: "White",
    }, {
        id: "5",
        name: "mary jane watson",
        description: "Friendly and reliable driver.",
        image: "https://picsum.photos/id/237/200/300",
        telephone: "+0987654321",
        carModel: "Nissan Altima",
        carPlate: "TUV-7890",
        carColor: "Gray",
    }, {
        id: "6",
        name: "peter parker",
        description: "Friendly and reliable driver.",
        image: "https://picsum.photos/id/237/200/300",
        telephone: "+0987654321",
        carModel: "Hyundai Elantra",
        carPlate: "WXY-1234",
        carColor: "Silver",
    }
]

export default function SelectADriver() {
    const mapRef = useRef<MapView>(null)
    const bottomSheetRef = useRef<BottomSheet>(null)
    const dimensions = useWindowDimensions()
    const snapPoints = {
        min: 278,
        max: dimensions.height - 268,
    }
  const [drivers, setDrivers] = useState<AvailableDriverProps[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<AvailableDriverProps | null>(null);
  const [isSelected, setIsSelected] = useState(false);
  const [tripId, setTripId] = useState<string | null>(null);

  const { originCoords, destinationCoords, distance, duration, price } = useTrip();
  const { user } = useUserAuth();

  const fetchDrivers = async () => {
    if (!user) {
      router.replace('/login');
      return;
    }

    try {
      const newTrip = {
        origin: {
          name: originCoords?.name,
          location: {
            lat: originCoords?.latitude,
            lng: originCoords?.longitude,
          },
        },
        destination: {
          name: destinationCoords?.name,
          location: {
            lat: destinationCoords?.latitude,
            lng: destinationCoords?.longitude,
          },
        },
        distance,
        duration,
        price,
        directions: {},
        passengerId: user.id,
      };

      const response = await api.post('/trips/new-trip', newTrip, {
        headers: { Authorization: `Bearer ${user?.access_token}` },
      });

      const { tripId } = response.data;
      setTripId(tripId);
      console.log('Resposta:', response.data);
    } catch (err) {
      console.error("Erro ao criar nova viagem:", err);
    }
  };
  
  const cancelTripByPassenger = async () => {
  try {
    const reason = "Cancelado pelo passageiro";
    const response = await api.post(`/trips/${tripId}/cancel/passenger`,
        { user_id: user?.id, reason: reason },
      {
        headers: {
           access_token: user?.access_token,
          refresh_token: user?.refresh_token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao cancelar como passageiro:', error);
    throw error;
  }
};
 
const confirmTrip = async () => {
  try {
    const response = await api.post(`/trips/${tripId}/confirm`, 
      { driver_id: selectedDriver?.id }, 
      {
        headers: {
          access_token: user?.access_token,
          refresh_token: user?.refresh_token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao confirmar viagem:', error);
    throw error;
  }
};


  const handleRideCancel = () => {
        Alert.alert("Cancelar corrida", "Você tem certeza que deseja cancelar a corrida?", [
            {
                text: "Não",
                style: "cancel"
            },
            {
                text: "Sim",
                onPress: () => {
                    setSelectedDriver(null)
                    setIsSelected(false)
                    cancelTripByPassenger()
                    console.log("Corrida cancelada")
                }
            }
        ])
    }

  useEffect(() => {
    fetchDrivers();
  }, []);

  useEffect(() => {
    if (!tripId || !user?.id) return;

     console.log("TripId definido, conectando socket:", tripId);

    socket.connect();

    socket.on('connect', () => {
      console.log('Conectado:', socket.id);
      socket.emit('client:available-drivers', {
        passengerId: user.id,
        tripId,
      });
      
    });
    socket.on(`server:available-drivers/${tripId}`, (data) => {
      if (data.error) {
        console.warn('Erro:', data.error);
      } else {
        const drivers: AvailableDriverProps = {
          id: data.id,
          name: data.name,
          description: data.description,
          image: data.image,
          telephone: data.telephone,
          carModel: data.carModel,
          carPlate: data.carPlate,
          carColor: data.carColor,
          rating: data.rating,
        complited_rides: data.complited_rides
        };
        setDrivers([drivers]);
      }
    });


    return () => {
      socket.off('connect');
      socket.off(`server:available-drivers/${tripId}`);
      socket.disconnect();
    };
  }, [tripId]);

  useEffect(() => {
    setIsSelected(true);
  }, [selectedDriver]);

    return (
        <View style={{ flex: 1, backgroundColor: "#CECECE" }}>
            <MapView
                ref={mapRef}
                customMapStyle={whiteMapStyle}
                provider={PROVIDER_GOOGLE}
                zoomControlEnabled={true}
                zoomEnabled={true}
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
                    coordinate={{
                        latitude: 1.8575468799281134,
                        longitude: 9.773508861048843
                    }}
                // image={require("@/assets/location.png")}
                />

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
            <BottomSheet
                ref={bottomSheetRef}
                snapPoints={[snapPoints.min, snapPoints.max]}
                handleIndicatorStyle={s.indicator}
                backgroundStyle={s.container}
                enableOverDrag={false}
            >
                {selectedDriver?.id ? (
                    <View style={{ padding: 24 }}>
                        <AvailableDriver {...selectedDriver} onPress={() => { }} />
                        <BookingTripCard />
                        <Button onPress={handleRideCancel} style={{ marginTop: 16 }}>
                            <Button.Title>cancelar</Button.Title>
                        </Button>
                    </View>
                ) : (
                    <BottomSheetFlatList
                        data={drivers}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <AvailableDriver
                                {...item}
                                onPress={() => {
                                    confirmTrip()
                                    setSelectedDriver(item)
                                    console.log("conductor selecionado:", selectedDriver?.id)
                                }}
                                isSelected={isSelected}
                            />
                        )}
                        contentContainerStyle={s.content}
                        ListHeaderComponent={() => (
                            <View>
                                <Button style={{ width: 40, height: 40, marginBottom: 20 }} onPress={() => router.back()}>
                                    <Button.Icon icon={IconArrowLeft} />
                                </Button>
                                <BookingTripCard />
                                <Text style={s.title}>Condutores cercanos</Text>
                            </View>
                        )}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </BottomSheet>
        </View>
    )
}

export const s = StyleSheet.create({
    container: {
        backgroundColor: colors.gray[100],
    },
    content: {
        gap: 12,
        padding: 24,
        paddingBottom: 100,
    },
    indicator: {
        width: 80,
        height: 4,
        backgroundColor: colors.gray[300],
    },
    title: {
        color: colors.gray[600],
        fontSize: 16,
        fontFamily: fontFamily.regular,
        marginTop: 4,
    },
})
