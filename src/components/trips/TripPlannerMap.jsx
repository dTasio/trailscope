import { useEffect, useRef, useState } from "react";

import { Map, Marker, NavigationControl } from "maplibre-gl";

import "maplibre-gl/dist/maplibre-gl.css";

const PLACE_MARKER_COLORS = {
  waterfall: "#3b82f6",
  viewpoint: "#c58b55",
  lake: "#06b6d4",
};

function TripPlannerMap({ destination, trails = [], places = [] }) {
  const mapContainer = useRef(null);

  const mapRef = useRef(null);

  const destinationMarkerRef = useRef(null);

  const placeMarkersRef = useRef([]);

  const [isMapReady, setIsMapReady] = useState(false);

  /*
   * Crear mapa una sola vez.
   */
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

    map.on("load", () => {
      /*
       * Fuente inicialmente vacía
       * para las rutas encontradas.
       */
      map.addSource("trip-trails", {
        type: "geojson",

        data: {
          type: "FeatureCollection",

          features: [],
        },
      });

      /*
       * Capa visual de rutas.
       */
      map.addLayer({
        id: "trip-trails-line",

        type: "line",

        source: "trip-trails",

        layout: {
          "line-join": "round",

          "line-cap": "round",
        },

        paint: {
          "line-color": "#2f5d50",

          "line-width": 4,

          "line-opacity": 0.85,
        },
      });

      setIsMapReady(true);
    });

    mapRef.current = map;

    return () => {
      placeMarkersRef.current.forEach((marker) => marker.remove());

      placeMarkersRef.current = [];

      destinationMarkerRef.current?.remove();

      map.remove();

      mapRef.current = null;
    };
  }, []);

  /*
   * Destino seleccionado.
   */
  useEffect(() => {
    const map = mapRef.current;

    if (!map || !isMapReady) {
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

    if (destinationMarkerRef.current) {
      destinationMarkerRef.current.remove();
    }

    destinationMarkerRef.current = new Marker({
      color: "#2f5d50",
      scale: 1.1,
    })
      .setLngLat(center)
      .addTo(map);
  }, [destination, isMapReady]);

  /*
   * Dibujar rutas encontradas.
   */
  useEffect(() => {
    const map = mapRef.current;

    if (!map || !isMapReady) {
      return;
    }

    const source = map.getSource("trip-trails");

    if (!source) {
      return;
    }

    const features = trails
      .filter((trail) => trail.geometry)
      .map((trail) => ({
        type: "Feature",

        properties: {
          id: trail.id,
          name: trail.name,
        },

        geometry: trail.geometry,
      }));

    source.setData({
      type: "FeatureCollection",

      features,
    });
  }, [trails, isMapReady]);

  /*
   * Dibujar lugares encontrados.
   */
  useEffect(() => {
    const map = mapRef.current;

    if (!map || !isMapReady) {
      return;
    }

    /*
     * Quitamos los markers antiguos
     * antes de pintar los nuevos.
     */
    placeMarkersRef.current.forEach((marker) => marker.remove());

    placeMarkersRef.current = [];

    places.forEach((place) => {
      const longitude = place.coordinates?.longitude;

      const latitude = place.coordinates?.latitude;

      if (typeof longitude !== "number" || typeof latitude !== "number") {
        return;
      }

      const markerColor = PLACE_MARKER_COLORS[place.type] ?? "#877bc6";

      const marker = new Marker({
        color: markerColor,

        scale: 0.9,
      })
        .setLngLat([longitude, latitude])
        .addTo(map);

      placeMarkersRef.current.push(marker);
    });
  }, [places, isMapReady]);

  return <div ref={mapContainer} className="h-105 w-full overflow-hidden rounded-2xl border border-border lg:h-130" />;
}

export default TripPlannerMap;
