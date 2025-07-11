
import { router } from "expo-router";
import { fontFamily, colors } from "@/styles/theme";
import { Button } from "@/components/button";
import React, { useState } from 'react';
import { Image, View, Text, TextInput, StyleSheet, ScrollView, Alert, useWindowDimensions, TouchableOpacity } from 'react-native';
import { supabase } from "@/services/superbase";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLECTION_USERS, buildStoredUser } from "../configs/database"



export default function DriverSignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [driverName, setDriverName] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  
  const role = 'driver'
  const image = 'https://www.shutterstock.com/image-vector/truck-driver-vector-line-icon-260nw-2048408102.jpg'  

  const dimensions = useWindowDimensions()


  const handleDriverSignUp = async () => {
    setIsLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: driverName,
          role,
          image
        }
      }
    });

    if (error) {
      console.error('Erro ao fazer registro:', error.message);
      Alert.alert('Erro', 'Não foi possível fazer o registro, tente novamente.');
      setIsLoading(false)
      return;
    }

    if (data.user && data.session) {
      const { error: insertDriverError } = await supabase.rpc('insert_driver_info', {
        p_car_model: vehicleModel,
        p_car_plate: vehiclePlate,
        p_license_number: licenseNumber
      });

      if (insertDriverError) {
        Alert.alert('Erro', 'Não foi possível fazer o registro, tente novamente.');
        setIsLoading(false)
        console.error('Erro ao inserir na tabela drivers:', insertDriverError.message);
        return;
      }
      const storedUser = buildStoredUser({
        id: data.user.id,
        name: driverName,
        email,
        image,
        access_token: data.session.access_token ,
        refresh_token: data.session.refresh_token ,
        role,
        driverData: {
          car_model: vehicleModel,
          car_plate: vehiclePlate,
          license_number: licenseNumber,
        }
      });

      await AsyncStorage.setItem(COLECTION_USERS, JSON.stringify(storedUser));
      router.navigate("./newTripRrquests");
    }else {
      console.error('Erro ao fazer registro: sem token');
      Alert.alert('Erro', 'Não foi possível fazer o registro, tente novamente.');
      setIsLoading(false)
      return;
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("@/assets/logo.png")} style={{ width: 150, height: 150, marginTop: 24, marginBottom: 2, alignSelf: 'center' }} />
      <Text style={styles.title}>EcoTrip</Text>
      <Text style={styles.subtitle}>Introduce tu correo y una contraseña para crear una cuenta para el rigistro como <Text style={{ fontFamily: fontFamily.bold }}>motorista</Text></Text>

      <View style={{ minHeight: (dimensions.height / 2) - 80 }}>
        <ScrollView
          style={{ flex: 1, padding: 24 }}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false} // <- aqui você esconde a barra
        >
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
            value={licenseNumber}
            onChangeText={setLicenseNumber}
          />
          <TextInput
            style={styles.input}
            placeholder="Placa del vehículo"
            placeholderTextColor="#aaa"
            value={vehiclePlate}
            onChangeText={setVehiclePlate}
          />
          <TextInput
            style={styles.input}
            placeholder="Modelo del vehículo"
            placeholderTextColor="#aaa"
            value={vehicleModel}
            onChangeText={setVehicleModel}
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
          <Button onPress={handleDriverSignUp} style={{ marginTop: 10 }} isLoading={isLoading}>
            <Button.Title>Registrarse como Conductor</Button.Title>
          </Button>
        </ScrollView>
      </View >
      <TouchableOpacity style={{ marginTop: 20 }} onPress={() => router.replace("/login")}>
        <Text style={styles.label}>
          ¿Ya tienes cuenta?
          <Text style={{ color: colors.green.dark }}>
            Inicia sesión
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

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
  label: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    color: colors.gray[500],
    marginTop: 4,
    textAlign: 'center',
  }
})
