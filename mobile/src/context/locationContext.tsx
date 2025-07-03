// LocationContext.tsx

import React, { createContext, useState, ReactNode, useContext } from 'react';
import * as Location from 'expo-location';

export type LocationCoords = {
  latitude: number;
  longitude: number;
  name: string;
} | null;

type LocationContextType = {
  originCoords: LocationCoords;
  destinationCoords: LocationCoords;
  setOriginCoords: (loc: LocationCoords) => void;
  setDestinationCoords: (loc: LocationCoords) => void;
  userLocation: () => Promise<void>;
  distance: number | null;
  duration: number | null;
  setDistance: (value: number | null) => void;
  setDuration: (value: number | null) => void;
};

export const LocationContext = createContext({} as LocationContextType);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [originCoords, setOriginCoords] = useState<LocationCoords>(null);
  const [destinationCoords, setDestinationCoords] = useState<LocationCoords>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);

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
      name: 'ma position',
    };

    setOriginCoords(currentLocation);
    console.log('Current location:', currentLocation);
  };

  return (
    <LocationContext.Provider
      value={{
        originCoords,
        setOriginCoords,
        destinationCoords,
        setDestinationCoords,
        userLocation,
        distance,
        duration,
        setDistance,
        setDuration,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
