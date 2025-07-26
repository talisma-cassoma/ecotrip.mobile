import { colors } from '@/styles/colors';
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, ImageBackground, Alert, TouchableOpacity, ScrollView } from 'react-native';
//import { AuthContext } from '../contexts/AuthContext'; // ajuste o caminho
//import { api } from '@services/api'; 
import { Button } from '@/components/button';
import { IconArrowLeft, IconUser, IconAB2, IconAlignJustified, IconUsersGroup, IconBell, IconClock } from "@tabler/icons-react-native"
import { router } from "expo-router"
import { supabase } from "@/services/superbase";
import { useUserAuth } from '@/context/userAuthContext';
import { COLECTION_USERS } from "@/configs/database"
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Profile() {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, setUser } = useUserAuth()

  // console.log("user:", user)

  const handleLogOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      setUser(null)
      await AsyncStorage.removeItem(COLECTION_USERS)
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
        <View style={{ flexDirection: "row", justifyContent: "space-between", padding:10 }}>
          <Button style={{ width: 40, height: 40 }} onPress={() => router.back()}>
            <Button.Icon icon={IconArrowLeft} />
          </Button>

          <Button onPress={handleLogOut} style={{ width: 100, height: 40 }}>
            <Button.Title>
              salir
            </Button.Title>
          </Button>
        </View>
        <ScrollView
          style={{ flex: 1, marginRight:10, marginLeft:10, marginTop:20}}
          contentContainerStyle={{ paddingBottom:0 }}
          showsVerticalScrollIndicator={false} // <- aqui você esconde a barra
        >
          <View style={{ backgroundColor: "#fff", borderRadius: 10, padding: 10, marginTop: 60, minWidth: 320, alignSelf:"center" }}>
            <View style={{ flexDirection: "column", alignItems: "center" }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", marginBottom: 20 }}>
                <View style={{ flexDirection: "column", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                  <View style={{ position: "relative", width: 94, height: 64 }}>
                    <Image source={{ uri: user?.image }} style={{
                      width: 94,
                      height: 94,
                      borderRadius: 50,
                      borderWidth: 3,
                      borderColor: colors.gray[100],
                      marginRight: 12,
                      position: "absolute",
                      top: -40,
                    }} />
                  </View>
                  <View style={{ flexDirection: "column", padding: 4, alignItems: "center" }}>
                    <Text style={styles.title}>{user?.name}</Text>
                    <Text>{user?.email}</Text>
                    {(user?.role.type === 'driver') && (
                      <>
                        <Text>viajes realizadas {(user?.role.type === 'driver') && (user.role.data.complited_rides ?? 0)} </Text>
                        <Text style={{ textAlign: "center" }}><Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.green.base }}> {`(`}{(user?.role.type === 'driver') && (user.role.data.rating ?? '- - -')}{`)`}</Text> {`\n`}Rating: </Text>
                      </>
                    )}
                  </View>
                  <View style={styles.bar}></View>
                  <View style={{ flexDirection: "column", justifyContent: "space-around", padding: 10, width: "100%", gap:10}}>
                    <TouchableOpacity style={styles.iconButton} onPress={() => console.log("leva pra as notificacoes")}>
                      <IconBell
                        size={20}
                        color={colors.gray[500]}
                      />
                      <Text>
                      Notificaciones
                      </Text>
                    </TouchableOpacity>

                    <View style={{flexDirection: "row", gap:10}}>
                      <IconUser
                        size={20}
                        color={colors.gray[500]}
                      />
                       <Text>{user?.role.type === 'driver' ? 'Condutor' : 'Passageiro'}</Text>
                    </View>

                    <View style={{flexDirection: "row", gap:10}}>
                      <IconClock
                        size={20}
                        color={colors.gray[500]}
                      />
                      <Text>
                        200 horas
                      </Text>
                    </View>
                  </View>
                </View>

              </View>
            </View>

            {(user?.role.type === 'driver') && (
              <>
                <Text style={styles.subtitle}>Informações do Veículo </Text>
                <View style={{ flexDirection: "row", justifyContent: "space-between", backgroundColor: colors.green.soft, padding: 10, borderRadius: 10, marginTop: 10, width:"auto"}}>
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
              <View>
                <Text>Eres un pasajero  de ecotrip.</Text>
              </View>
            )}
          </View>
          <View style={{ flexDirection: "column", justifyContent: "center", padding: 10, width: "100%", backgroundColor: "#fff", borderRadius: 10, marginTop: 60, gap:10, minHeight:120 }}>
            <TouchableOpacity style={[styles.iconButton]}>
              <IconUsersGroup
                size={20}
                color={colors.gray[500]}
              />
              <Text>
                Sobre nosotros
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton}>
              <IconAB2
                size={20}
                color={colors.gray[500]}
              />
              <Text>
                Términos De Uso
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton}>
              <IconAlignJustified
                size={20}
                color={colors.gray[500]}
              />
              <Text>
                Términos E Condiciones
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.green.soft, //'#00b050',
    padding: 20,
    justifyContent:"center"

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
  bar: { width: "90%", height: 1, backgroundColor: colors.gray[300], marginVertical: 20, margin: 10 },
  iconButton: { flexDirection: "row", width: "100%", columnGap: 10 }

});
