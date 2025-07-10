import { colors } from '@/styles/colors';
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, ImageBackground, Alert } from 'react-native';
//import { AuthContext } from '../contexts/AuthContext'; // ajuste o caminho
//import { api } from '@services/api'; 
import { Button } from '@/components/button';
import { IconArrowLeft } from "@tabler/icons-react-native"
import { router } from "expo-router"
import { supabase } from "@/services/superbase";
import { useUserAuth } from '@/context/userAuthContext';


export default function Profile() {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUserAuth()
  
  const handleLogOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      router.replace("/login")
    } catch (error) {
      console.log(error)
      Alert.alert("falha", "Não foi possível se desconectar, tente novamente")
    }
  }

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
      <ImageBackground source={require("@/assets/splash3.png")} style={{ flex: 1, padding: 20, margin: 0 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Button style={{ width: 40, height: 40 }} onPress={() => router.back()}>
            <Button.Icon icon={IconArrowLeft} />
          </Button>

          <Button onPress={handleLogOut} style={{ width: 100, height: 40 }}>
            <Button.Title>
              salir
            </Button.Title>
          </Button>
        </View>

        <View style={{ backgroundColor: "#fff", borderRadius: 10, padding: 10, marginTop: 60 }}>
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 20 }}>
              <View style={{ flexDirection: "row" }}>
                <Image source={{ uri: user?.image }} style={{
                  width: 54,
                  height: 54,
                  borderRadius: 32,
                  marginRight: 12
                }} />
                {(user?.role.type === 'driver') && (
                  <View style={{ flexDirection: "column", padding: 4 }}>
                    <Text style={styles.title}>{user?.name}</Text>
                    <Text>vaijes realizadas {(user?.role.type === 'driver') && (user.role.data.complited_rides ?? 0)} </Text>
                  </View>
                )}
              </View>
               {(user?.role.type === 'driver') && (
              <View>
                <Text style={{ textAlign: "center" }}><Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.green.base }}> {`(`}{(user?.role.type === 'driver') && (user.role.data.rating ?? '- - -')}{`)`}</Text> {`\n`}Rating: </Text>
              </View>
               )}
            </View>

            <View style={{ flexDirection: "column", width: "100%", marginTop: 20 }}>
              <Text>Email: {user?.email}</Text>
              <Text>Função: {user?.role.type === 'driver' ? 'Condutor' : 'Passageiro'}</Text>
            </View>
          </View>

          {(user?.role.type === 'driver') && (
            <>
              <Text style={styles.subtitle}>Informações do Veículo </Text>
              <View style={{ flexDirection: "row", justifyContent: "space-between", backgroundColor: colors.green.soft, padding: 16, borderRadius: 10, marginTop: 10 }}>
                <Text>Modelo: {`\n`}
                  <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{user.role.data.car_model}</Text>
                </Text>
                <Text>Placa: {`\n`}
                  <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{user.role.data.car_plate}</Text>
                </Text>
              </View>
            </>
          )}

          {user?.role.type === 'passenger' && (
            <>
              {/* Você pode colocar aqui info específica do passageiro */}
              <Text>Você é um passageiro ecotrip.</Text>
            </>
          )}
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[100]//'#00b050',
    //padding: 20
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.green.base
  },
  subtitle: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: '600',
  },
});
