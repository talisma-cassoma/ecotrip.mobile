import React, { useState, useRef, useEffect } from "react";
import MapView from "react-native-maps"
import MapViewDirections, { MapDirectionsResponse } from "react-native-maps-directions";
import { useTrip, LocationCoords } from '../../context/tripContext';
import { getDistance } from "geolib";

interface MockMapDirectionsProps {
    origin: LocationCoords;
    destination: LocationCoords;
    onReady?: (result: MapDirectionsResponse) => void;
    onError?: (error: any) => void;
    strokeWidth?: number;
    strokeColor?: string;
    mode?: string;
}

export const MockMapDirections: React.FC<MockMapDirectionsProps> = ({
    origin,
    destination,
    onReady,
    onError,
}) => {
    useEffect(() => {
        if (!origin || !destination) return;

        try {
            const distanceMeters = getDistance(
                { latitude: origin.latitude, longitude: origin.longitude },
                { latitude: destination.latitude, longitude: destination.longitude }
            );

            const distanceKm = distanceMeters / 1000;
            const durationMinutes = (distanceKm / 50) * 60; // velocidade média 50 km/h
            const coordinates = [origin, destination];

            // simula delay de rede
            setTimeout(() => {
                onReady?.({
                    distance: distanceKm,
                    duration: durationMinutes,
                    coordinates,
                } as unknown as MapDirectionsResponse);
            }, 800);
        } catch (error) {
            onError?.(error);
        }
    }, [origin, destination]);

    return null;
};

export function MapsDirections () {
    const mapRef = useRef<MapView>(null);
    const {
        setDistance,
        setDuration,
        originCoords,
        destinationCoords,
    } = useTrip();

    const [useMapViewDirections, setUseMapViewDirections] = useState(false);

    const hasCoords =
        originCoords?.latitude &&
        originCoords?.longitude &&
        destinationCoords?.latitude &&
        destinationCoords?.longitude;

    return (
        <>
            {useMapViewDirections && hasCoords ? (
                <MapViewDirections
                    mode="DRIVING"
                    key={`route-${originCoords.latitude}-${originCoords.longitude}`}
                    origin={originCoords}
                    destination={destinationCoords}
                    apikey={String(process.env.EXPO_PUBLIC_GOOGLE_MAPS_APIKEY)}
                    strokeWidth={4}
                    strokeColor="#007bc9"
                    onReady={(result) => {
                        setDistance(result.distance);
                        setDuration(result.duration);
                        mapRef.current?.fitToCoordinates(result.coordinates, {
                            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                        });
                    }}
                    onError={(error) => {
                        setDuration(null);
                        setDistance(null);
                        console.warn("Erro ao calcular rota:", error);
                    }}
                />
            ) : (
                hasCoords && (
                    <MockMapDirections
                        mode="DRIVING"
                        origin={originCoords}
                        destination={destinationCoords}
                        onReady={(result) => {
                            setDistance(result.distance);
                            setDuration(result.duration);
                            mapRef.current?.fitToCoordinates(result.coordinates, {
                                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                            });
                        }}
                        onError={(error) => {
                            setDuration(null);
                            setDistance(null);
                            console.warn("Erro ao mockar rota:", error);
                        }}
                    />
                )
            )}
        </>
    );
}
