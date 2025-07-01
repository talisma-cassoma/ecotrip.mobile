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
 minPrice = 0,
  onChange,
}: PriceInputProps){
  const [price, setPrice] = useState<number>(Math.max(initialValue, minPrice));

  const updatePrice = (newPrice: number) => {
    const valid = Number.isNaN(newPrice) ? minPrice : Math.max(minPrice, newPrice);
    setPrice(valid);
    onChange?.(valid);
  };

  const handleIncrement = () => updatePrice(price + step);
  const handleDecrement = () => updatePrice(price - step);

  const handleTextChange = (text: string) => {
    const parsed = parseFloat(text.replace(',', '.').replace(/[^0-9.]/g, ''));
    updatePrice(parsed);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleDecrement}
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

      <TouchableOpacity onPress={handleIncrement} style={styles.button}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
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