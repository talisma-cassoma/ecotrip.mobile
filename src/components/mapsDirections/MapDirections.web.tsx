import { useEffect, useState } from "react";

import { decode, encode, LatLngTuple } from "@googlemaps/polyline-codec";

type Props = {
  origin: { latitude: number; longitude: number };
  destination: { latitude: number; longitude: number };
  apikey: string;
};

const decodePolyline = (encoded: string) => {
  return decode(encoded);
};


export default function MapDirections({ origin, destination, apikey }: Props) {
  const [coords, setCoords] = useState<LatLngTuple[]>([]);

  useEffect(() => {
    const fetchDirections = async () => {
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${apikey}`;

      const res = await fetch(url);
      const data = await res.json();

      const points = data.routes[0].overview_polyline.points;

      // decode polyline (podes usar lib "polyline")
      const decoded = decodePolyline(points);

      setCoords(decoded);
    };

    fetchDirections();
  }, []);

  return coords;
}
