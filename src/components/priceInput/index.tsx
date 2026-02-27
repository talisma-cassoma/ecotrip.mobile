import { useTrip } from '@/context/tripContext';
import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { usePassenger } from '@/context/passengerContext';
import { TripRequestProps } from '@/types';

interface PriceInputProps {
  initialValue?: number;
  step?: number;
  currencySymbol?: string;
  onChange?: (value: number) => void;
}

export function PriceInput({
  initialValue = 0,
  step = 1,
  currencySymbol = 'FCFA',
  onChange,
}: PriceInputProps) {

  const { price, setPrice, distance } = useTrip();
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
   const { newTrip, updateTrip, setNewTrip, availableDrivers } = usePassenger();
   const canEdit = availableDrivers.length === 0;
 

  // Reset calculatedPrice quando a distance mudar
  useEffect(() => {
    setCalculatedPrice(null);
  }, [distance]);

const updatePrice = (newPrice: number) => {
  let base = calculatedPrice;

  if (base === null) {
    setCalculatedPrice(newPrice);
    base = newPrice;
  }

  const minAllowed = base * 0.85;
  const clampedPrice = Math.max(newPrice, minAllowed);
  const validPrice = Math.ceil(clampedPrice / 50) * 50;

  setPrice(validPrice);
  onChange?.(validPrice);

  if (!newTrip?.trip?.id) {
    console.warn("Room ainda não criada, não é possível atualizar.");
    return;
  }

  // Atualiza estado local primeiro
  setNewTrip((prev) => {
    if (!prev || !prev.trip) return prev;

    return {
      ...prev,
      trip: {
        ...prev.trip,
        price: validPrice,
      },
    };
  });

  // Envia apenas o campo alterado
  updateTrip(newTrip.trip.id, { price: validPrice });
};


  const handleIncrement = (price: number) => updatePrice(price + step);
  const handleDecrement = (price: number) => updatePrice(price - step);

  const handleTextChange = (text: string) => {
    const parsed = parseFloat(text.replace(',', '.').replace(/[^0-9.]/g, ''));
    updatePrice(parsed);
  };

  const minAllowed = calculatedPrice ? calculatedPrice : 0;


  return price ? (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => handleDecrement(price)}
        style={styles.button}
       disabled={!canEdit || calculatedPrice !== null && price <= (minAllowed ?? 0)}
      >
        <Text
          style={[
            styles.buttonText,
            calculatedPrice !== null && price <= minAllowed && styles.disabledText,
          ]}
        >
          -
        </Text>
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={price.toString()}
          onChangeText={handleTextChange}
        />
        <Text style={styles.currency}>{currencySymbol}</Text>
      </View>

      <TouchableOpacity onPress={() => handleIncrement(price)} style={styles.button}  disabled={!canEdit}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
   ) : (
    <View style={{ alignSelf: 'center' }}>
      <Text>Elige un destino válido</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#000',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currency: {
    color: '#FFF',
    fontSize: 18,
    marginRight: 1,
  },
  input: {
    color: '#FFF',
    fontSize: 18,
    textAlign: 'left',
    minWidth: 20,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  disabledText: {
    color: '#666',
  },
});
