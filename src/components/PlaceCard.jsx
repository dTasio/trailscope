function PlaceCard({ name, type, location, altitude }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-surface transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex aspect-4/3 items-center justify-center bg-surface-secondary">
        <span className="text-sm font-medium text-muted">Imagen no disponible</span>
      </div>

      <div className="p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{type}</p>

        <h3 className="mt-3 text-xl font-bold tracking-tight text-text">{name}</h3>

        <p className="mt-2 text-sm text-muted">{location}</p>

        <div className="mt-6 border-t border-border pt-5">
          <p className="text-xs text-muted">Altitud</p>

          <p className="mt-1 font-semibold text-text">{altitude}</p>
        </div>
      </div>
    </article>
  );
}

export default PlaceCard;
