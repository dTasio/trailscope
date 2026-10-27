import { useEffect, useRef } from "react";

function NearbyResultsCarousel({ title, items, trails, places, selectedItem, onSelect, onAddTrail, onAddPlace }) {
  // Guarda referencias a las tarjetas para poder desplazarse hasta la seleccionada
  const itemRefs = useRef(new Map());

  // Desplaza el carrusel hasta la tarjeta seleccionada desde el mapa
  useEffect(() => {
    if (!selectedItem) {
      return;
    }

    const selectedKey = selectedItem.resultType === "trail" ? `trail-${selectedItem.id}` : `place-${selectedItem.osmKey}`;

    const selectedCard = itemRefs.current.get(selectedKey);

    selectedCard?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [selectedItem]);

  if (items.length === 0) {
    return null;
  }

  const isSameItem = (item) => {
    if (!selectedItem) {
      return false;
    }

    if (item.resultType !== selectedItem.resultType) {
      return false;
    }

    if (item.resultType === "trail") {
      return String(item.id) === String(selectedItem.id);
    }

    return item.osmKey === selectedItem.osmKey;
  };

  return (
    <section className="min-w-0">
      <div className="flex items-center justify-between gap-4">
        <h4 className="font-semibold text-text">{title}</h4>

        <span className="text-sm text-muted">{items.length}</span>
      </div>

      <div className="mt-3 flex w-full snap-x snap-mandatory gap-3 overflow-x-auto pb-3">
        {items.map((item) => {
          const isTrail = item.resultType === "trail";

          const isAdded = isTrail ? trails.some((trail) => String(trail.id) === String(item.id)) : places.some((place) => place.osmKey === item.osmKey);

          const isSelected = isSameItem(item);

          const itemKey = isTrail ? `trail-${item.id}` : `place-${item.osmKey}`;

          const handleAdd = () => {
            if (isTrail) {
              onAddTrail(item);
              return;
            }

            onAddPlace(item);
          };

          return (
            <article
              key={itemKey}
              ref={(element) => {
                if (element) {
                  itemRefs.current.set(itemKey, element);
                } else {
                  itemRefs.current.delete(itemKey);
                }
              }}
              className={`flex h-24 w-43.75 shrink-0 snap-start flex-col justify-between rounded-xl border bg-surface p-3 transition ${isSelected ? "border-primary shadow-sm" : "border-border hover:border-primary/50"}`}
            >
              <button type="button" onClick={() => onSelect(item)} className="text-left">
                <h5 className="line-clamp-2 text-sm font-semibold leading-5 text-text">{item.name}</h5>
              </button>

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
