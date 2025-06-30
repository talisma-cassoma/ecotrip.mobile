import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
//import { AuthContext } from '../contexts/AuthContext';
//import api from '../services/api';

interface Trip {
  id: string;
  origin: string;
  destination: string;
  datetime: string; // ISO string
  fare?: number;
  status: string;
}

const historicSample = [
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
  const [trips, setTrips] = useState<Trip[]>(historicSample);
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

  function renderTrip({ item }: { item: Trip }) {
    return (
      <View style={styles.tripCard}>
        <Text style={styles.route}>{item.origin} → {item.destination}</Text>
        <Text>Data: {new Date(item.datetime).toLocaleString()}</Text>
        {item.fare !== undefined && <Text>Valor: R$ {item.fare.toFixed(2)}</Text>}
        <Text>Status: {item.status}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de viagens</Text>
      <FlatList
        data={trips}
        keyExtractor={(item) => item.id}
        renderItem={renderTrip}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
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
  tripCard: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  route: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 6,
  },
});
