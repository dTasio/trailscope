import { useEffect, useRef } from "react";

import { LngLatBounds, Map, NavigationControl } from "maplibre-gl";

import "maplibre-gl/dist/maplibre-gl.css";

function RouteMap({ geometry }) {
  // Referencia al elemento HTML donde MapLibre creará el mapa.
  const mapContainer = useRef(null);

  useEffect(() => {
    if (!mapContainer.current || !geometry) {
      return;
    }

    // Convierte la geometría de la ruta en una Feature GeoJSON
    // que MapLibre puede utilizar como fuente de datos.
    const routeGeoJSON = {
      type: "Feature",
      properties: {},
      geometry,
    };

    // Crea el mapa.
    const map = new Map({
      container: mapContainer.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: [-3.7, 40.4],
      zoom: 5,
    });

    // Controles de zoom y orientación.
    map.addControl(new NavigationControl(), "top-right");

    map.on("load", () => {
      // Añade la geometría de la ruta como fuente GeoJSON.
      map.addSource("route", {
        type: "geojson",
        data: routeGeoJSON,
      });

      // Dibuja la ruta sobre el mapa.
      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        paint: {
          "line-color": "#2f5d50",
          "line-width": 5,
          "line-opacity": 0.9,
        },
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
      });

      // Calcula los límites completos de la ruta.
      const bounds = new LngLatBounds();

      geometry.coordinates.flat().forEach(([longitude, latitude]) => {
        bounds.extend([longitude, latitude]);
      });

      // Ajusta automáticamente el mapa para mostrar
      // todo el recorrido de la ruta.
      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, {
          padding: 60,
          maxZoom: 14,
          duration: 0,
        });
      }
    });

    // Elimina la instancia del mapa cuando
    // el componente deja de existir.
    return () => {
      map.remove();
    };
  }, [geometry]);

  return <div ref={mapContainer} className="h-100 w-full overflow-hidden rounded-2xl border border-border sm:h-125" />;
}

export default RouteMap;
