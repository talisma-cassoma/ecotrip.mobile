import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from "@/styles/theme"
import { Button } from '@/components/button';
import { IconArrowLeft } from "@tabler/icons-react-native"
import { router } from "expo-router"
import { Trip } from '@/components/trip';
import { useUserAuth } from '@/context/userAuthContext';
import { api } from '@/services/api';
import {  TripRequestProps } from '@/types';

const historicMockData: TripRequestProps[] = [
  {
    id: 'trip1',
    origin: {
      name:'Avenida Paulista, São Paulo'
    },
    destination: {
      name: 'Rua Augusta, São Paulo',
    },
    created_at: '2025-06-29T14:30:00Z',
    price: 25.50,
    distance: 3.2,
    duration: 15 * 60,
    status: 'completed',
  },
  {
    id: 'trip2',
    origin: {
      name:'Praça da Sé, São Paulo'
    },
    destination: {
      name:'Parque Ibirapuera, São Paulo'
    },
    created_at: '2025-06-28T09:15:00Z',
    price: 30.00,
    distance: 6.1,
    duration: 25 * 60,
    status: 'cancelled',
  },
  {
    id: 'trip3',
    origin:{
      name: 'Terminal Rodoviário Tietê'
    },
    destination: {
      name:'Aeroporto de Guarulhos'
    },
    created_at: '2025-06-27T19:45:00Z',
    price: 48.75,
    distance: 24.5,
    duration: 50 * 60,
    status: 'completed',
  },
  {
    id: 'trip4',
    origin: {
      name:'Shopping Morumbi'
    },
    destination: {
      name:'Estádio do Morumbi',
    },
    created_at: '2025-06-26T17:00:00Z',
    price: 22.00,
    distance: 2.8,
    duration: 12 * 60,
    status: 'completed',
  },
];


export default function Historic() {
  //const { user } = useContext(AuthContext);
  const [trips, setTrips] = useState< TripRequestProps[]>(historicMockData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUserAuth();

  const getTripHistoric = async () => {
  try {
    const response = await api.request({
      method: 'GET',
      url: '/trips/historic',
      data: { user_id: user?.id },
      headers: {
        access_token: user?.access_token,
        refresh_token: user?.refresh_token,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar histórico de viagens:', error);
    throw error;
  }
};

  useEffect(() => {  
      const trips = getTripHistoric()
   }, [user]);

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
        <Text>no tienes viajes registrados.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button style={{ width: 40, height: 40, marginBottom: 40 }} onPress={() => router.back()}>
        <Button.Icon icon={IconArrowLeft} />
      </Button>
      <Text style={styles.title}>Historial de viajes</Text>
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
