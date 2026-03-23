
import { router } from "expo-router";
import { fontFamily, colors } from "@/styles/theme";
import { Button } from "@/components/button";
import React, { useState } from 'react';
import {
  Image, View, Text, TextInput, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform, Alert, useWindowDimensions, TouchableOpacity
} from 'react-native';
import { storeUser } from "../../configs/database"
import { useUserAuth } from "@/hooks/useUserAuth";
import { api } from "@/services/api";
import AvatarPicker from "@/components/avatarPicker";
import { avatars } from "@/assets/avatars";
import { PasswordInput } from "@/components/passwordInput";

export default function DriverSignUp() {
  const [email, setEmail] = useState('talismac@gmail.om');
  const [password, setPassword] = useState('');
  const [telephone, setTelephone] = useState('+5491133334444');
  const [licenseNumber, setLicenseNumber] = useState('XYZ123456');
  const [vehiclePlate, setVehiclePlate] = useState('JKL-5678');
  const [vehicleModel, setVehicleModel] = useState('MERCEDES-BENZ C300');
  const [vehicleColor, setVehicleColor] = useState('laranja');
  const [driverName, setDriverName] = useState('castor rodriguez');
  const [isLoading, setIsLoading] = useState(false)
  const [image, setImage] = useState<string>('')

  const { setUser } = useUserAuth()

  //const image = 'https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/afro_avatar_male_man-256.png'

  const dimensions = useWindowDimensions()


  const handleDriverSignUp = async () => {
    setIsLoading(true)

    try {
      const newUser = {
        name: driverName,
        email: email,
        password: password,
        telephone: telephone,
        image: image,
        role: {
          type: 'driver',
          data: {
            car_model: vehicleModel,
            car_plate: vehiclePlate,
            car_color: vehicleColor,
            license_number: licenseNumber,
          }
        }
      }

      const response = await api.post('/driver/create', newUser);
      const { driver } = response.data

      console.log("response", response.data);

      const storedUser = await storeUser({
        id: driver.user.id,
        name: driver.user.name,
        email: driver.user.email,
        image: image,
        telephone: driver.user.telephone,
        access_token: driver.session.access_token,
        refresh_token: driver.session.refresh_token,
        role: {
          type: 'driver',
          data: {
            car_model: driver.user.car_model,
            car_color: driver.user.car_color,
            car_plate: driver.user.car_plate,
            license_number: driver.user.license_number,
          }
        }
      });

      setUser(storedUser)

      router.replace("/(protected)/driver/driverScreen");

    } catch (error) {
      console.error('Erro na criação do conductor:', error);
      Alert.alert('Erro ao registrar. Verifique os dados e tente novamente.');
    } finally {
      setIsLoading(false); // garante que o loading será desativado mesmo se der erro
    }
  }
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : 'height'}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 20}
    >
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
            <AvatarPicker
              mode="both"
              avatars={avatars}
              onChange={(source) => {
                if (typeof source === "object" && "uri" in source) {
                  setImage(source.uri as string);
                }
              }}
            />
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
              autoComplete="email"
              //autoCorrect={true}
            />
            <PasswordInput
              style={styles.input}
              placeholder="********"
              placeholderTextColor="#aaa"
              value={password}
              onChangeText={setPassword}
              isVisible={false}
            />
            <Button onPress={handleDriverSignUp} style={{ marginTop: 10 }} isLoading={isLoading}>
              <Button.Title>Registrarse como Conductor</Button.Title>
            </Button>
          </ScrollView>
        </View >
        <TouchableOpacity style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'center'}} onPress={() => router.replace("/login")}>
          <Text style={{ fontWeight: 'bold', color: colors.green.light }} onPress={() => router.replace("/login")}>
            ¿Ya tienes cuenta? Inicia sesión
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
