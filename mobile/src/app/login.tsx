
import { router } from "expo-router"

import { api } from "@/services/api"
import { fontFamily, colors } from "@/styles/theme"
import { Button } from "@/components/button";


import React, { useState } from 'react';
import { Image, View, Text, TextInput, StyleSheet } from 'react-native';

export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Lógica de autenticação aqui
        console.log('Email:', email, 'Password:', password);
        router.navigate("/home")
    };

    return (
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

            <Text style={styles.subtitle}>Insira seu e-mail e senha para acessar sua conta.</Text>
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

            <Button onPress={handleLogin} style={{ marginTop: 40 }}>
                <Button.Title>
                    entrar
                </Button.Title>
            </Button>
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
});
