import { router } from "expo-router";
import { fontFamily, colors } from "@/styles/theme";
import { Button } from "@/components/button";
import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Image, View, Text, TextInput, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';


import { DriverSignUpForm } from "@/components/driverSignUpForm";
import { PassengerSignUpForm } from "@/components/passengerSignUpForm";

export default function SignUp() {
  const [role, setRole] = useState<"conductor" | "pasajero" | null>(null);

   const dimensions = useWindowDimensions()

  useFocusEffect(
    useCallback(() => {
      // Executa toda vez que a tela entra em foco
      setRole(null); // ou o valor padrão que quiser

      return () => {
        // Opcional: executar algo ao sair da tela
      };
    }, [])
  );
  return (
    <View style={styles.container}>
      <Image source={require("@/assets/logo.png")} style={{ width: 150, height: 150, marginTop: 24, marginBottom: 2, alignSelf: 'center' }} />
      <Text style={styles.title}>EcoTrip</Text>
      <Text style={styles.subtitle}>Introduce tu correo y una contraseña para crear una cuenta</Text>

      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 20, marginBottom: 20 }}>
        <TouchableOpacity onPress={() => setRole('pasajero')}>
          <Text style={[styles.roleChoice, role === 'pasajero' && styles.selectedRole]}>Pasajero</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setRole('conductor')}>
          <Text style={[styles.roleChoice, role === 'conductor' && styles.selectedRole]}>Conductor</Text>
        </TouchableOpacity>
      </View>

      <View style={{ minHeight: dimensions.height/2 , marginBottom: 16 }}>
        {role && (
          role === "pasajero" ? (
            <PassengerSignUpForm />
          ) : role === "conductor" ? (
            <DriverSignUpForm />
          ) : null
        )}
      </View>

      {!role && (
        <Text style={{ textAlign: 'center', marginTop: 16 }}>Elige una opción para continuar con el registro</Text>
      )}

      <Text style={styles.label}>
        ¿Ya tienes cuenta?{' '}
        <Text onPress={() => router.navigate("/login")} style={{ color: colors.green.dark }}>
          Inicia sesión
        </Text>
      </Text>
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
  label: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    color: colors.gray[500],
    marginTop: 4,
    textAlign: 'center',
    marginBottom: 28,
  },
  input: {
    color: '#333',
    fontSize: 16,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#DDD',
    marginBottom: 20
  },
  roleChoice: {
    fontSize: 16,
    color: colors.gray[600],
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 20,
  },
  selectedRole: {
    backgroundColor: colors.green.light,
    borderColor: colors.green.dark,
    fontWeight: 'bold',
  },
});
