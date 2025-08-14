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
import axios, { AxiosError } from 'axios';


export default function NewTripRequests() {

    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
    const [isSelected, setIsSelected] = useState(false)
    const [socketActive, setSocketActive] = useState(true);


    const { user } = useUserAuth()

    const handleAcceptTrip = (trip: Trip) => {
        console.log("aceitando a viagem", trip.id);
        setIsSelected(true)
        setSelectedTrip(trip);
        //informar ao clinte
        if (user?.role.type === 'driver') {
            socket.emit('client:accept-trip', {
                trip_id: trip.id,
                driver_email: user.email
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

const handleConnect = async () => {
        try {
            const response = await api.get('/trips/available');

            //console.log('Novas viagens recebidas:', response.data);

            const newTrips: Trip[] = response.data.map((trip: any) => ({
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
                duration: trip.duration
            }));

            if (newTrips) {
                setTrips(newTrips);
                setLoading(false);
            }
        } catch (error) {
            const err = error as AxiosError;

            if (err.response) {
                const status = err.response.status;

                if (status === 401 || status === 403) {
                    console.warn("Sessão expirada ou acesso negado. Redirecionando para login...");
                    router.replace('/login');
                    return;
                }

                console.log('Erro de resposta:', err.response.data);
            } else if (err.request) {
                console.log('Erro de request:', err.request);
            } else {
                console.log('Erro geral:', err.message);
            }

            console.error('Erro ao buscar viagens disponíveis:', error);
        }

        console.log('Conectado ao socket:', socket.id);
        // socket.emit('client:requested-trips', { driver_id: user?.id });
    };
    
const handleNewTrips = (data: any) => {
        const newTrips: Trip[] = data.newTrips.map((trip: any) => ({
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
        }));
        setTrips(newTrips);
    };

    useEffect(() => {
        if (!user || !socketActive) return;

        socket.connect();
        socket.on('connect', handleConnect);
        socket.on('server:requested-trips', handleNewTrips);

        return () => {
            socket.off('connect', handleConnect);
            socket.off('server:requested-trips', handleNewTrips);
            // Só desconecta se você quiser matar de vez a conexão
            if (!socketActive) {
                socket.disconnect();
            }
        };
    }, [user, socketActive]);

    useEffect(() => {
        if (!socketActive && socket.connected) {
            console.log("Desconectando socket manualmente...");
            socket.disconnect();
        }
    }, [socketActive]);

    if (trips.length === 0) {
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
                <Text style={styles.title}>Nuevos pedidos</Text>
                <View style={styles.centered}>
                    <Text>sem novas pedidos.</Text>
                </View>
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
            <Text style={styles.title}>Nuevos pedidos</Text>

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
