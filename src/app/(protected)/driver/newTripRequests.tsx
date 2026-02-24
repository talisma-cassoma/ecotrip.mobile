import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
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

export default function NewTripRequests() {
  const [selectedTrip, setSelectedTrip] =
    useState<TripRequestProps | null>(null);

  const { showToast } = useToast();
  const { user } = useUserAuth();
  const {
    availableTrips,
    connectLobby,
    disconnectLobby,
    selectTrip,
    //roomSocket,
  } = useDriver();

  // 🔌 Conexão lobby
  useFocusEffect(
    useCallback(() => {
      connectLobby();
      return () => disconnectLobby();
    }, [connectLobby, disconnectLobby])
  );

  // 🚗 Aceitar viagem
  const handleAcceptTrip = (trip: TripRequestProps) => {
    if (!user) {
      showToast("Usuário não autenticado", "error");
      return;
    }

    setSelectedTrip(trip);
    selectTrip(user, trip);
    //roomSocket?.emit(constants.event.JOIN_ROOM, { user, trip });
  };

  const cancelTrip = () => setSelectedTrip(null);

  const isSelected = !!selectedTrip;

  // 🔹 Card interno
  const TripCard = ({
    item,
    isSelected,
  }: {
    item: TripRequestProps;
    isSelected: boolean;
  }) => {
    const [status, setStatus] = useState<"idle" | "loading" | "disabled">(
      "idle"
    );

    const handleAccept = () => {
      if (status !== "idle") return;

      setStatus("loading");

      setTimeout(() => {
        setStatus("disabled");
        handleAcceptTrip(item);
      }, 500);
    };

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
              <Text style={styles.bold}>
                ${item.price?.toFixed(2)}
              </Text>
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
            style={[
              styles.acceptButton,
              (isLoading || isDisabled) && styles.disabledButton,
            ]}
            disabled={isLoading || isDisabled}
            onPress={handleAccept}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.acceptText}>
                {isDisabled ? "Aguarde" : "Aceitar"}
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // 🔹 Navbar
  const NavBar = () => (
    <View style={styles.navBar}>
      <TouchableOpacity style={styles.iconButton}>
        <IconHome size={20} fill={colors.gray[500]} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconButton}>
        <IconBell size={20} color={colors.gray[500]} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => router.push("/profile")}
      >
        <IconUser size={20} color={colors.gray[500]} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => router.push("/historic")}
      >
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

  return (
    <View style={styles.container}>
      <NavBar />
      <Text style={styles.title}>Novos pedidos</Text>

      {selectedTrip ? (
        <>
          <TripCard item={selectedTrip} isSelected={true} />

          <Button onPress={cancelTrip} style={{ marginTop: 16 }}>
            <Button.Title>Cancelar</Button.Title>
          </Button>
        </>
      ) : (
        <FlatList
          data={availableTrips}
          keyExtractor={(item, index) => item.id || String(index)}
          renderItem={({ item }) => (
            <TripCard item={item} isSelected={false} />
          )}
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

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 50,
  },

  iconButton: {
    borderRadius: 10,
    padding: 10,
    width: 50,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
    height: 120,
  },

  cardContent: {
    flex: 1,
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-between",
  },

  leftSection: {
    flexDirection: "row",
    flex: 1,
  },

  iconColumn: {
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: 6,
  },

  locationColumn: {
    justifyContent: "space-between",
  },

  rightSection: {
    justifyContent: "space-between",
    width: 80,
  },

  actionColumn: {
    width: 50,
    justifyContent: "space-around",
    alignItems: "center",
  },

  label: {
    fontSize: 11,
  },

  bold: {
    fontSize: 14,
    fontFamily: fontFamily.bold,
    color: colors.gray[600],
  },

  acceptButton: {
    width: 80,
    backgroundColor: colors.green.base,
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },

  disabledButton: {
    backgroundColor: colors.gray[400],
  },

  acceptText: {
    color: colors.gray[100],
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
  },
});

// { "assignedDriver": { "carColor": "Verde", "carModel": "Bmw", "carPlate": "Asd_123", "complited_rides": undefined, "email": "talisma63@gmail.com", "id": "ZOkX3-nYF8Qe", "image": "http://github.com/talisma-cassoma.png", "name": undefined, "rating": undefined, "telephone": "+2126000000" }, 
// "destination": { "location": { "lat": -1.4033, "lng": 5.6322 }, "name": "Loja Nova" }, 
// "directions": { }, 
// "distance": 586.715, 
// "duration": 704.0580000000001, 
// "email": "geoneto42@gmail.com", 
// "id": "B-tXSwAXt1GF", 
// "origin": { "location": { "lat": 1.8575468799281134, "lng": 9.773508861048843 }, 
// "name": "Ubicatión atual" }, 
// "owner": { "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODhjZGY0OWFjMTNhYWZhMzg1NDc1MGMiLCJ1c2VyUm9sZSI6InBhc3NlbmdlciIsImlhdCI6MTc3MTg4MDQ0NiwiZXhwIjoxNzcxOTY2ODQ2fQ.ekGmU-VDfXO8EhwDXuooohWWyJvMOC8eGQl0KKWh_LI", "email": "geoneto42@gmail.com", "id": "Rudu9qrOCX3I", 
//   "image": null, "name": "geovana neto", 
//   "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODhjZGY0OWFjMTNhYWZhMzg1NDc1MGMiLCJ1c2VyUm9sZSI6InBhc3NlbmdlciIsImlhdCI6MTc3MTg4MDQ0NiwiZXhwIjoxNzcyNDg1MjQ2fQ.C24b0eCV7MJA1yMi5AGk6uqRk12mEKiKxqGCE19lvtg", 
//   "role": { "type": "passenger" }, "socketId": "IEmccC1x3AQL4Bd4AAAV" }, "price": 88200 }