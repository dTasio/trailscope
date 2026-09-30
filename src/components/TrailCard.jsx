function TrailCard({ name, location, distance, duration, difficulty, image }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-surface transition hover:-translate-y-1 hover:shadow-lg">
      {image ? (
        <div className="aspect-4/3 overflow-hidden">
          <img src={image} alt={`Paisaje de ${name}`} className="h-full w-full object-cover" />
        </div>
      ) : (
        <div className="flex aspect-4/3 items-center justify-center bg-surface-secondary">
          <span className="text-sm font-medium text-muted">Imagen no disponible</span>
        </div>
      )}

      <div className="p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Ruta</p>

        <h3 className="mt-3 text-xl font-bold tracking-tight text-text">{name}</h3>

        <p className="mt-2 text-sm text-muted">{location}</p>

        <div className="mt-6 border-t border-border pt-5">
          <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm">
            <div>
              <p className="text-xs text-muted">Distancia</p>
              <p className="mt-1 font-semibold text-text">{distance}</p>
            </div>

            <div>
              <p className="text-xs text-muted">Duración</p>
              <p className="mt-1 font-semibold text-text">{duration}</p>
            </div>

            <div>
              <p className="text-xs text-muted">Dificultad</p>
              <p className="mt-1 font-semibold text-text">{difficulty}</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default TrailCard;
