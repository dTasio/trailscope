function TrailCard({ name, distance, duration }) {
  return (
    <article className="rounded-2xl bg-surface p-5">
      <p className="text-sm font-semibold text-primary">Ruta</p>

      <h3 className="mt-2 text-xl font-bold text-text">{name}</h3>

      <p className="mt-2 text-sm text-muted">
        {distance} · {duration}
      </p>
    </article>
  );
}

export default TrailCard;
