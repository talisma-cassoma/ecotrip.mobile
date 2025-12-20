import { useEffect, useState, useRef } from "react";
import { View, Alert, Text, useWindowDimensions, StyleSheet } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { IconArrowLeft } from "@tabler/icons-react-native";
import { AxiosError } from "axios";
import { router } from "expo-router";

import { fontFamily, colors } from "@/styles/theme";
import { api } from "@/services/api";
import { useTrip } from "@/context/tripContext";
import { useUserAuth } from "@/hooks/useUserAuth";
import { usePassenger } from "@/context/passengerContext";

import { AvailableDriver, AvailableDriverCompProps } from "@/components/availableDriver";
import { BookingTripCard } from "@/components/bookingTripCard";
import { Button } from "@/components/button";
import { TripRequestProps } from "@/types";

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
];




export default function SelectADriver() {
    const mapRef = useRef<MapView>(null);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const dimensions = useWindowDimensions();
    const snapPoints = { min: 278, max: dimensions.height - 268 };

    const [selectedDriver, setSelectedDriver] = useState<AvailableDriverCompProps | null>(null);
    const [isSelected, setIsSelected] = useState(false);
    const [tripId, setTripId] = useState<string | null>(null);
    const [trip, setTrip] = useState<TripRequestProps | null>(null);


    const { originCoords, destinationCoords, distance, duration, price } = useTrip();
    const { user } = useUserAuth();
    const { createRoom, availableDrivers, isConnected, socket } = usePassenger();

    const fetchDrivers = async () => {
        if (!user) {
            router.replace("/login");
            return;
        }

        try {
            const newTrip = {
                origin: {
                    name: originCoords?.name || "",
                    location: {
                        lat: originCoords?.latitude || 0,
                        lng: originCoords?.longitude || 0,
                    },
                },
                destination: {
                    name: destinationCoords?.name || "",
                    location: {
                        lat: destinationCoords?.latitude || 0,
                        lng: destinationCoords?.longitude || 0,
                    },
                },
                distance,
                duration,
                price,
                directions: {},
                email: user.email,
            };

            const room = {
                owner: {
                    ...user,
                    socketId: socket?.id
                },
                price: newTrip?.price ?? 0,
                origin: newTrip.origin,
                destination: newTrip.destination,
                distance: newTrip.distance ?? 2,
                duration: newTrip.duration ?? 2,
                directions: newTrip.directions,
                email: user.email,
            };

            console.log("socketId:",socket?.id);
            createRoom({
                ...user,
                socketId: socket?.id
            }, room);
            console.log("Criando nova viagem:", newTrip);
            const response = await api.post(
                `/trips/new-trip`,
                { ...room },
                {
                    headers: {
                        access_token: user?.access_token,
                        refresh_token: user?.refresh_token,
                    },
                }
            );
            setTripId(response.data.tripId);
            console.log("Viagem criada com ID:", response.data.tripId);


        } catch (err) {
            console.error("Erro ao criar nova viagem:", err);
        }
    };

    const confirmTrip = async () => {
        try {
            const response = await api.post(`/trips/${tripId}/confirm`, {
                driver_email: selectedDriver?.email,
            });
            return response.data;
        } catch (error) {
            const err = error as AxiosError;
            if (err.response) {
                const status = err.response.status;
                if (status === 401 || status === 403) {
                    console.warn("Sessão expirada. Redirecionando para login...");
                    router.replace("/login");
                    return;
                }
            }
            console.error("Erro ao confirmar viagem:", error);
            throw error;
        }
    };

    const cancelTripByPassenger = async () => {
        try {
            const response = await api.post(
                `/trips/${tripId}/cancel/passenger`,
                { user_id: user?.id, reason: "Cancelado pelo passageiro" },
                {
                    headers: {
                        access_token: user?.access_token,
                        refresh_token: user?.refresh_token,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Erro ao cancelar como passageiro:", error);
            throw error;
        }
    };

    const handleRideCancel = () => {
        Alert.alert("Cancelar corrida", "Você tem certeza que deseja cancelar a corrida?", [
            { text: "Não", style: "cancel" },
            {
                text: "Sim",
                onPress: () => {
                    setSelectedDriver(null);
                    setIsSelected(false);
                    cancelTripByPassenger();
                    router.replace("/(protected)/passenger/home");
                },
            },
        ]);
    };

    useEffect(() => {
        if (isConnected) {
            fetchDrivers();
        }
    }, [isConnected]);


    useEffect(() => {
        return () => {
            if (retryRef.current) clearTimeout(retryRef.current);
        };
    }, []);


    useEffect(() => {
        setIsSelected(true);
    }, [selectedDriver]);

    return (
        <View style={{ flex: 1, backgroundColor: "#CECECE" }}>
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                customMapStyle={whiteMapStyle}
                style={{ flex: 1 }}
                zoomEnabled
                zoomControlEnabled
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
                        longitude: 9.773508861048843,
                    }}
                />

                {originCoords?.latitude && destinationCoords?.latitude && (
                    <>
                        <MapViewDirections
                            origin={{
                                latitude: originCoords.latitude,
                                longitude: originCoords.longitude,
                            }}
                            destination={{
                                latitude: destinationCoords.latitude,
                                longitude: destinationCoords.longitude,
                            }}
                            apikey={String(process.env.EXPO_PUBLIC_GOOGLE_MAPS_APIKEY)}
                            strokeWidth={4}
                            strokeColor="#007bc9"
                            onReady={(result) => {
                                mapRef.current?.fitToCoordinates(result.coordinates, {
                                    edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                                });
                            }}
                            onError={(error) => console.warn("Erro ao calcular rota:", error)}
                        />
                        <Marker
                            coordinate={{
                                latitude: originCoords.latitude,
                                longitude: originCoords.longitude,
                            }}
                            image={require("@/assets/location.png")}
                            title="Ponto de partida"
                        />
                        <Marker
                            coordinate={{
                                latitude: destinationCoords.latitude,
                                longitude: destinationCoords.longitude,
                            }}
                            image={require("@/assets/pin.png")}
                            title="Destino"
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
                {selectedDriver ? (
                    <View style={{ padding: 24 }}>
                        <AvailableDriver {...selectedDriver} onPress={() => { }} />
                        <BookingTripCard />
                        <Button onPress={handleRideCancel} style={{ marginTop: 16 }}>
                            <Button.Title>Cancelar</Button.Title>
                        </Button>
                    </View>
                ) : (
                    <BottomSheetFlatList<AvailableDriverCompProps>
                        data={availableDrivers}
                        keyExtractor={(item: AvailableDriverCompProps) => item.id}
                        renderItem={({ item }: { item: AvailableDriverCompProps }) => (
                            <AvailableDriver
                                {...item}
                                onPress={() => {
                                    confirmTrip()
                                    setSelectedDriver(item)
                                    console.log("conductor selecionado:", item);
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
    );
}

const s = StyleSheet.create({
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
});
