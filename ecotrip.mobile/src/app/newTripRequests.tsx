import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
//import { AuthContext } from '../contexts/AuthContext';
//import api from '../services/api';
import { IconUser, IconHome, IconBell, IconClock } from "@tabler/icons-react-native"
import { colors, fontFamily } from "@/styles/theme"
import { router } from "expo-router"
import { NewTripRequest, ITrip } from '@/components/newTripRequest';
import { Button } from "@/components/button"

const historicMockData = [
    {
        id: 'trip1',
        origin: 'Avenida Paulista, São Paulo',
        destination: 'Rua Augusta, São Paulo',
        datetime: '2025-06-29T14:30:00Z',
        price: 25.50,
        distance: '2 Km',
    },
    {
        id: 'trip2',
        origin: 'Praça da Sé, São Paulo',
        destination: 'Parque Ibirapuera, São Paulo',
        datetime: '2025-06-28T09:15:00Z',
        price: 30.00,
        distance: '1Km',
    },
    {
        id: 'trip3',
        origin: 'Terminal Rodoviário Tietê',
        destination: 'Aeroporto de Guarulhos',
        datetime: '2025-06-27T19:45:00Z',
        price: 48.75,
        distance: '4km',
    },
    {
        id: 'trip4',
        origin: 'Shopping Morumbi',
        destination: 'Estádio do Morumbi',
        datetime: '2025-06-26T17:00:00Z',
        price: 22.00,
        distance: '80m',
    },
];


export default function NewTripRequests() {
    //const { user } = useContext(AuthContext);
    const [trips, setTrips] = useState<ITrip[]>(historicMockData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTrip, setSelectedTrip] = useState<ITrip | null>(null);
    const [isSelected, setIsSelected]= useState(false)
  
    const handleAcceptTrip = (trip: ITrip) => {
        setIsSelected(true)
        setSelectedTrip(trip);
    };


    if (!loading) {
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
                <View style={{ flexDirection:"column",width:"100%", height:230  }}>
                    <NewTripRequest
                        item={selectedTrip}
                        onAccept={() => { }}
                        isSelected={isSelected}     
                    />
                    <Text style={{ fontFamily: fontFamily.regular, fontSize: 16, color: colors.gray[600] }}>
                       Você pode ligar clicando em “Ligar” ou enviar uma mensagem.
                    </Text>

                    <Button onPress={() =>{
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
