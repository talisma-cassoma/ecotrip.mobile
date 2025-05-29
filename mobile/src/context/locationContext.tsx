import React, { createContext, useState, ReactNode, useContext } from 'react';

export type LocationCoords = {
  latitude: number;
  longitude: number;
 }| null;

type LocationContextType = {
  originCoords: LocationCoords; 
  destinationCoords: LocationCoords;
  setOriginCoords: (loc: LocationCoords) => void;
  setDestinationCoords: (loc: LocationCoords) => void;
  //getLocation: () => Promise<void>;
};

export const LocationContext = createContext({} as LocationContextType)

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [originCoords, setOriginCoords] = useState<LocationCoords>(null);
  const [destinationCoords, setDestinationCoords] = useState<LocationCoords>(null);

  return (
    <LocationContext.Provider value={{
      originCoords, 
      setOriginCoords,
      destinationCoords,
      setDestinationCoords
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