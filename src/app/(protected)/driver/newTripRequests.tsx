import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  LayoutAnimation,
} from "react-native";
import {
  IconPointFilled,
  IconMapPinFilled,
  IconPhone,
  IconMessage,
  IconUser,
  IconHome,
  IconBell,
  IconClock,
} from "@tabler/icons-react-native";

import { VerticalDashedLine } from "@/components/dottedLine";
import { colors, fontFamily } from "@/styles/theme";
import { TripRequestProps } from "@/types";
import { Button } from "@/components/button";
import { useUserAuth } from "@/hooks/useUserAuth";
import { useDriver } from "@/context/driverContext";
import { useToast } from "@/context/toastContext";
import { router, useFocusEffect } from "expo-router";
import { constants } from "@/configs/constants";
import { api } from "@/services/api";

export default function NewTripRequests() {
  const [selectedTrip, setSelectedTrip] = useState<TripRequestProps | null>(null);

  // Estado externo de status dos trips
  const [tripStatus, setTripStatus] = useState<{ [id: string]: "idle" | "loading" | "disabled" }>({});

  const { showToast } = useToast();
  const { user } = useUserAuth();
  const { availableTrips, connectLobby, disconnectLobby, selectTrip, confirmedTrip } = useDriver();

  // 🔌 Conexão lobby
  useFocusEffect(
    useCallback(() => {
      connectLobby();
      return () => disconnectLobby();
    }, [connectLobby, disconnectLobby])
  );

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [availableTrips]);

  // 🚗 Aceitar viagem
  const handleAcceptTrip = (trip: TripRequestProps) => {
    if (!user) {
      showToast("Usuário não autenticado", "error");
      return;
    }

    setSelectedTrip(trip);
    selectTrip(user, trip);
  };

  const cancelTripByDriver = async (trip: TripRequestProps) => {
    if (!user) {
      showToast("Usuário não autenticado", "error");
      return;
    }

    setTripStatus(prev => ({ ...prev, [trip.id as string]: "loading" }));

    try {
      const response = await api.post(
        `/trips/${trip.id}/cancel/driver`,
        {
          trip,
          reason: "Motorista cancelou a viagem"
        },
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          }
        }
      );

      // Atualiza estado apenas se deu certo
      setSelectedTrip(null);
      setTripStatus(prev => ({ ...prev, [trip.id as string]: "idle" }));

      showToast(response.data.message, "success");

    } catch (err: any) {
      console.log(err);
      showToast(err?.response?.data?.message || "Erro ao cancelar viagem", "error");
      setTripStatus(prev => ({ ...prev, [trip.id as string]: "idle" }));
    }
  };

  // 🚦 Aceitar viagem (atualiza status externo)
  const handleAccept = (trip: TripRequestProps) => {

    if (tripStatus[trip.id as string] === "loading" || tripStatus[trip.id as string] === "disabled") return;

    setTripStatus(prev => ({ ...prev, [trip.id as string]: "loading" }));

    setTimeout(() => {
      setTripStatus(prev => ({ ...prev, [trip.id as string]: "disabled" }));
      handleAcceptTrip(trip);
    }, 500);
  };

  const TripCard = React.memo(
    ({
      item,
      isSelected,
      status,
      onAccept,
    }: {
      item: TripRequestProps;
      isSelected: boolean;
      status: "idle" | "loading" | "disabled";
      onAccept: (trip: TripRequestProps) => void;
    }) => {
      const isLoading = status === "loading";
      const isDisabled = status === "disabled";

      return (
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.leftSection}>
              <View style={styles.iconColumn}>
                <IconPointFilled size={20} fill={colors.green.base} />
                <VerticalDashedLine height={38} width={4} color="#aaa" />
                <IconMapPinFilled size={15} fill={colors.green.base} />
              </View>

              <View style={styles.locationColumn}>
                <View>
                  <Text style={styles.label}>Origem</Text>
                  <Text style={styles.bold}>{item.origin?.name}</Text>
                </View>

                <View>
                  <Text style={styles.label}>Destino</Text>
                  <Text style={styles.bold}>{item.destination?.name}</Text>
                </View>
              </View>
            </View>

            <View style={styles.rightSection}>
              <Text style={styles.label}>
                Valor{"\n"}
                <Text style={styles.bold}>${item.price?.toFixed(2)}</Text>
              </Text>

              <Text style={styles.label}>
                Distância{"\n"}
                <Text style={styles.bold}>{item.distance}</Text>
              </Text>
            </View>
          </View>

          {isSelected ? (
            <View style={styles.actionColumn}>
              <TouchableOpacity>
                <IconPhone size={24} color={colors.green.light} />
              </TouchableOpacity>
              <TouchableOpacity>
                <IconMessage size={24} color={colors.green.light} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.acceptButton, (isLoading || isDisabled) && styles.disabledButton]}
              disabled={isLoading || isDisabled}
              onPress={() => onAccept(item)}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.acceptText}>{isDisabled ? "Aguarde" : "Aceitar"}</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      );
    },
    (prev, next) => prev.status === next.status && prev.isSelected === next.isSelected
  );

  const NavBar = () => (
    <View style={styles.navBar}>
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

  if (!availableTrips?.length) {
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

  if (confirmedTrip) {
  return (
    <View style={styles.container}>
      <NavBar />
      <TripCard item={confirmedTrip} isSelected status="disabled" onAccept={handleAccept} />
      <Button
        onPress={() => cancelTripByDriver(confirmedTrip)}
        style={{
          marginTop: 16,
          backgroundColor:
            tripStatus[confirmedTrip.id as string] === "loading"
              ? colors.gray[400]
              : colors.red.base
        }}
        disabled={tripStatus[confirmedTrip.id as string] === "loading"}
      >
        <Button.Title>
          {tripStatus[confirmedTrip.id as string] === "loading"
            ? "Cancelando..."
            : "Cancelar"}
        </Button.Title>
      </Button>
    </View>
  );
}
if (!availableTrips?.length) {
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
  return (
    <View style={styles.container}>
      <NavBar />
      <Text style={styles.title}>Novos pedidos</Text>
      <FlatList
        data={availableTrips}
        keyExtractor={(item, index) => item.id || String(index)}
        renderItem={({ item }) => (
          <TripCard
            item={item}
            isSelected={false}
            status={tripStatus[item.id as string] || "idle"}
            onAccept={handleAccept}
          />
        )}
        extraData={tripStatus} // só re-renderiza itens que mudaram
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: colors.green.soft },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 15 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  navBar: { flexDirection: "row", justifyContent: "space-around", marginBottom: 50 },
  iconButton: { borderRadius: 10, padding: 10, width: 50, height: 40, justifyContent: "center", alignItems: "center" },
  card: { flexDirection: "row", borderWidth: 1, borderColor: "#ddd", borderRadius: 12, marginBottom: 12, backgroundColor: "#fff", height: 120 },
  cardContent: { flex: 1, flexDirection: "row", padding: 10, justifyContent: "space-between" },
  leftSection: { flexDirection: "row", flex: 1 },
  iconColumn: { justifyContent: "space-between", alignItems: "center", marginRight: 6 },
  locationColumn: { justifyContent: "space-between" },
  rightSection: { justifyContent: "space-between", width: 80 },
  actionColumn: { width: 50, justifyContent: "space-around", alignItems: "center" },
  label: { fontSize: 11 },
  bold: { fontSize: 14, fontFamily: fontFamily.bold, color: colors.gray[600] },
  acceptButton: { width: 80, backgroundColor: colors.green.base, justifyContent: "center", alignItems: "center", borderTopRightRadius: 12, borderBottomRightRadius: 12 },
  disabledButton: { backgroundColor: colors.gray[400] },
  acceptText: { color: colors.gray[100], fontFamily: fontFamily.semiBold, fontSize: 16 },
});