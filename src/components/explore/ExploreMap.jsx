import { useEffect, useRef } from "react";
import { Map, NavigationControl, setWorkerUrl } from "maplibre-gl";

import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import "maplibre-gl/dist/maplibre-gl.css";

setWorkerUrl(workerUrl);

function ExploreMap({ onSearchArea }) {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return;

    map.current = new Map({
      container: mapContainer.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: [-3.7, 40.4],
      zoom: 5,
    });

    map.current.addControl(new NavigationControl(), "top-right");

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  const handleSearchArea = () => {
    if (!map.current) return;

    const bounds = map.current.getBounds();

    const searchArea = {
      north: bounds.getNorth(),
      south: bounds.getSouth(),
      east: bounds.getEast(),
      west: bounds.getWest(),
    };

    onSearchArea(searchArea);
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
