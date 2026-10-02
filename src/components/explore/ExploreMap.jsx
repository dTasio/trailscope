import { useEffect, useRef } from "react";
import { Map, Marker, NavigationControl, setWorkerUrl } from "maplibre-gl";

import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import "maplibre-gl/dist/maplibre-gl.css";

const MIN_SEARCH_ZOOM = 9;

setWorkerUrl(workerUrl);

function ExploreMap({ trails, selectedTrailId, onSearchArea }) {
  //Referencias
  const mapContainer = useRef(null);
  const map = useRef(null);

  const markers = useRef([]);

  //Effects
  // Crea y destruye la instancia principal del mapa
  useEffect(() => {
    if (map.current) return;

    map.current = new Map({
      container: mapContainer.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: [-3.7, 40.4],
      zoom: 5,
    });

    map.current.addControl(new NavigationControl(), "top-right");

    map.current.on("load", () => {
      map.current.addSource("trail-routes", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      map.current.addLayer({
        id: "trail-routes-line",
        type: "line",
        source: "trail-routes",

        layout: {
          "line-cap": "round",
          "line-join": "round",
        },

        paint: {
          "line-color": "#2f5d50",
          "line-width": 3,
          "line-opacity": 0.45,
        },
      });

      map.current.addLayer({
        id: "trail-route-selected",
        type: "line",
        source: "trail-routes",

        filter: ["==", ["get", "id"], -1],

        layout: {
          "line-cap": "round",
          "line-join": "round",
        },

        paint: {
          "line-color": "#c58b55",
          "line-width": 6,
          "line-opacity": 1,
        },
      });
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Actualiza los marcadores cuando cambia el array de rutas
  useEffect(() => {
    if (!map.current) return;

    const newMarkers = trails
      .filter((trail) => trail.center)
      .map((trail) => {
        return new Marker().setLngLat([trail.center.longitude, trail.center.latitude]).addTo(map.current);
      });

    markers.current = newMarkers;

    return () => {
      markers.current.forEach((marker) => marker.remove());
      markers.current = [];
    };
  }, [trails]);

  useEffect(() => {
    if (!map.current) return;

    const source = map.current.getSource("trail-routes");

    if (!source) return;

    const geojson = {
      type: "FeatureCollection",

      features: trails
        .filter((trail) => trail.geometry)
        .map((trail) => ({
          type: "Feature",

          properties: {
            id: trail.id,
            name: trail.name,
          },

          geometry: trail.geometry,
        })),
    };

    source.setData(geojson);
  }, [trails]);

  useEffect(() => {
    if (!map.current) return;

    const selectedLayer = map.current.getLayer("trail-route-selected");

    if (!selectedLayer) return;

    map.current.setFilter("trail-route-selected", ["==", ["get", "id"], selectedTrailId ?? -1]);
  }, [selectedTrailId]);

  //Funciones
  const handleSearchArea = () => {
    if (!map.current) return;

    const bounds = map.current.getBounds();
    const zoom = map.current.getZoom();

    const searchArea = {
      north: bounds.getNorth(),
      south: bounds.getSouth(),
      east: bounds.getEast(),
      west: bounds.getWest(),
    };

    onSearchArea(searchArea, zoom);
  };

  return (
    <div className="relative h-150 w-full">
      <div ref={mapContainer} className="h-full w-full" />

      <button type="button" onClick={handleSearchArea} className="absolute top-4 left-4 z-10 rounded-full bg-surface px-5 py-3 font-semibold text-text shadow-lg transition hover:bg-surface-secondary">
        Buscar en esta zona
      </button>
    </div>
  );
}

export default ExploreMap;
