// LocationContext.tsx

import React, { createContext, useState, ReactNode, useContext } from 'react';
import * as Location from 'expo-location';

export type LocationCoords = {
  latitude: number;
  longitude: number;
} | null;

type LocationContextType = {
  originCoords: LocationCoords;
  destinationCoords: LocationCoords;
  setOriginCoords: (loc: LocationCoords) => void;
  setDestinationCoords: (loc: LocationCoords) => void;
  userLocation: () => Promise<void>;
};

export const LocationContext = createContext({} as LocationContextType);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [originCoords, setOriginCoords] = useState<LocationCoords>(null);
  const [destinationCoords, setDestinationCoords] = useState<LocationCoords>(null);

  const userLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    setOriginCoords({ latitude, longitude });
    console.log('Current location:', { latitude, longitude });
  };

  return (
    <LocationContext.Provider
      value={{
        originCoords,
        setOriginCoords,
        destinationCoords,
        setDestinationCoords,
        userLocation,
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
