import { useEffect, useRef } from "react";
import { Map, Marker, NavigationControl, setWorkerUrl, LngLatBounds } from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import "maplibre-gl/dist/maplibre-gl.css";

// Configura el worker que MapLibre necesita para funcionar con Vite
setWorkerUrl(workerUrl);

// Colores para diferenciar los tipos de lugares en el mapa
const PLACE_MARKER_COLORS = {
  waterfall: "#3b82f6",
  viewpoint: "#c58b55",
  lake: "#06b6d4",
};

function ExploreMap({ trails, places, selectedTrailId, selectedPlaceKey, onSearchArea, onSelectTrail, onSelectPlace }) {
  // --------------------------------------------------
  // REFERENCIAS
  // --------------------------------------------------
  const mapContainer = useRef(null); //Contenedor donde se dibuja el mapa
  const map = useRef(null); //Instancia de MapLibre entre renders

  const trailMarkers = useRef([]);
  const placeMarkers = useRef([]);

  // --------------------------------------------------
  // CREACIÓN DEL MAPA
  // --------------------------------------------------

  // Crea y destruye la instancia principal del mapa
  useEffect(() => {
    if (map.current) return;

    map.current = new Map({
      container: mapContainer.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: [-3.7, 40.4],
      zoom: 5,
    });

    //Controles de zoom y navegacion
    map.current.addControl(new NavigationControl(), "top-right");

    // Source GeoJSON donde almacenamos las rutas encontradas
    map.current.on("load", () => {
      map.current.addSource("trail-routes", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      // Capa visual de las rutas normales
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

      // Capa invisible que facilita el clic
      map.current.addLayer({
        id: "trail-routes-hitbox",
        type: "line",
        source: "trail-routes",

        layout: {
          "line-cap": "round",
          "line-join": "round",
        },

        paint: {
          "line-color": "#000000",
          "line-width": 14,
          "line-opacity": 0,
        },
      });

      // Capa visual de la ruta seleccionada
      map.current.addLayer({
        id: "trail-route-selected",
        type: "line",
        source: "trail-routes",

        // Inicialmente no coincide con ninguna ruta
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

    // Cleanup: destruye el mapa cuando se desmonta el componente
    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // --------------------------------------------------
  // MARKERS DE LAS RUTAS
  // --------------------------------------------------

  // Crea un marker en el centro de cada ruta cada vez que cambia el array de trails
  useEffect(() => {
    if (!map.current) return;

    const newMarkers = trails
      .filter((trail) => trail.center)
      .map((trail) => {
        return new Marker().setLngLat([trail.center.longitude, trail.center.latitude]).addTo(map.current);
      });

    trailMarkers.current = newMarkers;

    // Elimina los markers anteriores
    return () => {
      trailMarkers.current.forEach((marker) => marker.remove());
      trailMarkers.current = [];
    };
  }, [trails]);

  // --------------------------------------------------
  // GEOMETRÍA DE LAS RUTAS
  // --------------------------------------------------

  // Convierte las rutas de React a GeoJSON y actualiza la source que utiliza MapLibre para dibujarlas
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

    // Sustituye los datos anteriores por las nuevas rutas
    source.setData(geojson);
  }, [trails]);

  // --------------------------------------------------
  // RUTA SELECCIONADA
  // --------------------------------------------------

  // Actualiza el filtro de MapLibre para destacar solamente la ruta que está seleccionada
  useEffect(() => {
    if (!map.current) return;

    const selectedLayer = map.current.getLayer("trail-route-selected");

    if (!selectedLayer) return;

    map.current.setFilter("trail-route-selected", ["==", ["get", "id"], selectedTrailId ?? -1]);
  }, [selectedTrailId]);

  // --------------------------------------------------
  // INTERACCIÓN CON LAS RUTAS DEL MAPA
  // --------------------------------------------------

  // Permite seleccionar una ruta haciendo clic directamente sobre su recorrido y cambia el cursor al pasar por encima
  useEffect(() => {
    if (!map.current) return;

    const handleMouseEnter = () => {
      map.current.getCanvas().style.cursor = "pointer";
    };

    const handleMouseLeave = () => {
      map.current.getCanvas().style.cursor = "";
    };

    const handleTrailClick = (event) => {
      // Obtiene la ruta GeoJSON situada bajo el cursor
      const feature = event.features?.[0];

      if (!feature) return;

      const trailId = feature.properties?.id;

      if (trailId == null) return;

      // Comunica a Explore qué ruta ha sido seleccionada
      onSelectTrail(Number(trailId));
    };

    // Eventos sobre la capa invisible de interacción
    map.current.on("click", "trail-routes-hitbox", handleTrailClick);
    map.current.on("mouseenter", "trail-routes-hitbox", handleMouseEnter);
    map.current.on("mouseleave", "trail-routes-hitbox", handleMouseLeave);

    // Cleanup: elimina los listeners anteriores
    return () => {
      map.current?.off("click", "trail-routes-hitbox", handleTrailClick);
      map.current?.off("mouseenter", "trail-routes-hitbox", handleMouseEnter);
      map.current?.off("mouseleave", "trail-routes-hitbox", handleMouseLeave);
    };
  }, [onSelectTrail]);

  // --------------------------------------------------
  // ENCUADRE AUTOMÁTICO DE LA RUTA
  // --------------------------------------------------

  // Cuando cambia la ruta seleccionada, calcula sus límites y ajusta automáticamente el mapa para mostrarla completa
  useEffect(() => {
    if (!map.current || selectedTrailId === null) return;

    // Busca el objeto completo de la ruta seleccionada
    const selectedTrail = trails.find((trail) => trail.id === selectedTrailId);

    if (!selectedTrail?.geometry) return;

    // Objeto donde acumulamos los límites geográficos
    const bounds = new LngLatBounds();

    // Añade todas las coordenadas de la ruta a los bounds
    selectedTrail.geometry.coordinates.flat().forEach((coordinate) => {
      bounds.extend(coordinate);
    });

    if (bounds.isEmpty()) return;

    // Centra y ajusta el zoom para mostrar toda la ruta
    map.current.fitBounds(bounds, {
      padding: 80,
      duration: 800,
      maxZoom: 14,
    });
  }, [selectedTrailId, trails]);

  // --------------------------------------------------
  // MARKERS DE LUGARES NATURALES
  // --------------------------------------------------

  // Crea los markers de lugares cada vez que cambia el array de places
  // Asigna su color, destaca el lugar seleccionado, permite seleccionarlos con clic y elimina los markers anteriores.
  useEffect(() => {
    if (!map.current) return;

    const newPlaceMarkers = places
      .filter((place) => place.coordinates)
      .map((place) => {
        const markerColor = getPlaceMarkerColor(place.type);

        const isSelected = place.osmKey === selectedPlaceKey;

        const marker = new Marker({
          color: markerColor,
          scale: isSelected ? 1.45 : 1,
        })
          .setLngLat([place.coordinates.longitude, place.coordinates.latitude])
          .addTo(map.current);

        const markerElement = marker.getElement();

        if (isSelected) {
          markerElement.style.filter = "drop-shadow(0 0 8px rgba(23, 32, 28, 0.85))";

          markerElement.style.zIndex = "10";
        } else {
          markerElement.style.filter = "";
          markerElement.style.zIndex = "";
        }

        markerElement.style.cursor = "pointer";

        markerElement.addEventListener("click", () => {
          onSelectPlace(place.osmKey);
        });

        return marker;
      });

    placeMarkers.current = newPlaceMarkers;

    return () => {
      placeMarkers.current.forEach((marker) => marker.remove());

      placeMarkers.current = [];
    };
  }, [places, selectedPlaceKey, onSelectPlace]);

  // --------------------------------------------------
  // ENCUADRE DEL LUGAR SELECCIONADO
  // --------------------------------------------------

  // Centra y acerca el mapa al lugar seleccionado cuando cambia la selección
  useEffect(() => {
    if (!map.current || selectedPlaceKey === null) {
      return;
    }

    const selectedPlace = places.find((place) => place.osmKey === selectedPlaceKey);

    if (!selectedPlace?.coordinates) return;

    const currentZoom = map.current.getZoom();

    const targetZoom = Math.max(currentZoom, 14);

    map.current.flyTo({
      center: [selectedPlace.coordinates.longitude, selectedPlace.coordinates.latitude],
      zoom: targetZoom,
      duration: 800,
    });
  }, [selectedPlaceKey, places]);

  // --------------------------------------------------
  // FUNCIONES
  // --------------------------------------------------

  // Obtiene la zona visible y el zoom actual del mapa y los envía a Explore para realizar la búsqueda
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

  // Devuelve el color correspondiente a cada tipo de lugar
  function getPlaceMarkerColor(type) {
    return PLACE_MARKER_COLORS[type] ?? "#2f5d50";
  }

  // --------------------------------------------------
  // INTERFAZ REACT SOBRE EL MAPA
  // --------------------------------------------------

  return (
    <div className="relative h-[60vh] min-h-105 w-full md:h-150">
      <div ref={mapContainer} className="h-full w-full" />

      <button type="button" onClick={handleSearchArea} className="absolute top-4 left-4 z-10 rounded-full bg-surface px-5 py-3 font-semibold text-text shadow-lg transition hover:bg-surface-secondary">
        Buscar en esta zona
      </button>

      {places.length > 0 && (
        <div className="absolute bottom-4 left-4 z-10 rounded-xl border border-border bg-surface/95 p-4 shadow-lg">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Lugares</p>

          <div className="flex flex-col gap-2 text-sm text-text">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-blue-500" />
              Cascadas
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-amber-600" />
              Miradores
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-cyan-500" />
              Lagos
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExploreMap;
