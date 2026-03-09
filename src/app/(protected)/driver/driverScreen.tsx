import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  LayoutAnimation,
  Alert,
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
import { api } from "@/services/api";

export default function DriverScreen() {
  const [selectedTrip, setSelectedTrip] = useState<TripRequestProps | null>(null);

  const { showToast } = useToast();
  const { user } = useUserAuth();

  const {
    availableTrips,connectLobby,disconnectLobby,selectTrip,
    confirmedTrip, setDriverState, driverState } = useDriver();

  console.log("DriverScreen renderizado, driverState:", driverState);

  useFocusEffect(
    useCallback(() => {
      connectLobby();
      return () => disconnectLobby();
    }, [])
  );

  useEffect(() => {
    setDriverState("idle");
  }, []);

  // 🚗 Aceitar viagem
  const handleAccept = (trip: TripRequestProps) => {
    if (!user || driverState !== "idle") return;

    setSelectedTrip(trip);
    setDriverState("pending");
    selectTrip(user, trip);
  };

  // ❌ Cancelar corrida
  const cancelTripByDriver = async (trip: TripRequestProps) => {
    if (!user) return;

    try {
      await api.post(
        `/trips/${trip.id}/cancel/driver`,
        {
          trip,
          reason: "Motorista cancelou a viagem",
        },
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        }
      );

      setSelectedTrip(null);
      setDriverState("idle");
      showToast("Viagem cancelada", "success");
    } catch (err: any) {
      showToast("Erro ao cancelar viagem", "error");
    }
  }

  const TripCard = ({
    item,
  }: {
    item: TripRequestProps;
  }) => {
    const isPending = driverState === "pending" && selectedTrip?.id === item.id;
    const isConfirmed = driverState === "confirmed";

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

        {isConfirmed ? (
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
            style={[
              styles.acceptButton,
              (driverState !== "idle") && styles.disabledButton,
            ]}
            disabled={driverState !== "idle"}
            onPress={() => handleAccept(item)}
          >
            {isPending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.acceptText}>Aceitar</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // 🟡 IDLE ou PENDING
  return (
   !confirmedTrip ? (
      <View style={styles.container}>
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.iconButton}>
            <IconHome size={20} fill={colors.gray[500]} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton}>
            <IconBell size={20} color={colors.gray[500]} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={() => router.push("/(protected)/driver/profile")}>
            <IconUser size={20} color={colors.gray[500]} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={() => router.push("/(protected)/driver/historic")}>
            <IconClock size={20} color={colors.gray[500]} />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Novos pedidos</Text>

        {!availableTrips?.length ? (
          <View style={styles.centered}>
            <Text>Sem novos pedidos no momento.</Text>
          </View>
        ) : (
          <FlatList
            data={availableTrips}
            keyExtractor={(item, index) => item.id || String(index)}
            renderItem={({ item }) => <TripCard item={item} />}
          />
        )}
      </View>
    ) : (
       <View style={[styles.container, {marginTop: 50}]}>
        <TripCard item={confirmedTrip} />

        <Button
          onPress={() => cancelTripByDriver(confirmedTrip)}
          style={{ marginTop: 16, backgroundColor: colors.red.base }}
        >
          <Button.Title>Cancelar</Button.Title>
        </Button>
      </View>
    )
  );
};

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