import { useTrip } from '@/context/tripContext';
import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface PriceInputProps {
  initialValue?: number;
  step?: number;
  minPrice?: number;
  currencySymbol?: string;
  onChange?: (value: number) => void;
}

export function PriceInput({
  initialValue = 0,
  step = 1,
  currencySymbol = 'Kz',
  minPrice = 400,
  onChange,
}: PriceInputProps) {
  const { price, setPrice, distance } = useTrip();

  const updatePrice = (newPrice: number) => {
    const valid = Math.ceil((Number.isNaN(newPrice) ? minPrice : Math.max(minPrice, newPrice)) / 25) * 25;
    setPrice(valid);
    onChange?.(valid);
  };

  const handleIncrement = (price: number) => updatePrice(price + step);
  const handleDecrement = (price: number) => updatePrice(price - step);

  const handleTextChange = (text: string) => {
    const parsed = parseFloat(text.replace(',', '.').replace(/[^0-9.]/g, ''));
    updatePrice(parsed);
  };

  return (
    price && distance ? (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => handleDecrement(price)}
          style={styles.button}
          disabled={price <= minPrice}
        >
          <Text style={[styles.buttonText, price <= minPrice && styles.disabledText]}>-</Text>
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

        <TouchableOpacity onPress={() => handleIncrement(price)} style={styles.button}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    ) : (
      <View style={{ alignSelf: "center" }}>
        <Text>elige un destino valido</Text>
      </View>
    )
  );
};

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