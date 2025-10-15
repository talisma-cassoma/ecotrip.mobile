// TripContext.tsx
import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import * as Location from 'expo-location';

export type LocationCoords = {
  latitude: number;
  longitude: number;
  name?: string;
} | null;

type TripContextType = {
  originCoords: LocationCoords;
  destinationCoords: LocationCoords;
  setOriginCoords: (loc: LocationCoords) => void;
  setDestinationCoords: (loc: LocationCoords) => void;
  userLocation: () => Promise<void>;
  distance: number | null;
  duration: number | null;
  price: number | null;
  setDistance: (value: number | null) => void;
  setDuration: (value: number | null) => void;
  setPrice: (value: number | null) => void;
};

export const TripContext = createContext({} as TripContextType);

export const TripProvider = ({ children }: { children: ReactNode }) => {
  const [originCoords, setOriginCoords] = useState<LocationCoords>(null);
  const [destinationCoords, setDestinationCoords] = useState<LocationCoords>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);

  const userLocation = async () => {
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
    console.log('Current location:', currentLocation);
  };

useEffect(() => {
  const Po = 400;
  const Do = 1.5; // km
  const Cd = 150;

  if (distance) {
    const rawPrice = Po + Math.max(0, (distance - Do) * Cd);

    // para múltiplo de 25 mais próximo para cima
    const roundedPrice = Math.ceil(rawPrice / 25) * 25;

    setPrice(roundedPrice);
  }
}, [distance]);


  return (
    <TripContext.Provider
      value={{
        originCoords,
        setOriginCoords,
        destinationCoords,
        setDestinationCoords,
        userLocation,
        distance,
        duration,
        price,
        setDistance,
        setDuration,
        setPrice
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};
