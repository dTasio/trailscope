import { useEffect, useRef } from "react";

function ExploreResults({ trails, isLoading, error, selectedTrailId, onSelectTrail }) {
  const trailRefs = useRef(new Map());

  //Effects
  useEffect(() => {
    if (selectedTrailId === null) return;

    const selectedCard = trailRefs.current.get(selectedTrailId);

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
      <p className="font-semibold text-text">{trails.length} rutas encontradas</p>

      <div className="mt-5 flex flex-col gap-3">
        {trails.map((trail) => {
          const isSelected = trail.id === selectedTrailId;

          return (
            <button
              key={trail.id}
              ref={(element) => {
                if (element) {
                  trailRefs.current.set(trail.id, element);
                } else {
                  trailRefs.current.delete(trail.id);
                }
              }}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelectTrail(trail.id)}
              className={`w-full rounded-xl border p-4 text-left transition ${isSelected ? "border-primary bg-surface-secondary" : "border-border bg-surface hover:border-primary"}`}
            >
              <p className="font-semibold text-text">{trail.name}</p>

              <p className="mt-2 text-sm text-muted">
                Distancia:{" "}
                {trail.distance.toLocaleString("es-ES", {
                  maximumFractionDigits: 1,
                })}{" "}
                km
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ExploreResults;
