// AutoCompleteInput.tsx
import React, { useState } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useTrip } from '../../context/tripContext';
import { StyleSheet } from 'react-native';
import { colors, fontFamily } from "@/styles/theme"
import { getDistance } from "geolib";

interface AutoCompleteInputProps {
    type: 'origin' | 'destination'; // define o comportamento
    setLocatePressed?: (value: boolean) => void; // só usado em origem
    zIndex?: number; // novo
}

// Mock com coordenadas simuladas
const MOCK_PLACES = [
  { name: 'Bata', latitude: 1.8575, longitude: 9.7686 },
  { name: 'Malabo', latitude: 3.7500, longitude: 8.7833 },
  { name: 'Libreville', latitude: 0.3901, longitude: 9.4544 },
  { name: 'São Tomé', latitude: 0.3365, longitude: 6.7273 },
  { name: 'Libreville Airport', latitude: 0.4586, longitude: 9.4123 },
  { name: 'Malabo Port', latitude: 3.7554, longitude: 8.7792 },
  { name: 'Bata Station', latitude: 1.8600, longitude: 9.7720 },
];


export function AutoCompleteInput({
    type,
    setLocatePressed,
    zIndex
}: AutoCompleteInputProps) {
    const { setOriginCoords, setDestinationCoords, setDistance, distance, originCoords, destinationCoords } = useTrip();

    const [useGooglePlacesAutocompleteInput, setUseGooglePlacesAutocompleteInput] = useState(false);
    const [manualInput, setManualInput] = useState('');
    const [filteredPlaces, setFilteredPlaces] = useState<typeof MOCK_PLACES>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // placeholders personalizados
    const placeholders = {
        origin: 'Ubicación actual',
        destination: 'Destino (Ex: Bata ou Malabo)',
    };

    // ação ao selecionar um local
    const handlePlaceSelect = (data: any, details: any) => {
        if (!details || !details.geometry) {
            console.warn(`Detalhes de ${type} não encontrados`);
            return;
        }

        const { lat, lng } = details.geometry.location;
        const { name } = details;

        if (type === 'origin') {
            setOriginCoords({ latitude: lat, longitude: lng, name });
            setLocatePressed && setLocatePressed(false);
            console.log('Origem selecionada:', { latitude: lat, longitude: lng });
        } else {
            setDestinationCoords({ latitude: lat, longitude: lng, name });
            console.log('Destino selecionado:', { latitude: lat, longitude: lng });
        }
          
  setTimeout(() => {
    if (originCoords?.latitude && destinationCoords?.latitude) {
      const distanceMeters = getDistance(
        { latitude: originCoords.latitude, longitude: originCoords.longitude },
        { latitude: destinationCoords.latitude, longitude: destinationCoords.longitude }
      );

      const distanceKm = distanceMeters / 1000;
      setDistance(distanceKm);

      console.log(`🧭 Distância aproximada: ${distanceKm.toFixed(2)} km`);
    }
  }, 100);
    };

    // fallback manual
      const handleSelect = (place: { name: string; latitude: number; longitude: number }) => {
    const { name, latitude, longitude } = place;
    const coords = { latitude, longitude, name };

    if (type === 'origin') {
      setOriginCoords(coords);
      setLocatePressed && setLocatePressed(false);
    } else {
      setDestinationCoords(coords);
    }

    setManualInput(name);
    setShowSuggestions(false);
  };

  const handleChange = (text: string) => {
    setManualInput(text);
    if (text.length > 0) {
      const filtered = MOCK_PLACES.filter((p) =>
        p.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredPlaces(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleManualSubmit = () => {
    const coords = { latitude: 0, longitude: 0, name: manualInput };
    if (type === 'origin') {
      setOriginCoords(coords);
      setLocatePressed && setLocatePressed(false);
    } else {
      setDestinationCoords(coords);
    }
  };

    return (
        <View
            style={[
                styles.autocompleteWrapper,
                type === 'origin' && styles.originInputMargin,
                { zIndex: zIndex || 1 }
            ]}
        >
            {useGooglePlacesAutocompleteInput ? (
                <GooglePlacesAutocomplete
                    placeholder={placeholders[type]}
                    nearbyPlacesAPI="GooglePlacesSearch"
                    debounce={400}
                    fetchDetails={true}
                    query={{
                        key: process.env.GOOGLE_API_KEY || '',
                        language: 'es',
                        components: 'country:gq',
                    }}
                    onPress={handlePlaceSelect}
                    onFail={(error) => {
                        console.warn('Erro na API do Google:', error);
                        setUseGooglePlacesAutocompleteInput(false); // ativa fallback
                    }}
                    styles={{
                        container: { flex: 1 },
                        textInputContainer: {
                            flex: 1,
                            backgroundColor: 'transparent',
                            paddingHorizontal: 0,
                            height: 45,
                        },
                        textInput: {
                            ...styles.input,
                            paddingVertical: 0,
                            height: 45,
                        },
                        listView: {
                            zIndex: 1000,
                            backgroundColor: 'white',
                            position: 'absolute',
                            top: 45,
                            left: 0,
                            right: 0,
                            elevation: 5,
                            shadowColor: '#000',
                            shadowOpacity: 0.2,
                            shadowOffset: { height: 2, width: 0 },
                            shadowRadius: 3,
                        },
                        row: { padding: 13, flexDirection: 'row', backgroundColor: 'white' },
                        description: { fontSize: 15, color: colors.gray[600], flex: 1 },
                    }}
                />
            ) : (
                <>
                    <TextInput
                        placeholder={`Digite ${type === 'origin' ? 'sua localização' : 'seu destino'} manualmente`}
                        value={manualInput}
                        onChangeText={handleChange}
                        style={styles.input}
                        onSubmitEditing={handleManualSubmit}
                    />
                    {showSuggestions && filteredPlaces.length > 0 && (
                        <View style={styles.suggestionsWrapper}>
                            <FlatList
                                data={filteredPlaces}
                                 keyExtractor={(item, index) => item.name || String(index)}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => handleSelect(item)} style={styles.suggestionItem}>
                                        <Text style={styles.suggestionText}>{item.name}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    )}
                </>

            )}
        </View>
    );
}



const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 12, // Padding interno do card
        marginHorizontal: 16,
        // shadowColor: '#000',
        // shadowOpacity: 0.1,
        // shadowRadius: 4,
        // elevation: 3,
    },
    threeColumnRow: { // Estilo para a View que contém as 3 colunas
        flexDirection: 'row',

        alignItems: 'flex-start',
        marginBottom: 10,
    },
    iconColumn: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        rowGap: 10,
    },
    dashedLineWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputColumn: {
        flex: 1,
        flexDirection: 'column',
        marginHorizontal: 10,
    },
    autocompleteWrapper: {
        height: 45,
        borderRadius: 8,
        paddingHorizontal: 10,
        overflow: 'visible', // MUITO IMPORTANTE: Permite que a lista flutue para fora
        justifyContent: 'center',
        zIndex: 1000,
    },
    originInputMargin: {
        marginBottom: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: colors.gray[600],
        paddingVertical: 0,
    },
    suggestionsWrapper: {
        position: 'absolute',
        top: 45,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { height: 2, width: 0 },
        shadowRadius: 3,
        zIndex: 1000,
    },
    suggestionItem: {
        padding: 10,
    },
    suggestionText: {
        fontSize: 15,
        color: colors.gray[600],
    },
});