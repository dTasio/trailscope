import { useState } from "react";
import ExploreMap from "../components/explore/ExploreMap.jsx";
import ExploreResults from "../components/explore/ExploreResults.jsx";
import { getHikingTrails } from "../services/trailsService.js";

function Explore() {
  //States
  const [searchBounds, setSearchBounds] = useState(null);

  const [trails, setTrails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedTrailId, setSelectedTrailId] = useState(null);

  //Funciones
  const handleSearchArea = async (bounds, zoom) => {
    if (zoom < 9) {
      setTrails([]);
      setSelectedTrailId(null);
      setError("Acércate un poco más en el mapa para buscar rutas en esta zona.");
      return;
    }

    setSearchBounds(bounds);
    setSelectedTrailId(null);
    setIsLoading(true);
    setError(null);

    try {
      const hikingTrails = await getHikingTrails(bounds);

      setTrails(hikingTrails);
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

        <div className="grid overflow-hidden rounded-2xl border border-border bg-surface lg:grid-cols-[380px_1fr]">
          <div className="max-h-162.5 overflow-y-auto border-b border-border lg:border-r lg:border-b-0">
            <ExploreResults trails={trails} isLoading={isLoading} error={error} selectedTrailId={selectedTrailId} onSelectTrail={setSelectedTrailId} />
          </div>

          <ExploreMap trails={trails} selectedTrailId={selectedTrailId} onSearchArea={handleSearchArea} />
        </div>
      </section>
    </main>
  );
}

export default Explore;
