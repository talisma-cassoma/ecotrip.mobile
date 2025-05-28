// src/context/LocationContext.tsx
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
//import * as Location from 'expo-location';

export type LocationCoords = {
  latitude: number;
  longitude: number;
 }| null;

type LocationContextType = {
  destinationCoords: LocationCoords;
  originCoords: LocationCoords; 
  setOriginCoords: (loc: LocationCoords) => void;
  setDestinationCoords: (loc: LocationCoords) => void;
  //getLocation: () => Promise<void>;
};

export const LocationContext = createContext<LocationContextType>({
  destinationCoords: null,
  originCoords: null, 
  setOriginCoords: () => {},
  setDestinationCoords: () => {}, 
});

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [originCoords, setOriginCoords] = useState<LocationCoords>(null);
  const [destinationCoords, setDestinationCoords] = useState<LocationCoords>(null);

  return (
    <LocationContext.Provider value={{
      originCoords, 
      setOriginCoords,
      destinationCoords,
      setDestinationCoords,
      //getLocation
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useImageUri must be used within an ImageUriProvider');
  }
  return context;
};