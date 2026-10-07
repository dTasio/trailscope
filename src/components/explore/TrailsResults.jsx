import { useEffect, useRef } from "react";
import { Link } from "react-router";

function TrailsResults({ trails, isLoading, error, selectedTrailId, onSelectTrail }) {
  // Guarda una referencia a cada card para poder localizarla cuando la ruta se selecciona desde el mapa
  const trailCardRefs = useRef(new Map());

  // Desplaza el panel hasta la card correspondiente cuando se selecciona una ruta
  useEffect(() => {
    if (selectedTrailId === null) return;

    const selectedCard = trailCardRefs.current.get(selectedTrailId);

    if (!selectedCard) return;

    selectedCard.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [selectedTrailId]);

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-muted">Buscando rutas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (trails.length === 0) {
    return (
      <div className="p-6">
        <p className="font-semibold text-text">Explora una zona del mapa</p>

        <p className="mt-2 text-sm leading-6 text-muted">Muévete por el mapa y pulsa “Buscar en esta zona” para encontrar rutas de senderismo.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <p className="font-semibold text-text mb-4">{trails.length} rutas encontradas</p>

      <div className="flex gap-4 overflow-x-auto px-4 pb-4 snap-x snap-mandatory md:block md:space-y-3 md:overflow-visible md:px-0 md:pb-0">
        {trails.map((trail) => {
          const isSelected = trail.id === selectedTrailId;

          return (
            <article
              key={trail.id}
              ref={(element) => {
                if (element) {
                  trailCardRefs.current.set(trail.id, element);
                } else {
                  trailCardRefs.current.delete(trail.id);
                }
              }}
              className={`flex min-h-36 min-w-[85%] snap-start flex-col overflow-hidden rounded-xl border transition md:min-h-0 md:w-full md:min-w-0 ${isSelected ? "border-primary bg-surface-secondary" : "border-border bg-surface"}`}
            >
              <button type="button" aria-pressed={isSelected} onClick={() => onSelectTrail(trail.id)} className="flex w-full flex-1 flex-col justify-center p-4 text-left">
                <p className="font-semibold text-text">{trail.name}</p>

                <p className="mt-2 text-sm text-muted">
                  Distancia:{" "}
                  {trail.distance.toLocaleString("es-ES", {
                    maximumFractionDigits: 1,
                  })}{" "}
                  km
                </p>
              </button>

              <div className="border-t border-border px-4 py-1">
                <Link to={`/routes/${trail.id}`} className="text-sm font-semibold text-primary transition hover:text-primary-dark">
                  Ver detalle →
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default TrailsResults;
