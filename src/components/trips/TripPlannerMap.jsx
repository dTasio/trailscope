import { useEffect, useRef, useState } from "react";

import { LngLatBounds, Map, Marker, NavigationControl } from "maplibre-gl";

import "maplibre-gl/dist/maplibre-gl.css";

const PLACE_MARKER_COLORS = {
  waterfall: "#3b82f6",
  viewpoint: "#c58b55",
  lake: "#06b6d4",
};

function extendBoundsFromCoordinates(bounds, coordinates) {
  if (!Array.isArray(coordinates)) {
    return;
  }

  const isCoordinate = coordinates.length >= 2 && typeof coordinates[0] === "number" && typeof coordinates[1] === "number";

  if (isCoordinate) {
    bounds.extend([coordinates[0], coordinates[1]]);

    return;
  }

  coordinates.forEach((nestedCoordinates) => {
    extendBoundsFromCoordinates(bounds, nestedCoordinates);
  });
}

function TripPlannerMap({ destination, trails = [], places = [], selectedResult = null, onSelectResult }) {
  const mapContainer = useRef(null);

  const mapRef = useRef(null);

  const destinationMarkerRef = useRef(null);

  const placeMarkersRef = useRef([]);

  const selectedPlaceMarkerRef = useRef(null);

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
       * Todas las rutas visibles.
       */
      map.addSource("trip-trails", {
        type: "geojson",

        data: {
          type: "FeatureCollection",

          features: [],
        },
      });

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

          "line-opacity": 0.65,
        },
      });

      /*
       * Ruta seleccionada.
       */
      map.addSource("selected-trip-trail", {
        type: "geojson",

        data: {
          type: "FeatureCollection",

          features: [],
        },
      });

      map.addLayer({
        id: "selected-trip-trail-line",

        type: "line",

        source: "selected-trip-trail",

        layout: {
          "line-join": "round",

          "line-cap": "round",
        },

        paint: {
          "line-color": "#c58b55",

          "line-width": 7,

          "line-opacity": 1,
        },
      });

      setIsMapReady(true);
    });

    mapRef.current = map;

    return () => {
      placeMarkersRef.current.forEach((marker) => marker.remove());

      placeMarkersRef.current = [];

      selectedPlaceMarkerRef.current?.remove();

      destinationMarkerRef.current?.remove();

      map.remove();

      mapRef.current = null;
    };
  }, []);

  /*
   * Destino de la escapada.
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

    destinationMarkerRef.current?.remove();

    destinationMarkerRef.current = new Marker({
      color: "#2f5d50",
      scale: 1.1,
    })
      .setLngLat(center)
      .addTo(map);
  }, [destination, isMapReady]);

  /*
   * Rutas visibles.
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
   * Lugares visibles.
   */
  useEffect(() => {
    const map = mapRef.current;

    if (!map || !isMapReady) {
      return;
    }

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

        scale: 0.85,
      })
        .setLngLat([longitude, latitude])
        .addTo(map);

      const markerElement = marker.getElement();

      markerElement.style.cursor = "pointer";

      markerElement.addEventListener("click", (event) => {
        event.stopPropagation();

        onSelectResult?.({
          ...place,
          resultType: "place",
        });
      });

      placeMarkersRef.current.push(marker);
    });
  }, [places, isMapReady, onSelectResult]);

  /*
   * Clic sobre una ruta.
   */
  useEffect(() => {
    const map = mapRef.current;

    if (!map || !isMapReady) {
      return;
    }

    const handleTrailClick = (event) => {
      const clickedFeature = event.features?.[0];

      const trailId = clickedFeature?.properties?.id;

      if (trailId === undefined || trailId === null) {
        return;
      }

      const trail = trails.find((item) => String(item.id) === String(trailId));

      if (!trail) {
        return;
      }

      onSelectResult?.({
        ...trail,
        resultType: "trail",
      });
    };

    const handleMouseEnter = () => {
      map.getCanvas().style.cursor = "pointer";
    };

    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = "";
    };

    map.on("click", "trip-trails-line", handleTrailClick);

    map.on("mouseenter", "trip-trails-line", handleMouseEnter);

    map.on("mouseleave", "trip-trails-line", handleMouseLeave);

    return () => {
      map.off("click", "trip-trails-line", handleTrailClick);

      map.off("mouseenter", "trip-trails-line", handleMouseEnter);

      map.off("mouseleave", "trip-trails-line", handleMouseLeave);
    };
  }, [trails, isMapReady, onSelectResult]);

  /*
   * Resultado seleccionado.
   */
  useEffect(() => {
    const map = mapRef.current;

    if (!map || !isMapReady) {
      return;
    }

    const selectedTrailSource = map.getSource("selected-trip-trail");

    /*
     * Limpiar selección anterior.
     */
    if (selectedTrailSource) {
      selectedTrailSource.setData({
        type: "FeatureCollection",

        features: [],
      });
    }

    selectedPlaceMarkerRef.current?.remove();

    selectedPlaceMarkerRef.current = null;

    if (!selectedResult) {
      return;
    }

    /*
     * Lugar seleccionado.
     */
    if (selectedResult.resultType === "place") {
      const longitude = selectedResult.coordinates?.longitude;

      const latitude = selectedResult.coordinates?.latitude;

      if (typeof longitude !== "number" || typeof latitude !== "number") {
        return;
      }

      map.flyTo({
        center: [longitude, latitude],

        zoom: 14,

        duration: 700,
      });

      selectedPlaceMarkerRef.current = new Marker({
        color: "#c58b55",
        scale: 1.25,
      })
        .setLngLat([longitude, latitude])
        .addTo(map);

      return;
    }

    /*
     * Ruta seleccionada.
     */
    if (selectedResult.resultType === "trail" && selectedResult.geometry && selectedTrailSource) {
      selectedTrailSource.setData({
        type: "Feature",

        properties: {
          id: selectedResult.id,

          name: selectedResult.name,
        },

        geometry: selectedResult.geometry,
      });

      const bounds = new LngLatBounds();

      extendBoundsFromCoordinates(bounds, selectedResult.geometry.coordinates);

      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, {
          padding: 70,
          maxZoom: 14,
          duration: 700,
        });
      }
    }
  }, [selectedResult, isMapReady]);

  return <div ref={mapContainer} className="h-105 w-full overflow-hidden rounded-2xl border border-border lg:h-130" />;
}

export default TripPlannerMap;
