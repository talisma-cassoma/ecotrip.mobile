
import { router } from "expo-router"

import { fontFamily, colors } from "@/styles/theme"
import { Button } from "@/components/button";
import {
    IconBrandGoogleFilled
} from "@tabler/icons-react-native"

import React, { useState } from 'react';
import { Image, View, Text, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';

import { supabase } from "@/services/superbase";
import { useUserAuth } from "@/context/userAuthContext"
import { COLECTION_USERS, buildStoredUser } from '../configs/database';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    const { loading, setUser, user } = useUserAuth()

    const handleLogin = async () => {

        setIsLoading(true)

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setIsLoading(false);
            console.error("Erro ao fazer login:", error.message);
            Alert.alert(
                "Erro",
                "Não foi possível fazer login. Verifique suas credenciais e tente novamente.",
            );
            return;
        }

        if (data.user && data.session) {
            const { id, user_metadata } = data.user;
            const { name, email: userEmail, image, role } = user_metadata;

            // Busca dos dados do motorista (somente se for driver)
            let driverData;
            if (role === "driver") {
                const driver = await supabase.rpc("get_current_driver");

                if (driver?.data?.length) {
                    const d = driver.data[0];
                    driverData = {
                        car_model: d.car_model,
                        car_plate: d.car_plate,
                        license_number: d.license_number,
                        rating: d.rating,
                        complited_rides: d.complited_rides,
                    };
                }
            }

            // Montagem do objeto a ser salvo
            const storedUser = buildStoredUser({
                id,
                name,
                email: userEmail,
                image,
                access_token: data.session.access_token,
                refresh_token: data.session.refresh_token,
                role,
                ...(driverData && { driverData }), // só adiciona se existir
            });

            await AsyncStorage.setItem(COLECTION_USERS, JSON.stringify(storedUser));
            
            setUser(storedUser);
            
            //console.log("storedUser: ", storedUser)
            if(storedUser.role.type === 'driver'){
                router.replace("./newTripRequests");
            }else{
                router.replace("/home");
            }
        }
        else {
            setIsLoading(false)
            Alert.alert('Erro', 'Não foi possível fazer login. Verifique suas credenciais e tente novamente.');
            console.error('Erro ao fazer login: sem token');
            return;
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

                        <Button onPress={handleLogin} isLoading={isLoading}>
                            <Button.Title>
                                entrar
                            </Button.Title>
                        </Button>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                            <Text onPress={() => router.replace("/register")} style={{ color: colors.green.dark }}>Regístrate</Text>
                            <Text onPress={handlePasswordReset} style={{ color: colors.green.dark }}>cambiar contrasenha</Text>
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

