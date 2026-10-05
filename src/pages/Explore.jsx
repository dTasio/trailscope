import { useState } from "react";
import ExploreMap from "../components/explore/ExploreMap.jsx";
import ExploreResults from "../components/explore/ExploreResults.jsx";
import { getHikingTrails } from "../services/trailsService.js";
import { getNaturalPlaces } from "../services/placesService.js";
import PlacesResults from "../components/explore/PlacesResults.jsx";

function Explore() {
  //States
  const [searchBounds, setSearchBounds] = useState(null);

  const [trails, setTrails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [places, setPlaces] = useState([]);

  const [selectedTrailId, setSelectedTrailId] = useState(null);

  const [contentType, setContentType] = useState("trails");

  //Funciones
  const handleContentTypeChange = (type) => {
    setContentType(type);

    setTrails([]);
    setPlaces([]);

    setSelectedTrailId(null);
    setError(null);
  };

  const handleSearchArea = async (bounds, zoom) => {
    if (zoom < 9) {
      setTrails([]);
      setPlaces([]);
      setSelectedTrailId(null);

      setError("Acércate un poco más en el mapa para buscar en esta zona.");

      return;
    }

    setSearchBounds(bounds);
    setSelectedTrailId(null);

    setIsLoading(true);
    setError(null);

    try {
      if (contentType === "trails") {
        const hikingTrails = await getHikingTrails(bounds);

        setTrails(hikingTrails);
        setPlaces([]);
      }

      if (contentType === "places") {
        const naturalPlaces = await getNaturalPlaces(bounds);

        setPlaces(naturalPlaces);
        setTrails([]);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

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
          <div className="max-h-162.5 overflow-y-auto border-b border-border lg:border-r lg:border-b-0">
            {contentType === "trails" ? <ExploreResults trails={trails} isLoading={isLoading} error={error} selectedTrailId={selectedTrailId} onSelectTrail={setSelectedTrailId} /> : <PlacesResults places={places} isLoading={isLoading} error={error} />}
          </div>

          <ExploreMap trails={contentType === "trails" ? trails : []} places={contentType === "places" ? places : []} selectedTrailId={selectedTrailId} onSearchArea={handleSearchArea} onSelectTrail={setSelectedTrailId} />
        </div>
      </section>
    </main>
  );
}

export default Explore;
