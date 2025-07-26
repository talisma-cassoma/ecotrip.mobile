import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { socket } from '../services/api';
import { IconUser, IconHome, IconBell, IconClock } from "@tabler/icons-react-native"
import { colors, fontFamily } from "@/styles/theme"
import { router } from "expo-router"
import { NewTripRequest, Trip } from '@/components/newTripRequest';
import { Button } from "@/components/button"
import { useTrip } from '@/context/tripContext';
import { useUserAuth } from '@/context/userAuthContext';
import { api } from '@/services/api';


export default function NewTripRequests() {

    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
    const [isSelected, setIsSelected] = useState(false)

    const { user } = useUserAuth()

    const handleAcceptTrip = (trip: Trip) => {
        console.log("aceitando a viagem", trip.id);
        setIsSelected(true)
        setSelectedTrip(trip);
        //informar ao clinte
        if (user?.role.type === 'driver') {
            socket.emit('client:accept-trip', {
                tripId: trip.id, 
                driver: {
                    id: user?.id,
                    name: user?.name,
                    image: user?.image,
                    telephone: "+212 000000000",
                    carModel: user.role.data.car_model,
                    carPlate: user.role.data.car_plate,
                    carColor: "Azul",
                    rating: user.role.data.rating,
                    complited_rides: user.role.data.complited_rides,
                }
            });
        }
    };

    const cancelTripByDriver = async () => {
  try {
    const reason = "driver cancel beacause is bored"; // Defina o motivo de cancelamento
    const response = await api.post(`/trips/${selectedTrip?.id}/cancel/driver`,
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
    console.error('Erro ao cancelar como motorista:', error);
    throw error;
  }
};

    const fetchNewTripsRequest = async () => {

        if (!user) { router.replace('/login') }

        try {
            socket.connect();

            socket.on('connect', () => {
                console.log('Conectado ao socket:', socket.id);

                // Envia o evento que o Gateway espera
                socket.emit('client:requested-trips', { driver_id: user?.id });

                // Escuta a resposta
                socket.on('server:requested-trips', (data) => {
                    //console.log('Novas viagens recebidas:', data.newTrips);
                    const newTrips: Trip[] = data.newTrips.map((trip: Trip) => ({
                        id: trip.id,
                        source: {
                            name: trip.source.name,
                            location: {
                                lat: trip.source.location.lat,
                                lng: trip.source.location.lng,
                            }
                        },
                        destination: {
                            name: trip.destination.name,
                            location: {
                                lat: trip.destination.location.lat,
                                lng: trip.destination.location.lng,
                            }
                        },
                        freight: trip.freight,
                        distance: trip.distance,
                    }))
                    if (data.newTrips) {
                        setTrips(newTrips);
                        setLoading(false);
                    }
                });
            });

            socket.on('connect_error', (err) => {
                console.error('Erro de conexão:', err);
            });

        } catch (error) {
            console.error('Erro no fetchNewTripsRequest:', error);
        }
    }

    useEffect(() => {
        fetchNewTripsRequest()
    }, [])

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (trips.length === 0) {
        return (
            <View style={styles.centered}>
                <Text>sem novas pedidos.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 50 }}>
                <TouchableOpacity style={[styles.iconButton]}>
                    <IconHome
                        size={20}
                        fill={colors.gray[500]}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconButton}>
                    <IconBell
                        size={20}
                        color={colors.gray[500]}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconButton} onPress={() => router.push("/profile")}>
                    <IconUser
                        size={20}
                        color={colors.gray[500]}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconButton} onPress={() => router.push("/historic")}>
                    <IconClock
                        size={20}
                        color={colors.gray[500]}
                    />
                </TouchableOpacity>
            </View>
            <Text style={styles.title}>Novos pedidos</Text>

            {selectedTrip ? (
                <View style={{ flexDirection: "column", width: "100%", height: 230 }}>
                    <NewTripRequest
                        item={selectedTrip}
                        onAccept={() => { }}
                        isSelected={isSelected}
                    />
                    <Text style={{ fontFamily: fontFamily.regular, fontSize: 16, color: colors.gray[600] }}>
                        Você pode ligar clicando em “Ligar” ou enviar uma mensagem.
                    </Text>

                    <Button onPress={() => {
                        cancelTripByDriver()
                        setSelectedTrip(null)
                        setIsSelected(false)
                    }} style={{ marginTop: 16 }}>
                        <Button.Title>cancelar</Button.Title>
                    </Button>
                </View>
            ) : (
                <FlatList
                    data={trips}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <NewTripRequest
                            item={item}
                            onAccept={handleAcceptTrip}
                            isSelected={isSelected}
                        />
                    )}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: colors.green.soft,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,

    },
    iconButton: { borderRadius: 10, padding: 10, width: 50, height: 40, justifyContent: "center", alignItems: "center" }
});
