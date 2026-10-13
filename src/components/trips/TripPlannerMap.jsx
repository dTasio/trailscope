import { useEffect, useRef } from "react";

import { Map, Marker, NavigationControl } from "maplibre-gl";

import "maplibre-gl/dist/maplibre-gl.css";

function TripPlannerMap({ destination }) {
  const mapContainer = useRef(null);

  const mapRef = useRef(null);

  const markerRef = useRef(null);

  // Crea el mapa una única vez.
  useEffect(() => {
    if (!mapContainer.current) {
      return;
    }

    const map = new Map({
      container: mapContainer.current,

      style: "https://tiles.openfreemap.org/styles/liberty",

      center: [-3.7, 40.4],

      zoom: 5,
    });

    map.addControl(new NavigationControl(), "top-right");

    mapRef.current = map;

    return () => {
      map.remove();

      mapRef.current = null;
    };
  }, []);

  // Mueve el mapa cuando
  // cambia el destino.
  useEffect(() => {
    const map = mapRef.current;

    if (!map) {
      return;
    }

    const hasCoordinates = typeof destination?.longitude === "number" && typeof destination?.latitude === "number";

    if (!hasCoordinates) {
      return;
    }

    const center = [destination.longitude, destination.latitude];

    map.flyTo({
      center,
      zoom: 11,
      duration: 900,
    });

    if (markerRef.current) {
      markerRef.current.remove();
    }

    markerRef.current = new Marker({
      color: "#2f5d50",
    })
      .setLngLat(center)
      .addTo(map);
  }, [destination]);

  return <div ref={mapContainer} className="h-105 w-full overflow-hidden rounded-2xl border border-border lg:h-130" />;
}

export default TripPlannerMap;
