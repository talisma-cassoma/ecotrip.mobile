import { router } from "expo-router";
import { fontFamily, colors } from "@/styles/theme";
import { Button } from "@/components/button";
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, Image, useWindowDimensions, TouchableOpacity } from 'react-native';
import { storeUser } from "../configs/database"
import {
  IconBrandGoogleFilled
} from "@tabler/icons-react-native";
import { useUserAuth } from "@/hooks/useUserAuth";
import { api } from "@/services/api";

export default function PassengerSignUp() {

  const [email, setEmail] = useState('');
  const [name, setName] = useState('')
  const [password, setPassword] = useState('');
  const [telephone, setTelephone] = useState('');
  const dimensions = useWindowDimensions()
  const [isLoading, setIsLoading] = useState(false)
  const role = 'passenger'
  const image = 'https://cdn3.iconfinder.com/data/icons/flat-classy-users-1/256/Male_SkinTone3_HairStyle1-256.png'

  const { setUser } = useUserAuth()
  const handlePassengerSignUp = async () => {
    setIsLoading(true);

    const newUser = {
      name: name,
      email: email,
      password: password,
      role,
      telephone: telephone,
      image: image,
    };

    try {
      const response = await api.post('/passenger/create', newUser);
      const { passenger } = response.data;

      if (passenger) {
        const storedUser = await storeUser({
          name: passenger.user.name,
          email: passenger.user.email,
          image: passenger.user.image,
          telephone: passenger.user.telephone,
          access_token: passenger.session.access_token,
          refresh_token: passenger.session.refresh_token,
          role,
        });

        setUser(storedUser);
        
        console.log('Usuário autenticado com sucesso');
        router.replace("/(protected)/passenger/passengerScreen");
      } 
    } catch (error) {
      console.error('Erro na criação do passageiro:', error);
      Alert.alert('Erro ao registrar. Verifique os dados e tente novamente.');
    } finally {
      setIsLoading(false); // garante que o loading será desativado mesmo se der erro
    }
  };


  return (
    <View style={styles.container}>
      <Image source={require("@/assets/logo.png")} style={{ width: 150, height: 150, marginTop: 24, marginBottom: 2, alignSelf: 'center' }} />
      <Text style={styles.title}>EcoTrip</Text>
      <Text style={styles.subtitle}>Introduce tu correo y una contraseña para crear una cuenta</Text>

      <View style={{ minHeight: dimensions.height / 2, marginBottom: 16 }}>
        <ScrollView
          style={{ flex: 1, padding: 24 }}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false} // <- aqui você esconde a barra
        >
          <Button style={{ justifyContent: "space-between" }} onPress={() => Alert.alert("Funcionalidad no implementada")}>
            <View style={{ width: 60, alignItems: "center", justifyContent: "center", backgroundColor: colors.green.dark, borderRadius: 10, height: "100%", }}>
              <Button.Icon icon={IconBrandGoogleFilled} />
            </View>
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
              <Button.Title>
                <Text style={{ color: '#FFF', fontSize: 16, fontFamily: fontFamily.semiBold }}>cadastro con google</Text>
              </Button.Title>
            </View>
          </Button>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 20 }} >
            <View style={styles.bar} />
            <Text style={styles.label}>ou</Text>
            <View style={styles.bar} />
          </View>
          <TextInput
            style={styles.input}
            placeholder="tu nombre"
            placeholderTextColor="#aaa"
            keyboardType="default"
            value={name}
            onChangeText={setName}
            autoCapitalize="none"
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
            placeholder="telefono"
            placeholderTextColor="#aaa"
            value={telephone}
            keyboardType="phone-pad"
            onChangeText={setTelephone}
            autoCapitalize="words"
          />
          <TextInput
            style={styles.input}
            placeholder="********"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Button onPress={handlePassengerSignUp} isLoading={isLoading}>
            <Button.Title>Registrarse como Pasajero</Button.Title>
          </Button>
        </ScrollView>
        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
          <Text style={styles.label}>
            ¿Ya tienes cuenta?
            <Text onPress={() => router.replace("/login")} style={{ color: colors.green.dark }}>
              Inicia sesión
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
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
  bar: { flex: 1, height: 1, backgroundColor: colors.gray[300], marginVertical: 20, margin: 10 }
});
