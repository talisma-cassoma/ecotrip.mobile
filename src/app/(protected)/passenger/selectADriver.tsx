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

import { AvailableDriver } from "@/components/availableDriver";
import { BookingTripCard } from "@/components/bookingTripCard";
import { Button } from "@/components/button";
import { TripRequestProps, AvailableDriverCompProps } from "@/types";


type ApiResult<T> =
    | { ok: true; data: T }
    | { ok: false; status?: number; message: string };

export default function SelectADriver() {
    const mapRef = useRef<MapView>(null);
    const bottomSheetRef = useRef<BottomSheet>(null);

    const dimensions = useWindowDimensions();
    const snapPoints = { min: 278, max: dimensions.height - 268 };

    const [selectedDriver, setSelectedDriver] = useState<AvailableDriverCompProps | null>(null);
    const [isSelected, setIsSelected] = useState(false);
    const [loading, setLoading] = useState(false);

    const { originCoords, destinationCoords, distance, duration, price, setDistance, setDuration } = useTrip();
    const { user } = useUserAuth();
    const { requestNewTrip, availableDrivers, isConnected, socket, newTrip, setNewTrip } = usePassenger();

    const safeApiError = (error: unknown, defaultMessage: string): ApiResult<any> => {
        const err = error as AxiosError;

        if (!err.response) {
            return { ok: false, message: "Servidor indisponível" };
        }

        if (err.response.status === 401 || err.response.status === 403) {
            router.replace("/login");
        }

        return {
            ok: false,
            status: err.response.status,
            message: defaultMessage,
        };
    };

    const fetchDrivers = async (): Promise<void> => {
        if (!user || !socket?.id) return;

        try {
            const room = {
                id: "", // Será preenchido após criação da viagem
                owner: {
                    ...user,
                    id: user.id,
                    socketId: socket.id,
                },
                price: price ?? 0,
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
                distance: distance ?? 0,
                duration: duration ?? 0,
                directions: {},
                email: user.email,
            };

            // console.log("user:", user);
            console.log("user id:", user?.id);;

            const response = await api.post(
                "/trips/new-trip",
                room,
                {
                    headers: {
                        access_token: user.access_token,
                        refresh_token: user.refresh_token,
                    },
                }
            );

            const trip_id = response.data.tripId;
            console.log("trip_id:", trip_id);

            room.id = trip_id

            requestNewTrip(room.owner, room);

        } catch (error) {
            console.error("Erro ao criar viagem", error);
        }
    };

 
    const cancelTripByPassenger = async (): Promise<ApiResult<any>> => {
        if (!newTrip?.trip?.id || !user) {
            return { ok: false, message: "Viagem inválida" };
        }

        try {
            const response = await api.post(
                `/trips/${newTrip.trip?.id}/cancel/passenger`,
                { trip: newTrip.trip, reason: "Cancelado pelo passageiro" },
                {
                    headers: {
                        access_token: user.access_token,
                        refresh_token: user.refresh_token,
                    },
                }
            );

            return { ok: true, data: response.data };

        } catch (error) {
            return safeApiError(error, "Erro ao cancelar viagem");
        }
    };

    useEffect(() => {
        if (isConnected) {
            fetchDrivers();
        }
    }, [isConnected]);

    useEffect(() => {
        setIsSelected(!!selectedDriver);
    }, [selectedDriver]);

const handleSelectDriver = async (driver: AvailableDriverCompProps) => {
    if (!newTrip?.trip || !user) {
        Alert.alert("Erro", "Viagem ainda não criada");
        return;
    }

    setLoading(true);

    // Cria uma cópia do trip atual com driver selecionado
    const updatedTrip: TripRequestProps = {
        ...newTrip.trip,
        assignedDriver: driver,
    };

    try {
        const response = await api.post(
            `/trips/${newTrip.trip.id}/confirm`,
            updatedTrip,
            {
                headers: {
                    access_token: user.access_token,
                    refresh_token: user.refresh_token,
                },
            }
        );

        // Atualiza o estado apenas depois da confirmação
         setNewTrip((prev) => {
            if (!prev || !prev.trip) return prev;

            const updatedTrip: TripRequestProps = {
                ...prev.trip,
                assignedDriver: driver,
            };

            console.log("updatedNewTrip:", updatedTrip);
            return { ...prev, trip: updatedTrip };
        });
        setSelectedDriver(driver);
    } catch (error) {
        const err = error as AxiosError;
        console.error("Erro ao confirmar viagem:", err.response?.data || err.message);
        Alert.alert("Erro ao confirmar viagem");

    } finally {
        setLoading(false);
    }
};

    const handleRideCancel = () => {
        Alert.alert("Cancelar corrida", "Deseja cancelar a corrida?", [
            { text: "Não", style: "cancel" },
            {
                text: "Sim",
                onPress: async () => {
                    await cancelTripByPassenger();
                    setSelectedDriver(null);
                    setNewTrip(null);
                    router.replace("/(protected)/passenger/home");
                },
            },
        ]);
    };

    return (
        <View style={{ flex: 1 }}>
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={{ flex: 1 }}
            >
                {originCoords && destinationCoords && (
                    <MapViewDirections
                        origin={originCoords}
                        destination={destinationCoords}
                        apikey={String(process.env.EXPO_PUBLIC_GOOGLE_MAPS_APIKEY)}
                        onError={() => {
                            setDistance(null);
                            setDuration(null);
                        }}
                    />
                )}
            </MapView>

            <BottomSheet
                ref={bottomSheetRef}
                snapPoints={[snapPoints.min, snapPoints.max]}
                backgroundStyle={s.container}
            >
                {selectedDriver ? (
                    <View style={{ padding: 24 }}>
                        <AvailableDriver {...selectedDriver} onPress={() => { }} />
                        <BookingTripCard />
                        <Button onPress={handleRideCancel}>
                            <Button.Title>Cancelar</Button.Title>
                        </Button>
                    </View>
                ) : (
                    <BottomSheetFlatList
                        data={availableDrivers}
                        keyExtractor={(item: AvailableDriverCompProps) => item.id}
                        renderItem={({ item }: { item: AvailableDriverCompProps }) => (
                            <AvailableDriver
                                {...item}
                                onPress={() => handleSelectDriver(item)}
                                isSelected={isSelected}
                            />
                        )}
                        ListEmptyComponent={
                            <View style={{ padding: 54, alignItems: 'center' }}>
                                <Text style={s.title}>Aguardando motoristas...</Text>
                            </View>
                        }
                    />
                )}
            </BottomSheet>
        </View>
    );
}

const s = StyleSheet.create({
    container: {
        backgroundColor: colors.gray[100],
        minHeight: 478,
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
    },
});
