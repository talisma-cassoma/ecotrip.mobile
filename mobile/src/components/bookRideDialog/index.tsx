import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import 'react-native-get-random-values'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';
import styles from './styles';
import { useLocation } from '../../context/locationContext';
import { Button } from '../button';

export function BookRideDialog() {
  const [locatePressed, setLocatePressed] = useState(false);
  const { setOriginCoords, setDestinationCoords } = useLocation();

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

  const handleStartRide = async () => {

  }

  return (
    <View style={styles.container}>
      {/* Origem */}
      <View style={styles.row}>
        <View style={[styles.dot, { backgroundColor: 'blue' }]} />
        <GooglePlacesAutocomplete
          placeholder="Minha localização"
          fetchDetails={true}
          onPress={(data, details = null) => {
            if (!details || !details.geometry) {
              console.log('Detalhes não encontrados');
              return;
            }
            const { lat, lng } = details.geometry.location;
            setOriginCoords({ latitude: lat, longitude: lng });
          }}
          query={{
            key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_APIKEY,
            language: 'es',
            components: 'country:gq', 
          }}
          styles={{
            textInput: styles.input,
            textInputContainer: { flex: 1 },
          }}
        />
        <TouchableOpacity onPress={handleGetLocation}>
          <Ionicons
            name="locate-outline"
            size={20}
            color={locatePressed ? 'blue' : '#aaa'}
          />
        </TouchableOpacity>
      </View>

      {/* Destino */}
      <View style={styles.row}>
        <View style={[styles.dot, { backgroundColor: 'red' }]} />
        <GooglePlacesAutocomplete
          placeholder="Destino (Ex: Rua A, São Paulo)"
          fetchDetails={true}
          onPress={(data, details = null) => {
            if (!details || !details.geometry) {
              console.log('Detalhes não encontrados');
              return;
            }
            const { lat, lng } = details.geometry.location;
            setDestinationCoords({ latitude: lat, longitude: lng });
          }}
          query={{
            key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_APIKEY,
            language: 'es',
            components: 'country:gq',
          }}
          styles={{
            textInput: styles.input,
            textInputContainer: { flex: 1 },
          }}
        />
        <TouchableOpacity onPress={()=>{}}>
          <MaterialCommunityIcons name="swap-vertical" size={20} color="#aaa" />
        </TouchableOpacity>
      </View>
      <Button onPress={handleStartRide} style={{marginTop: 40}}>
              <Button.Title>
                Comenzar viaje
              </Button.Title>
            </Button>
    </View>
  );
}
