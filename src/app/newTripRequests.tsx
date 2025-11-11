import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { IconUser, IconHome, IconBell, IconClock } from "@tabler/icons-react-native";
import { colors, fontFamily } from "@/styles/theme";
import { router } from "expo-router";
import { NewTripRequest} from "@/components/newTripRequest";
import { TripRequestProps} from "@/types";
import { Button } from "@/components/button";
import { useUserAuth } from "@/context/userAuthContext";
import { api } from "@/services/api";
import { AxiosError } from "axios";
import { useDriver } from "@/context/driverContext";


export default function NewTripRequests() {
  const [selectedTrip, setSelectedTrip] = useState<TripRequestProps | null>(null);
  const [isSelected, setIsSelected] = useState(false);

  const { availableTrips, lobbySocket } = useDriver() ?? {};
  const { user } = useUserAuth();

  // 🚗 Aceitar viagem
  const handleAcceptTrip = (trip: TripRequestProps) => {
    console.log("Aceitando viagem:", trip.id);
    setIsSelected(true);
    setSelectedTrip(trip);

    if (user?.role.type === "driver" && lobbySocket) {
      lobbySocket.emit("client:accept-trip", {
        trip_id: trip.id,
        driver_email: user.email,
      });
    }
  };

  // Cancelar viagem
  const cancelTripByDriver = async () => {
    if (!selectedTrip) return;
    try {
      const reason = "driver cancel because is bored"; // exemplo
      // await api.post(
      //   `/trips/${selectedTrip.id}/cancel/driver`,
      //   { user_id: user?.id, reason },
      //   {
      //     headers: {
      //       access_token: user?.access_token,
      //       refresh_token: user?.refresh_token,
      //     },
      //   }
      // );
      console.log("Viagem cancelada com sucesso");
      setSelectedTrip(null);
      setIsSelected(false);
    } catch (error) {
      const err = error as AxiosError;
      console.error("Erro ao cancelar viagem:", err.message);
    }
  };

  // ⚙️ Quando novas viagens estiverem disponíveis via contexto
  useEffect(() => {
    if (availableTrips) {
      console.log("Novas viagens disponíveis:", availableTrips.length);
    }
  }, [availableTrips]);

  // 🧭 UI de navegação inferior
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
          <Text>Sem novos pedidos.</Text>
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
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NewTripRequest item={item} onAccept={handleAcceptTrip} isSelected={isSelected} />
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
