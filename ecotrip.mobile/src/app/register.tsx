import { router } from "expo-router";
import { fontFamily, colors } from "@/styles/theme";
import React from 'react';
import { Image, View, Text, StyleSheet, Pressable } from 'react-native';
import { IconCarSuv, IconFriends } from "@tabler/icons-react-native"


export default function SignUp() {
  return (
    <View style={styles.container}>
      <Image source={require("@/assets/logo.png")} style={{ width: 150, height: 150, marginTop: 24, marginBottom: 2, alignSelf: 'center' }} />
      <Text style={styles.title}>EcoTrip</Text>
      {/* <Text style={styles.subtitle}>Introduce tu correo y una contraseña para crear una cuenta</Text> */}

      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 20, marginBottom: 20 }}>
        <Pressable onPress={() => router.navigate("./passengerSignUp")} style={styles.roleChoice}>
          <IconFriends size={24} stroke={colors.green.base}/>
          <Text >Pasajero</Text>
        </Pressable>
        <Pressable onPress={() => router.navigate("./driverSignUp")} style={styles.roleChoice}>
          <IconCarSuv size={24} stroke={colors.green.base}/>
          <Text>Conductor</Text>
        </Pressable>
      </View>
      <Text style={{ textAlign: 'center', marginTop: 16 }}>Elige una opción para continuar con el registro</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: fontFamily.bold,
    color: colors.gray[600],
    textAlign: 'center',
    marginBottom: 38,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 28,
    textAlign: 'center',
  },
  roleChoice: {
    fontSize: 16,
    color: colors.gray[600],
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 20,
    justifyContent: "space-around",
  flexDirection: "row",
  minWidth: 130
  }
});
