function NearbyResultsCarousel({ title, items, trails, places, onAddTrail, onAddPlace }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="min-w-0">
      <div className="flex items-center justify-between gap-4">
        <h4 className="font-semibold text-text">{title}</h4>

        <span className="text-sm text-muted">{items.length} busquedas</span>
      </div>

      <div className="mt-3 flex w-full snap-x snap-mandatory gap-3 overflow-x-auto pb-3">
        {items.map((item) => {
          const isTrail = item.resultType === "trail";

          const isAdded = isTrail ? trails.some((trail) => trail.id === item.id) : places.some((place) => place.osmKey === item.osmKey);

          const itemKey = isTrail ? `trail-${item.id}` : `place-${item.osmKey}`;

          const handleAdd = () => {
            if (isTrail) {
              onAddTrail(item);
              return;
            }

            onAddPlace(item);
          };

          return (
            <article key={itemKey} className="flex h-24 w-43.75 shrink-0 snap-start flex-col justify-between rounded-xl border border-border bg-surface p-3">
              <h5 className="line-clamp-2 text-sm font-semibold leading-5 text-text">{item.name}</h5>

              <button type="button" disabled={isAdded} onClick={handleAdd} className="text-left text-xs font-semibold text-primary transition-colors hover:text-primary-dark disabled:cursor-default disabled:text-muted">
                {isAdded ? "✓ Añadido" : isTrail ? "+ Añadir ruta" : "+ Añadir lugar"}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default NearbyResultsCarousel;
