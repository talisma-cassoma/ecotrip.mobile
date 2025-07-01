import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { IconCurrentLocation, IconMapPinFilled, IconRadar2 } from "@tabler/icons-react-native"
import 'react-native-get-random-values'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';
import styles from './styles';
import { useLocation } from '../../context/locationContext';
import { Button } from '../button';
import { LocationProvider } from '../../context/locationContext';
import VerticalDashedLine from '../dottedLine';
import { PriceInput } from '../priceInput';
import { colors } from "@/styles/theme"
import { router } from 'expo-router';


export function BookRideDialog() {
  const [locatePressed, setLocatePressed] = useState(false);
  const { setOriginCoords, setDestinationCoords, originCoords, destinationCoords } = useLocation();

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

    setOriginCoords({ latitude, longitude });
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
        alert('Permiso de ubicación denegado. Por favor, habilite el acceso a la ubicación en la configuración de su dispositivo.');
        await Location.requestForegroundPermissionsAsync();
      }
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      setOriginCoords({ latitude, longitude });
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

            <View style={[styles.autocompleteWrapper, styles.originInputMargin]}>
              <GooglePlacesAutocomplete
                placeholder="Ubicación actual"
                nearbyPlacesAPI='GooglePlacesSearch'
                debounce={400}
                fetchDetails={true}
                onPress={(data, details = null) => {
                  if (!details || !details.geometry) return;
                  const { lat, lng } = details.geometry.location;
                  setOriginCoords({ latitude: lat, longitude: lng });
                  console.log("origem selecionada:", { latitude: lat, longitude: lng }); // 
                  setLocatePressed(false);
                }}
                query={{
                  key: GOOGLE_API_KEY,
                  language: 'es',
                  components: 'country:gq',
                }}
                styles={{
                  container: { flex: 1 },
                  textInputContainer: {
                    flex: 1, // 
                    backgroundColor: 'transparent',
                    paddingHorizontal: 0,
                    height: 45,
                  },

                  textInput: {
                    ...styles.input,
                    paddingVertical: 0,
                    height: 45,
                  },
                  // Estilos da lista de sugestões
                  listView: {
                    zIndex: 1000, // 
                    backgroundColor: 'white',
                    position: 'absolute',
                    top: 45,
                    left: 0, right: 0,
                  },
                  row: { padding: 13, flexDirection: 'row', backgroundColor: 'white' },
                  description: { fontSize: 15, color: colors.gray[600], flex: 1 },
                }}
              />
            </View>

            {/* Wrapper para o Input de Destino */}
            <View style={styles.autocompleteWrapper}>
              <GooglePlacesAutocomplete
                placeholder="Destino (Ex: bata ou malabo)"
                fetchDetails={true}
                onPress={(data, details = null) => {
                  if (!details || !details.geometry) {
                    console.log('Detalhes de destino não encontrados');
                    return;
                  }
                  const { lat, lng } = details.geometry.location;
                  setDestinationCoords({ latitude: lat, longitude: lng });
                  console.log("destino selecionado:", { latitude: lat, longitude: lng });
                }}
                query={{
                  key: GOOGLE_API_KEY,
                  language: 'es',
                  components: 'country:gq',
                }}
                styles={{
                  container: { flex: 1 },
                  textInputContainer: { flex: 1, backgroundColor: 'transparent', paddingHorizontal: 0, height: 45 },
                  textInput: { ...styles.input, paddingVertical: 0, height: 45 },
                  listView: {
                    zIndex: 1000,
                    backgroundColor: 'white',
                    position: 'absolute',
                    top: 45,
                    left: 0, right: 0,
                    elevation: 5,
                    shadowColor: '#000',
                    shadowOpacity: 0.2,
                    shadowOffset: { height: 2, width: 0 },
                    shadowRadius: 3,
                  },
                  row: { padding: 13, flexDirection: 'row', backgroundColor: 'white' },
                  description: { fontSize: 15, color: `${colors.gray[600]}`, flex: 1 },
                }}
              />
            </View>
          </View>

          {/* Coluna Direita (Ícones Ação/Swap) */}
          <View style={styles.iconColumn}>
            <TouchableOpacity onPress={handleGetLocation}>
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
          <>
            <View style={{ marginBottom: 10, marginTop: 10, alignItems: 'center' }}>
              <Text >el tempo previsto de viaje es 100 min</Text>
            </View>

            <PriceInput
              initialValue={10}
              currencySymbol="$"
              minPrice={7}
              step={5}
              onChange={(value) => console.log('Novo preço:', value)}
            />
            <Button onPress={handleRideRequest} style={{ marginTop: 16 }}>
              <Button.Title>encontar un motorista</Button.Title>
            </Button>
          </>
        )}
      </View>
    </ >
  );
}