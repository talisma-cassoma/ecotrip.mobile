import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { IconCurrentLocation, IconMapPinFilled, IconRadar2, IconArrowRight } from "@tabler/icons-react-native"
import 'react-native-get-random-values'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';
import styles from './styles';
import { useTrip } from '../../context/tripContext';
import { Button } from '../button';

import { VerticalDashedLine } from '../dottedLine';
import { PriceInput } from '../priceInput';
import { colors } from "@/styles/theme"
import { router } from 'expo-router';
import { formatDistance, formatDuration } from '@/utils/converter';
import { AutoCompleteInput } from '../autoCompleteInput';


export function BookRideDialog() {
  const [locatePressed, setLocatePressed] = useState(false);
  const { setOriginCoords, setDestinationCoords, originCoords, destinationCoords, duration, price, distance } = useTrip();

  const VerticalDashedLineHeight = 45;
  const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_APIKEY;

  const handleGetLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }
    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    const currentLocation = {
      latitude,
      longitude,
      name: 'Ubicatión atual',
    };

    setOriginCoords(currentLocation);
    setLocatePressed(true);
    console.log('Current location:', { latitude, longitude });
  };

  const handleRideRequest = async () => {
    router.navigate("./selectADriver")

  }

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso de ubicación denegado. Por favor, habilite el acceso a la ubicación en la configuración de su dispositivo.');
        await Location.requestForegroundPermissionsAsync();
      }
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;


      const currentLocation = {
        latitude,
        longitude,
        name: 'Ubicatión atual',
      };

      setOriginCoords(currentLocation);
    };

    getLocation();
  }, []);

  return (
    <>
      <View style={styles.container}>
        {/* Container principal das 3 colunas */}
        <View style={styles.threeColumnRow}>

          {/* Coluna Esquerda (Ícones Origem/Destino) */}
          <View style={styles.iconColumn}>
            <IconRadar2 size={20} color='#aaa' />

            <View style={styles.dashedLineWrapper}>
              <VerticalDashedLine height={VerticalDashedLineHeight} width={4} color='#aaa' />
            </View>
            <IconMapPinFilled size={20} fill='#aaa' />
          </View>

          {/* Coluna Central (Inputs) */}
          <View style={styles.inputColumn}>

            <AutoCompleteInput
              type="origin"
              zIndex={1001}
            />

            {/* Wrapper para o Input de Destino */}
            <AutoCompleteInput
              type="destination"
            />
          </View>

          {/* Coluna Direita (Ícones Ação/Swap) */}
          <View style={styles.iconColumn}>
            <TouchableOpacity onPress={handleGetLocation} activeOpacity={0.8} disabled={locatePressed}>
              <IconCurrentLocation
                size={20}
                color={locatePressed ? '#007bc9' : '#aaa'}
              />
            </TouchableOpacity>
            {/* Wrapper para a linha tracejada */}
            <View style={styles.dashedLineWrapper}>
              <VerticalDashedLine height={VerticalDashedLineHeight} width={0} color={colors.gray[600]} />
            </View>
            <TouchableOpacity onPress={() => { /* swap logic */ }}>
              <MaterialCommunityIcons name="swap-vertical" size={20} color="#aaa" />
            </TouchableOpacity>
          </View>

        </View>
        {originCoords && destinationCoords && (
          <View style={{ flexDirection: "column", gap: 10, margin: 10 }}>
            <View style={{ marginBottom: 10, marginTop: 10, alignItems: 'center' }}>
              <View style={{ width: "auto", flexDirection: "row", gap: 12, margin: 16, justifyContent: "center" }}>
                <Text>{originCoords.name}</Text>
                <IconArrowRight
                  width={24}
                  height={24}
                  color={colors.gray[600]}
                />
                <Text>{destinationCoords.name}</Text>
              </View>
              {distance && <Text> {formatDistance(distance)}</Text>}
              <Text >{duration ? (`el tempo previsto de viaje es ${formatDuration(duration)}`) : ("")}</Text>
            </View>
            {price && (
              <PriceInput
                initialValue={price}
                currencySymbol="Francos"
                step={price / 10}
              />

            )}
            {distance && (
              <Button onPress={handleRideRequest} style={{ marginTop: 16 }}>
                <Button.Title>buscar un conductor</Button.Title>
              </Button>
            )}
          </View>
        )}
      </View>
    </ >
  );
}