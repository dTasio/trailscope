import { useState } from "react";
import ExploreMap from "../components/explore/ExploreMap.jsx";
import { getHikingTrails } from "../services/trailsService.js";

function Explore() {
  //States
  const [searchBounds, setSearchBounds] = useState(null);

  const [trails, setTrails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  //Funciones
  const handleSearchArea = async (bounds) => {
    setSearchBounds(bounds);
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

        <div className="overflow-hidden rounded-2xl border border-border">
          <ExploreMap onSearchArea={handleSearchArea} />
        </div>

        {isLoading && <p className="mt-6 text-muted">Buscando rutas...</p>}

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {!isLoading && !error && trails.length > 0 && (
          <div className="mt-6">
            <p className="font-semibold text-text">{trails.length} rutas encontradas</p>

            <div className="mt-4 flex flex-col gap-3">
              {trails.map((trail) => (
                <div key={trail.id} className="rounded-xl border border-border bg-surface p-4">
                  <p className="font-semibold text-text">{trail.name}</p>

                  {trail.distance && <p className="mt-1 text-sm text-muted">Distancia: {trail.distance}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default Explore;
