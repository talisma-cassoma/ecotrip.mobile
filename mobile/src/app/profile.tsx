import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
//import { AuthContext } from '../contexts/AuthContext'; // ajuste o caminho
//import { api } from '@services/api'; 

type UserRole = 'driver' | 'passenger';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  rating?: number;
  car?: {
    model: string;
    plate: string;
  };
  // qualquer outro dado que queira mostrar
}


export default function Profile() {
    //const { user } = useContext(AuthContext); // espera que user tenha id
    const data = {
      "id": "123",
      "name": "João",
      "email": "joao@email.com",
      "role": "driver", // ou "passenger"
      "car": { "model": "Toyota Corolla", "plate": "ABC-1234" },  // para driver
      "rating": 4.8,
      // outras infos...
    }
  //const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
// //     async function fetchUserData() {
// //       try {
// //         setLoading(true);
// //         setError(null);
// //         const response = await api.get<UserData>(`/users/${user.id}`);
// //         setData(response.data);
// //       } catch (err) {
// //         setError('Erro ao carregar dados do usuário.');
// //         console.error(err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     }

// //     if (user?.id) {
// //       fetchUserData();
// //     } else {
// //       setError('Usuário não autenticado.');
// //       setLoading(false);
// //     }
// //   }, [user]);

//   if (!loading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.centered}>
//         <Text style={{ color: 'red' }}>{error}</Text>
//       </View>
//     );
//   }

//   if (!data) {
//     return (
//       <View style={styles.centered}>
//         <Text>Nenhum dado encontrado.</Text>
//       </View>
//     );
//   }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil de {data.name}</Text>
      <Text>Email: {data.email}</Text>
      <Text>Função: {data.role === 'driver' ? 'Condutor' : 'Passageiro'}</Text>
      <Text>Avaliação: {data.rating ?? 'N/A'}</Text>

      {data.role === 'driver' && data.car && (
        <>
          <Text style={styles.subtitle}>Informações do Veículo</Text>
          <Text>Modelo: {data.car.model}</Text>
          <Text>Placa: {data.car.plate}</Text>
        </>
      )}

      {data.role === 'passenger' && (
        <>
          {/* Você pode colocar aqui info específica do passageiro */}
          <Text>Você é um passageiro InDrive.</Text>
        </>
      )}
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
    marginBottom: 10,
  },
  subtitle: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: '600',
  },
});
