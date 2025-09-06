
import { router } from "expo-router";
import { fontFamily, colors } from "@/styles/theme";
import { Button } from "@/components/button";
import React, { useState } from 'react';
import { Image, View, Text, TextInput, StyleSheet, ScrollView, Alert, useWindowDimensions, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLECTION_USERS, buildStoredUser } from "../configs/database"
import { useUserAuth } from "@/context/userAuthContext"
import { api } from "@/services/api";



export default function DriverSignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telephone, setTelephone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
  const [driverName, setDriverName] = useState('');
  const [isLoading, setIsLoading] = useState(false)

  const { setUser } = useUserAuth()

  const role = 'driver'
  const image = 'https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/afro_avatar_male_man-256.png'  

  const dimensions = useWindowDimensions()


  const handleDriverSignUp = async () => {
    setIsLoading(true)

    try {
      const newUser = {
        name: driverName,
        email: email,
        password: password,
        role: "driver",
        telephone: telephone,
        image: image,
        carModel: vehicleModel,
        carPlate: vehiclePlate,
        carColor: vehicleColor,
        licenseNumber: licenseNumber,
      }
      
      const response = await api.post('/driver/create', newUser);
      const { driver } = await response.data
      
      console.log("response", response.data);

        const storedUser = buildStoredUser({
          id: driver.user.id,
          name: driver.user.name,
          email: driver.user.email,
          image: driver.user.image,
          access_token: driver.session.access_token,
          refresh_token: driver.session.refresh_token,
          role,
          driverData: {
            car_model: driver.user.carModel,
            car_color: driver.user.carColor,
            car_plate: driver.user.carPlate,
            license_number: driver.user.licenseNumber,
          }
        });
        
        setUser(storedUser)
        await AsyncStorage.setItem(COLECTION_USERS, JSON.stringify(storedUser));
        router.navigate("./newTripRequests");
      
      }catch(error) {
        console.error('Erro na criação do passageiro:', error);
        Alert.alert('Erro ao registrar. Verifique os dados e tente novamente.');
      } finally {
        setIsLoading(false); // garante que o loading será desativado mesmo se der erro
      }
    }
  return (
    <View style={styles.container}>
      <Image source={require("@/assets/logo.png")} style={{ width: 150, height: 150, marginTop: 24, marginBottom: 2, alignSelf: 'center' }} />
      <Text style={styles.title}>EcoTrip</Text>
      <Text style={styles.subtitle}>Introduce tus datos para rigistrarte como <Text style={{ fontFamily: fontFamily.bold }}>conductor</Text></Text>

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
            placeholder="Permiso de conducir"
            placeholderTextColor="#aaa"
            value={licenseNumber}
            onChangeText={setLicenseNumber}
          />
          <TextInput
            style={styles.input}
            placeholder="telefono"
            placeholderTextColor="#aaa"
            value={telephone}
            keyboardType="phone-pad"
            onChangeText={setTelephone}
            autoCapitalize="words"
          />
          <TextInput
            style={styles.input}
            placeholder="color del vehículo"
            placeholderTextColor="#aaa"
            value={vehicleColor}
            onChangeText={setVehicleColor}
            autoCapitalize="words"
          />
          <TextInput
            style={styles.input}
            placeholder="Numero de matricula"
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
            placeholder="email@ejemplo.com"
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
