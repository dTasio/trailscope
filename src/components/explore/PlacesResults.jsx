import { useEffect, useRef } from "react";
import { Link } from "react-router";

function PlacesResults({ places, isLoading, error, selectedPlaceKey, onSelectPlace }) {
  // Guarda una referencia a cada card para poder localizarla cuando el lugar se selecciona desde el mapa
  const placeCardRefs = useRef(new Map());

  // Desplaza el panel hasta la card correspondiente cuando se selecciona un lugar
  useEffect(() => {
    if (selectedPlaceKey === null) return;

    const selectedCard = placeCardRefs.current.get(selectedPlaceKey);

    if (!selectedCard) return;

    selectedCard.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [selectedPlaceKey]);

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-muted">Buscando lugares...</p>
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

  if (places.length === 0) {
    return (
      <div className="p-6">
        <p className="font-semibold text-text">Explora lugares naturales</p>

        <p className="mt-2 text-sm leading-6 text-muted">Muévete por el mapa y pulsa “Buscar en esta zona” para encontrar cascadas, miradores y lagos.</p>
      </div>
    );
  }

  //Funciones
  function getPlaceTypeLabel(type) {
    const labels = {
      waterfall: "Cascada",
      viewpoint: "Mirador",
      lake: "Lago",
    };

    return labels[type] ?? "Lugar natural";
  }

  return (
    <div className="p-6">
      <p className="font-semibold text-text mb-4">{places.length} lugares encontrados</p>

      <div className="flex gap-4 overflow-x-auto px-4 pb-4 snap-x snap-mandatory md:block md:space-y-3 md:overflow-visible md:px-0 md:pb-0">
        {places.map((place) => {
          const isSelected = place.osmKey === selectedPlaceKey;

          return (
            <article
              key={place.osmKey}
              ref={(element) => {
                if (element) {
                  placeCardRefs.current.set(place.osmKey, element);
                } else {
                  placeCardRefs.current.delete(place.osmKey);
                }
              }}
              className={`flex min-h-36 min-w-[85%] snap-start flex-col overflow-hidden rounded-xl border transition md:min-h-0 md:w-full md:min-w-0 ${isSelected ? "border-primary bg-surface-secondary" : "border-border bg-surface"}`}
            >
              <button type="button" aria-pressed={isSelected} onClick={() => onSelectPlace(place.osmKey)} className="flex w-full flex-1 flex-col justify-center p-4 text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary underline">{getPlaceTypeLabel(place.type)}</p>

                <h3 className="mt-2 font-semibold text-text">{place.name}</h3>

                {place.elevation && <p className="mt-2 text-sm text-muted">Altitud: {place.elevation} m</p>}
              </button>

              <div className="border-t border-border px-4 py-1">
                <Link to={`/places/${place.osmKey}`} className="text-sm font-semibold text-primary transition hover:text-primary-dark">
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

export default PlacesResults;
