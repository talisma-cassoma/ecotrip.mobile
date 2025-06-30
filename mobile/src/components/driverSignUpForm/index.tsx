
import { router } from "expo-router";
import { fontFamily, colors } from "@/styles/theme";
import { Button } from "@/components/button";
import React, { useState } from 'react';
import { Image, View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { supabase } from "@/services/superbase";


// Dummy components — replace with your actual ones
export function DriverSignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [driverName, setDriverName] = useState(''); // Assuming you want to capture driver's name

  const handleDriverSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('Erro ao fazer login:', error.message);
      return;
    }
    if (data.user) {
      console.log('Usuário autenticado com sucesso:', data.user);
    }

    console.log('Email:', email, 'Password:', password, 'Role:', "driver");
    router.navigate("/home");
  };

  return (
    <>
      <TextInput
        style={styles.input}
        placeholder="Nombre Completo"
        placeholderTextColor="#aaa"
        value={driverName}
        onChangeText={setDriverName}
        autoCapitalize="words"
      />

      <TextInput
        style={styles.input}
        placeholder="Número de licencia"
        placeholderTextColor="#aaa"
        value={licenseNumber} // Replace with actual state for license number
        onChangeText={setLicenseNumber} // Replace with actual state handler
      />
      <TextInput
        style={styles.input}
        placeholder="Placa del vehículo"
        placeholderTextColor="#aaa"
        value={vehiclePlate} // Replace with actual state for vehicle plate
        onChangeText={setVehiclePlate} // Replace with actual state handler
      />
      <TextInput
        style={styles.input}
        placeholder="Modelo del vehículo"
        placeholderTextColor="#aaa"
        value={vehicleModel} // Replace with actual state for vehicle model
        onChangeText={setVehicleModel} // Replace with actual state handler
      />
      <TextInput
        style={styles.input}
        placeholder="email@exemplo.com"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="********"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button onPress={handleDriverSignUp} style={{ marginTop: 40 }}>
        <Button.Title>Registrarse como Conductor</Button.Title>
      </Button>
    </>)
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
    marginTop: 24,
    textAlign: 'center',
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