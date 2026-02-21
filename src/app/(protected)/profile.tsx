import { colors } from '@/styles/colors';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { api } from '@/services/api';
import { Button } from '@/components/button';
import { IconArrowLeft, IconUser, IconAB2, IconAlignJustified, IconUsersGroup, IconBell, IconClock } from "@tabler/icons-react-native"
import { router } from "expo-router"
import { useUserAuth } from '@/hooks/useUserAuth';
import { COLLECTION_USERS } from "@/configs/database"
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function Profile() {

  const { user, logout } = useUserAuth()

  // console.log("user:", user)
  // Gera uma cor vibrante e consistente com base no nome
const getColorFromName = (name:string | undefined) => {
  const colors = [
    "#F44336", "#E91E63", "#9C27B0", "#3F51B5",
    "#2196F3", "#03A9F4", "#00BCD4", "#009688",
    "#4CAF50", "#8BC34A", "#CDDC39", "#FFC107",
    "#FF9800", "#FF5722"
  ];
  if (!name) return colors[0];
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

// Extrai as iniciais do nome (ex: "Juan Pérez" → "JP")
const getInitials = (name:string | undefined) => {
  if (!name) return "";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

  const handleLogOut = async () => {
    try {
      // const response = await api.post('/users/logout', {email: user?.email},
      // { headers: { Authorization: `Bearer ${user?.access_token}`,}}
      //  );
      await logout()
      //await AsyncStorage.removeItem(COLLECTION_USERS)

      router.replace("/login")
    } catch (error) {
      console.log(error)
      Alert.alert("falha", "Não foi possível se desconectar, tente novamente")
    }
  }

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 10 }}>
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
        style={{ flex: 1, marginRight: 10, marginLeft: 10, marginTop: 20 }}
        contentContainerStyle={{ paddingBottom: 0 }}
        showsVerticalScrollIndicator={false} // <- aqui você esconde a barra
      >
        <View style={{ backgroundColor: "#fff", borderRadius: 10, padding: 10, marginTop: 60, minWidth: 320, alignSelf: "center" }}>
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", marginBottom: 20 }}>
              <View style={{ flexDirection: "column", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                <View style={{ position: "relative", width: 94, height: 64 }}>
                  {user?.image ? (
                    <Image
                      source={{ uri: user.image }}
                      style={{
                        width: 94,
                        height: 94,
                        borderRadius: 50,
                        borderWidth: 3,
                        borderColor: colors.gray[100],
                        position: "absolute",
                        top: -40,
                      }}
                    />
                  ) : (
                    <View
                      style={{
                        width: 94,
                        height: 94,
                        borderRadius: 50,
                        backgroundColor: getColorFromName(user?.name || "Usuario"),
                        alignItems: "center",
                        justifyContent: "center",
                        position: "absolute",
                        top: -40,
                      }}
                    >
                      <Text style={{ fontSize: 36, color: "#fff", fontWeight: "bold" }}>
                        {getInitials(user?.name)}
                      </Text>
                    </View>
                  )}
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
                <View style={{ flexDirection: "column", justifyContent: "space-around", padding: 10, width: "100%", gap: 10 }}>
                  <TouchableOpacity style={styles.iconButton} onPress={() => console.log("leva pra as notificacoes")}>
                    <IconBell
                      size={20}
                      color={colors.gray[500]}
                    />
                    <Text>
                      Notificaciones
                    </Text>
                  </TouchableOpacity>

                  <View style={{ flexDirection: "row", gap: 10 }}>
                    <IconUser
                      size={20}
                      color={colors.gray[500]}
                    />
                    <Text>{user?.role.type === 'driver' ? 'Condutor' : 'Passageiro'}</Text>
                  </View>

                  <View style={{ flexDirection: "row", gap: 10 }}>
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
              <Text style={styles.subtitle}>información del vehículo</Text>
              <View style={{ flexDirection: "row", justifyContent: "space-between", backgroundColor: colors.green.soft, padding: 10, borderRadius: 10, marginTop: 10, width: "auto" }}>
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
        <View style={{ flexDirection: "column", justifyContent: "center", padding: 10, width: "100%", backgroundColor: "#fff", borderRadius: 10, marginTop: 60, gap: 10, minHeight: 120 }}>
          <TouchableOpacity style={[styles.iconButton]} onPress={() => router.push("/aboutUs")}>
            <IconUsersGroup
              size={20}
              color={colors.gray[500]}
            />
            <Text>
              Sobre nosotros
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={() => router.push("/agreements")}>
            <IconAB2
              size={20}
              color={colors.gray[500]}
            />
            <Text>
              Términos De Uso
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={() => router.push("/useConditions")}>
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
    justifyContent: "center"

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
