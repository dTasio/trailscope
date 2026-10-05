import { useState } from "react";

import ExploreMap from "../components/explore/ExploreMap.jsx";
import TrailResults from "../components/explore/TrailsResults.jsx";
import PlacesResults from "../components/explore/PlacesResults.jsx";

import { getHikingTrails } from "../services/trailsService.js";
import { getNaturalPlaces } from "../services/placesService.js";

// Zoom mínimo para permitir búsquedas en el mapa
const MIN_SEARCH_ZOOM = 9;

function Explore() {
  // --------------------------------------------------
  // ESTADOS
  // --------------------------------------------------

  // Resultados obtenidos de las búsquedas
  const [trails, setTrails] = useState([]);
  const [places, setPlaces] = useState([]);

  // Controlan el estado de las peticiones a las APIs
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Guardan qué ruta o lugar está seleccionado actualmente
  const [selectedTrailId, setSelectedTrailId] = useState(null);
  const [selectedPlaceKey, setSelectedPlaceKey] = useState(null);

  // Contenido que explora el usuario
  const [contentType, setContentType] = useState("trails");

  // --------------------------------------------------
  // CAMBIO DE TIPO DE CONTENIDO
  // --------------------------------------------------

  // Cambia entre rutas y lugares y limpia los resultados
  const handleContentTypeChange = (type) => {
    // Evita borrar los resultados si se pulsa el modo que ya está seleccionado
    if (type === contentType) return;

    setContentType(type);

    setTrails([]);
    setPlaces([]);

    setSelectedTrailId(null);
    setSelectedPlaceKey(null);

    setError(null);
  };

  // --------------------------------------------------
  // BÚSQUEDA EN LA ZONA VISIBLE DEL MAPA
  // --------------------------------------------------

  // Recibe los límites y el zoom desde ExploreMap
  // Según el modo activo, consulta rutas o lugares naturales
  const handleSearchArea = async (bounds, zoom) => {
    // Evita consultas demasiado grandes a Overpass
    if (zoom < MIN_SEARCH_ZOOM) {
      setTrails([]);
      setPlaces([]);

      setSelectedTrailId(null);
      setSelectedPlaceKey(null);

      setIsLoading(false);

      setError("Acércate un poco más en el mapa para buscar en esta zona.");

      return;
    }

    // Limpiamos los resultados y selecciones de la búsqueda anterior
    setTrails([]);
    setPlaces([]);

    // Cada nueva búsqueda elimina la selección anterior
    setSelectedTrailId(null);
    setSelectedPlaceKey(null);

    setIsLoading(true);
    setError(null);

    // Busca rutas o lugares segun el modo
    try {
      if (contentType === "trails") {
        const hikingTrails = await getHikingTrails(bounds);

        setTrails(hikingTrails);
      }

      if (contentType === "places") {
        const naturalPlaces = await getNaturalPlaces(bounds);

        setPlaces(naturalPlaces);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --------------------------------------------------
  // INTERFAZ
  // --------------------------------------------------
  return (
    <main>
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Explorar</p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-text sm:text-4xl">Explora rutas y lugares naturales.</h1>
        </div>

        <div className="mt-5 inline-flex rounded-full border border-border bg-surface p-1">
          <button type="button" onClick={() => handleContentTypeChange("trails")} className={`rounded-full px-5 py-2 text-sm font-semibold transition ${contentType === "trails" ? "bg-primary text-white" : "text-muted hover:text-text"}`}>
            Rutas
          </button>

          <button type="button" onClick={() => handleContentTypeChange("places")} className={`rounded-full px-5 py-2 text-sm font-semibold transition ${contentType === "places" ? "bg-primary text-white" : "text-muted hover:text-text"}`}>
            Lugares
          </button>
        </div>

        <div className="grid overflow-hidden rounded-2xl border border-border bg-surface lg:grid-cols-[380px_1fr]">
          <div className="h-150 overflow-y-auto border-b border-border lg:border-r lg:border-b-0">
            {contentType === "trails" ? (
              <TrailResults trails={trails} isLoading={isLoading} error={error} selectedTrailId={selectedTrailId} onSelectTrail={setSelectedTrailId} />
            ) : (
              <PlacesResults places={places} isLoading={isLoading} error={error} selectedPlaceKey={selectedPlaceKey} onSelectPlace={setSelectedPlaceKey} />
            )}
          </div>

          <ExploreMap
            trails={contentType === "trails" ? trails : []}
            places={contentType === "places" ? places : []}
            selectedTrailId={selectedTrailId}
            selectedPlaceKey={selectedPlaceKey}
            onSearchArea={handleSearchArea}
            onSelectTrail={setSelectedTrailId}
            onSelectPlace={setSelectedPlaceKey}
          />
        </div>
      </section>
    </main>
  );
}

export default Explore;
