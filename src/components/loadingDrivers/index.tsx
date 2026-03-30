import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { colors } from '@/styles/colors';

export default function LoadingDrivers() {
  const fullText = 'Aguardando motoristas...';
  const [displayedText, setDisplayedText] = useState('');

  const progress = useRef(new Animated.Value(0)).current; // barra animada

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      index++;

      setDisplayedText(fullText.slice(0, index));

      // animação da barra proporcional
      Animated.timing(progress, {
        toValue: index / fullText.length,
        duration: 70, // mais curto que o intervalo para suavidade
        useNativeDriver: false,
      }).start();

      if (index === fullText.length) {
        setTimeout(() => {
          index = 0;
          setDisplayedText('');
          Animated.timing(progress, {
            toValue: 0,
            duration: 120,
            useNativeDriver: false,
          }).start();
        }, 700);
      }
    }, 80);

    return () => clearInterval(interval);
  }, []);

  const widthInterpolated = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
  <View
    style={{
      width: 240, // 
      borderRadius: 12,
      overflow: 'hidden',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    <Text style={{ padding: 20, fontSize: 16 }}>
      {displayedText}
    </Text>

    {/* trilho da barra */}
    <View
      style={{
        width: '100%',
        height: 20,
        backgroundColor: '#eee',
        borderRadius: 10,
        overflow: 'hidden',
      }}
    >
      {/* barra animada */}
      <Animated.View
        style={{
          height: '100%',
          width: widthInterpolated, // 
          backgroundColor: colors.gray[200],
        }}
      />
    </View>
  </View>
);
}