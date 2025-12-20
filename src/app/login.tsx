import { Redirect, router } from "expo-router";
import { KeyboardAvoidingView, Platform, Pressable } from "react-native";

import { fontFamily, colors } from "@/styles/theme";
import { Button } from "@/components/button";
import { IconBrandGoogleFilled } from "@tabler/icons-react-native";
import { IconCarSuv, IconFriends, IconUserCog, IconEyeClosed, IconEye } from "@tabler/icons-react-native"

import { AuthUser } from "@/types";

import React, { useState } from "react";
import {
  Image,
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity
} from "react-native";

import { useUserAuth } from "@/hooks/useUserAuth"; // ← novo hook
import { api } from "@/services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const { login, setUser } = useUserAuth();

  const handleLogin = async () => {
    // ✅ Validação básica
    if (!email.trim() || !password.trim()) {
      Alert.alert("Validação", "Por favor, preencha email e senha.");
      return;
    }

    // ✅ Validação de email básica
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Validação", "Por favor, insira um email válido.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/users/login", { email, password });

      if (!response.data || !response.data.session || !response.data.user) {
        throw new Error("Resposta inválida do servidor");
      }

      const { session, user } = response.data;

      // ✅ Validar tokens
      if (!session.access_token || !session.refresh_token) {
        throw new Error("Tokens não fornecidos pelo servidor");
      }

      // Mapear resposta da API → AuthUser
      const userData: AuthUser = user.role === 'driver'
        ? {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          telephone: user.telephone,
          role: {
            type: 'driver',
            data: {
              car_model: user.carModel,
              car_plate: user.carPlate,
              car_color: user.carColor,
              license_number: user.licenseNumber,
            },
          },
        }
        : {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          role: {
            type: 'passenger',
          },
        };

      // ✅ Aguardar login completo (inclusive persistência)
      // ✅ Aguardar login completo (inclusive persistência)
      await login(userData);

      console.log("✅ Login bem-sucedido para:", userData.email);

      // Redirecionar explicitamente para o grupo protegido.
      // Se tiver papel, enviar direto para a rota apropriada para evitar um passo extra.
      if (userData.role?.type === "driver") {
        router.replace("/(protected)/driver/newTripRequests");
      } else {
        router.replace("/(protected)/passenger/home");
      }
      // O redirecionamento automático acontece em (protected)/_layout.tsx

    } catch (error) {
      console.error("❌ Erro ao fazer login:", error);

      // ✅ Mensagens de erro mais específicas
      let errorMessage = "Erro ao entrar. Verifique suas credenciais.";

      if (error instanceof Error) {
        if (error.message.includes("401")) {
          errorMessage = "Email ou senha incorretos.";
        } else if (error.message.includes("network")) {
          errorMessage = "Erro de conexão. Verifique sua internet.";
        } else if (error.message.includes("Resposta inválida")) {
          errorMessage = "Erro do servidor. Tente novamente mais tarde.";
        } else if (error.message.includes("Tokens não fornecidos")) {
          errorMessage = "Falha na autenticação. Tente novamente.";
        } else {
          errorMessage = error.message;
        }
      }

      Alert.alert("Erro de Login", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTesterLogin = (role: "driver" | "passenger") => {
    console.log("Tester login as:", role);


    if (role === "driver") {
      setUser({
        id: "tester-driver-001",
        name: "Driver Tester",
        email: "test.driver@ecotrip.com",
        image: "https://i.pinimg.com/736x/02/c5/a8/02c5a82909a225411008d772ee6b7d62.jpg",
        access_token: "tester-access-token",
        refresh_token: "tester-refresh-token",
        telephone: "+1234567890",
        role: {
          type: "driver",
          data: {
            car_model: "Toyota Prius",
            car_plate: "TEST1234",
            car_color: "Blue",
            license_number: "D-TEST-001",
          },
        },
      });
      router.replace("/(protected)/driver/newTripRequests");
    } else {
      setUser({
        id: "tester-passenger-001",
        name: "Passenger Tester",
        email: "test.passenger@ecotrip.com",
        image: "https://static.vecteezy.com/system/resources/thumbnails/049/641/954/small/black-man-with-beard-wearing-sweater-vector.jpg",
        access_token: "tester-access-token",
        refresh_token: "tester-refresh-token",
        role: {
          type: "passenger",
        },
      });
      router.replace("/(protected)/passenger/home");
    }
  };

  const handlePasswordReset = async () => {
    console.log("Email de redefinição de senha enviado");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <View style={styles.container}>
        <Image
          source={require("@/assets/logo.png")}
          style={{
            width: 150,
            height: 150,
            marginTop: 24,
            marginBottom: 2,
            alignSelf: "center",
          }}
        />

        <Text style={styles.title}>EcoTrip</Text>
        <Text style={styles.subtitle}>
          introduce tu correo para acceder a tu cuenta por favor
        </Text>

        <ScrollView
          style={{ flex: 1, padding: 24 }}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <Button
            style={{ justifyContent: "space-between", backgroundColor: "black" }}
            onPress={() => alert("Funcionalidad no implementada")}
          >
            <View
              style={{
                width: 60,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.green.dark,
                borderRadius: 10,
                height: "100%",
              }}
            >
              <Button.Icon icon={IconBrandGoogleFilled} />
            </View>

            <View
              style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
            >
              <Button.Title>
                <Text
                  style={{
                    color: colors.orange.bright,
                    fontSize: 16,
                    fontFamily: fontFamily.semiBold,
                  }}
                >
                  Login con google
                </Text>
              </Button.Title>
            </View>
          </Button>
          <View style={{  backgroundColor: colors.blue.cean, flex: 1, margin: 16, flexDirection: 'row', alignItems: "center", justifyContent: "space-around", padding: 8, borderRadius: 20, alignSelf: "center", maxWidth: 400 }}>
            <IconUserCog size={24} stroke={colors.green.base} />
            <Text
              style={{
                textAlign: "center",
                color: colors.gray[500],
                fontFamily: fontFamily.medium,
              }}
            >
              :
            </Text>

            <Pressable onPress={() => handleTesterLogin("driver")} style={[styles.roleChoice, { marginRight: 10, marginLeft: 16 }]}>
              <IconCarSuv size={24} stroke={colors.green.base} />
              <Text>Conductor</Text>
            </Pressable>

            <Pressable onPress={() => handleTesterLogin("passenger")} style={styles.roleChoice}>
              <IconFriends size={24} stroke={colors.green.base} />
              <Text>Pasajero</Text>
            </Pressable>

          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginVertical: 20,
            }}
          >
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
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="********"
              placeholderTextColor="#aaa"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <View>{showPassword ?  <IconEyeClosed size={24} stroke={colors.green.base} /> : <Text style={{color: colors.green.base}}>Mostar</Text>}</View>
            </TouchableOpacity>
          </View>

          <Button onPress={handleLogin} isLoading={isLoading}>
            <Button.Title>Entrar</Button.Title>
          </Button>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 20,
            }}
          >
            <Text
              onPress={() => router.replace("/register")}
              style={{ color: colors.green.dark }}
            >
              Regístrate
            </Text>
            <Text
              onPress={handlePasswordReset}
              style={{ color: colors.green.dark }}
            >
              Cambiar contraseña
            </Text>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontFamily: fontFamily.bold,
    color: colors.gray[600],
    textAlign: "center",
    marginBottom: 38,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 28,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    color: colors.gray[500],
    marginTop: 4,
  },
  input: {
    color: "#333",
    fontSize: 16,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#DDD",
    marginBottom: 20,
  },
  bar: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray[300],
    marginVertical: 20,
    margin: 10,
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
  }, toggleButton: {
    alignItems: "center",
    width: 80,
  },
});
