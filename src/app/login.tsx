
import { router } from "expo-router"

import { fontFamily, colors } from "@/styles/theme"
import { Button } from "@/components/button";
import { IconBrandGoogleFilled } from "@tabler/icons-react-native"

import React, { useState } from 'react';
import { Image, View, Text, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';

import { supabase } from "@/services/superbase";
import { useUserAuth } from "@/context/userAuthContext"
import { AuthUser, COLECTION_USERS, buildStoredUser } from '../configs/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from "@/services/api";


export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    const { loading, setUser } = useUserAuth()

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const response = await api.post('/users/login', { email, password })
           
            const { session, user } = response.data;
            //console.log(response)

            const storedUser = () => {
                if (user.role === 'driver') {
                    return buildStoredUser({
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        access_token: session.access_token,
                        refresh_token: session.refresh_token,
                        telephone: user.telephone,
                        role: user.role,
                        driverData: {
                            car_model: user.carModel,
                            car_plate: user.carPlate,
                            car_color: user.carColor,
                            license_number: user.licenseNumber,
                        }
                    });
                } else {
                    return buildStoredUser({
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        access_token: session.access_token,
                        refresh_token: session.refresh_token,
                        role: user.role,
                    });
                }
            };

            const userData = storedUser(); // executa a função
            //console.log(userData)
            setUser(userData);
            if (userData) {
                await AsyncStorage.setItem(COLECTION_USERS, JSON.stringify(userData));
            } else {
                console.warn("Tentativa de salvar userData undefined");
            }
            if(user.role === 'driver'){
                 router.navigate("/newTripRequests");
            }
            if(user.role === 'passenger'){    
                router.navigate("/home");
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            Alert.alert('Erro ao registrar. Verifique os dados e tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };


    const handlePasswordReset = async () => {
        // Lógica de redefinição de senha aqui
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) {
            console.error('Erro ao redefinir senha:', error.message);
            return;
        }
        console.log('Email de redefinição de senha enviado com sucesso');
    };

    return (
        loading ?
            (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ textAlign: "center" }}>
                        ... iniciando a sessao
                    </Text>
                </View>
            ) :
            (
                <View style={styles.container}>
                    <Image source={require("@/assets/logo.png")} style={{
                        width: 150,
                        height: 150,
                        marginTop: 24,
                        marginBottom: 2,
                        alignSelf: 'center',

                    }} />
                    <Text style={styles.title}>
                        EcoTrip
                    </Text>

                    <Text style={styles.subtitle}>introduce tu correo para acceder a tu cuenta</Text>
                    <ScrollView
                        style={{ flex: 1, padding: 24 }}
                        contentContainerStyle={{ paddingBottom: 40 }}
                        showsVerticalScrollIndicator={false} // <- aqui você esconde a barra
                    >
                        <Button style={{ justifyContent: "space-between" }} onPress={() => alert("Funcionalidad no implementada")}>
                            <View style={{ width: 60, alignItems: "center", justifyContent: "center", backgroundColor: colors.green.dark, borderRadius: 10, height: "100%", }}>
                                <Button.Icon icon={IconBrandGoogleFilled} />
                            </View>
                            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                                <Button.Title>
                                    <Text style={{ color: '#FFF', fontSize: 16, fontFamily: fontFamily.semiBold }}>Login con google</Text>
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

                        <Button onPress={handleLogin} isLoading={isLoading}>
                            <Button.Title>
                                Entrar
                            </Button.Title>
                        </Button>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                            <Text onPress={() => router.replace("/register")} style={{ color: colors.green.dark }}>Regístrate</Text>
                            <Text onPress={handlePasswordReset} style={{ color: colors.green.dark }}>Cambiar contraseña</Text>
                        </View>
                    </ScrollView>
                </View>
            )
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
        marginTop: 4,
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
    button: {
        marginTop: 24,
        backgroundColor: '#2E7D32', // tom verde como no botão
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    bar: { flex: 1, height: 1, backgroundColor: colors.gray[300], marginVertical: 20, margin: 10 }
});



