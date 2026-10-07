import { useEffect, useRef } from "react";

import { Map, Marker, NavigationControl } from "maplibre-gl";

import "maplibre-gl/dist/maplibre-gl.css";

// Colores utilizados también en Explore para cada tipo de lugar
const PLACE_MARKER_COLORS = {
  waterfall: "#3b82f6",
  viewpoint: "#c58b55",
  lake: "#06b6d4",
};

function PlaceMap({ coordinates, type }) {
  // Elemento HTML donde MapLibre crea el mapa
  const mapContainer = useRef(null);

  useEffect(() => {
    if (!mapContainer.current || !coordinates) {
      return;
    }

    const { longitude, latitude } = coordinates;

    // Crea el mapa centrado directamente en el lugar
    const map = new Map({
      container: mapContainer.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: [longitude, latitude],
      zoom: 14,
    });

    // Añade los controles de zoom y orientación
    map.addControl(new NavigationControl(), "top-right");

    // Obtiene el mismo color que utilizamos para este tipo de lugar en Explore.
    const markerColor = PLACE_MARKER_COLORS[type] ?? "#2f5d50";

    // Añade un marker sobre la ubicación del lugar
    new Marker({
      color: markerColor,
      scale: 1.2,
    })
      .setLngLat([longitude, latitude])
      .addTo(map);

    // Elimina la instancia del mapa cuando el componente deja de existir.
    return () => {
      map.remove();
    };
  }, [coordinates, type]);

  return <div ref={mapContainer} className="h-100 w-full overflow-hidden rounded-2xl border border-border sm:h-125" />;
}

export default PlaceMap;
