import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
//import { AuthContext } from '../contexts/AuthContext';
//import api from '../services/api';
import { IconPointFilled, IconMapPinFilled } from "@tabler/icons-react-native"
import { VerticalDashedLine } from "../components/dottedLine"
import { colors, fontFamily } from "@/styles/theme"
import { Button } from '@/components/button';
import { IconArrowLeft } from "@tabler/icons-react-native"
import { router } from "expo-router"
import { Trip } from '@/components/trip';

interface iTrip {
  id: string;
  origin: string;
  destination: string;
  datetime: string; // ISO string
  fare?: number;
  status: string;
}

const historicMockData = [
  {
    id: 'trip1',
    origin: 'Avenida Paulista, São Paulo',
    destination: 'Rua Augusta, São Paulo',
    datetime: '2025-06-29T14:30:00Z',
    fare: 25.50,
    status: 'finalizada',
  },
  {
    id: 'trip2',
    origin: 'Praça da Sé, São Paulo',
    destination: 'Parque Ibirapuera, São Paulo',
    datetime: '2025-06-28T09:15:00Z',
    fare: 30.00,
    status: 'cancelada',
  },
  {
    id: 'trip3',
    origin: 'Terminal Rodoviário Tietê',
    destination: 'Aeroporto de Guarulhos',
    datetime: '2025-06-27T19:45:00Z',
    fare: 48.75,
    status: 'finalizada',
  },
  {
    id: 'trip4',
    origin: 'Shopping Morumbi',
    destination: 'Estádio do Morumbi',
    datetime: '2025-06-26T17:00:00Z',
    fare: 22.00,
    status: 'finalizada',
  },
];


export default function Historic() {
  //const { user } = useContext(AuthContext);
  const [trips, setTrips] = useState<iTrip[]>(historicMockData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //   useEffect(() => {  
  //     async function fetchTrips() {
  //       try {
  //         setLoading(true);
  //         setError(null);
  //         if (!user?.id || !user?.role) {
  //           setError('Usuário não autenticado.');
  //           setLoading(false);
  //           return;
  //         }

  //         const endpoint = user.role === 'driver' 
  //           ? `/trips/driver/${user.id}` 
  //           : `/trips/passenger/${user.id}`;

  //         const response = await api.get<Trip[]>(endpoint);
  //         setTrips(response.data);
  //       } catch (err) {
  //         setError('Erro ao carregar histórico de viagens.');
  //         console.error(err);
  //       } finally {
  //         setLoading(false);
  //       }
  //     }

  //     fetchTrips();
  //   }, [user]);

  if (!loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  if (trips.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>Você não tem viagens registradas.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button style={{ width: 40, height: 40, marginBottom: 40 }} onPress={() => router.back()}>
        <Button.Icon icon={IconArrowLeft} />
      </Button>
      <Text style={styles.title}>Histórico de viagens</Text>
      <FlatList
        data={trips}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Trip
          item={item}
          />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
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
  }
});
