import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { IconUser, IconHome, IconBell, IconClock } from "@tabler/icons-react-native";
import { colors, fontFamily } from "@/styles/theme";
import { router, useFocusEffect } from "expo-router";
import { NewTripRequest } from "@/components/newTripRequest";
import { TripRequestProps } from "@/types";
import { Button } from "@/components/button";
import { useUserAuth } from "@/hooks/useUserAuth";
import { api } from "@/services/api";
import { AxiosError } from "axios";
import { useDriver } from "@/context/driverContext";
import { useToast } from "@/context/toastContext";

export default function NewTripRequests() {
  const [selectedTrip, setSelectedTrip] = useState<TripRequestProps | null>(null);
  const [isSelected, setIsSelected] = useState(false);
  const { showToast } = useToast();
  const { user } = useUserAuth();

  // Obtendo funções e estado do contexto do motorista
  const {
    availableTrips,
    connectLobby,
    disconnectLobby,
    selectTrip,
    //setOnConfirmedTrip,
  } = useDriver();

  // Conecta e desconecta do lobby com base no foco da tela
  useFocusEffect(
    useCallback(() => {
      console.log("Entrando na tela de novos pedidos, conectando ao lobby...");
      connectLobby();

      return () => {
        console.log("Saindo da tela de novos pedidos, desconectando do lobby...");
        disconnectLobby();
      };
    }, [connectLobby, disconnectLobby])
  );

  // 🚗 Lida com a confirmação/aceite de uma viagem
  const handleAcceptTrip = (trip: TripRequestProps) => {
    if (!user) {
      showToast("Usuário não autenticado", "error");
      return;
    }
    console.log("Selecionando viagem no contexto:", trip.id);
    setIsSelected(true);
    setSelectedTrip(trip);
    // Delega a lógica de entrar na sala para o contexto
    selectTrip(user, trip);
  };

  // Cancela a viagem
  const cancelTripByDriver = async () => {
    if (!selectedTrip) return;
    try {
      // Lógica de API para cancelar
      console.log("Viagem cancelada com sucesso");
      setSelectedTrip(null);
      setIsSelected(false);
      // O ideal é que o lobby notifique a remoção, mas podemos limpar localmente por otimismo
    } catch (error) {
      const err = error as AxiosError;
      console.error("Erro ao cancelar viagem:", err.message);
    }
  };

  // Efeito para registrar o callback de confirmação de viagem
  // useEffect(() => {
  //   // A função setOnConfirmedTrip pode não estar disponível imediatamente se o contexto for nulo
  //   if (setOnConfirmedTrip) {
  //     setOnConfirmedTrip((trip: TripRequestProps) => {
  //       console.log("Viagem confirmada pelo contexto!", trip);
  //       handleAcceptTrip(trip);
  //     });
  //   }
  //   // Cleanup não é necessário se o callback for estável
  // }, [setOnConfirmedTrip]);


  // UI de navegação inferior
  const NavBar = () => (
    <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 50 }}>
      <TouchableOpacity style={styles.iconButton}>
        <IconHome size={20} fill={colors.gray[500]} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconButton}>
        <IconBell size={20} color={colors.gray[500]} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconButton} onPress={() => router.push("/profile")}>
        <IconUser size={20} color={colors.gray[500]} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconButton} onPress={() => router.push("/historic")}>
        <IconClock size={20} color={colors.gray[500]} />
      </TouchableOpacity>
    </View>
  );

  // Se não houver viagens
  if (!availableTrips || availableTrips.length === 0) {
    return (
      <View style={styles.container}>
        <NavBar />
        <Text style={styles.title}>Novos pedidos</Text>
        <View style={styles.centered}>
          <Text>Sem novos pedidos no momento.</Text>
        </View>
      </View>
    );
  }

  // Renderização principal
  return (
    <View style={styles.container}>
      <NavBar />
      <Text style={styles.title}>Novos pedidos</Text>

      {selectedTrip ? (
        <View style={{ flexDirection: "column", width: "100%", height: 230 }}>
          <NewTripRequest item={selectedTrip} onAccept={() => {}} isSelected={isSelected} />
          <Text style={{ fontFamily: fontFamily.regular, fontSize: 16, color: colors.gray[600] }}>
            Você pode ligar clicando em “Ligar” ou enviar uma mensagem.
          </Text>

          <Button
            onPress={() => cancelTripByDriver()}
            style={{ marginTop: 16 }}
          >
            <Button.Title>Cancelar</Button.Title>
          </Button>
        </View>
      ) : (
        <FlatList
          data={availableTrips}
          keyExtractor={(item, index) => item.id || String(index)}
          renderItem={({ item }) => (
            <NewTripRequest item={item} onAccept={() => handleAcceptTrip(item)} isSelected={false} />
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.green.soft,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  iconButton: {
    borderRadius: 10,
    padding: 10,
    width: 50,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});