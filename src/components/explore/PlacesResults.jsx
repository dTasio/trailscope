function PlacesResults({ places, isLoading, error }) {
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
      <p className="font-semibold text-text">{places.length} lugares encontrados</p>

      <div className="mt-5 flex flex-col gap-3">
        {places.map((place) => (
          <article key={`${place.osmType}-${place.id}`} className="rounded-xl border border-border bg-surface p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">{getPlaceTypeLabel(place.type)}</p>

            <h3 className="mt-2 font-semibold text-text">{place.name}</h3>

            {place.elevation && <p className="mt-2 text-sm text-muted">Altitud: {place.elevation} m</p>}
          </article>
        ))}
      </div>
    </div>
  );
}

export default PlacesResults;
