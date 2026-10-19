import { Link } from "react-router";

function formatDate(date) {
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function TripCard({ trip, onDelete }) {
  const trailsCount = trip.trails?.length ?? 0;

  const placesCount = trip.places?.length ?? 0;

  const handleDelete = () => {
    const confirmed = window.confirm(`¿Quieres eliminar "${trip.name}"? Esta acción no se puede deshacer.`);

    if (!confirmed) {
      return;
    }

    onDelete(trip.id);
  };

  return (
    <article className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition hover:-translate-y-1 hover:shadow-md">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">{trip.destination?.name || "Destino por definir"}</p>

        <h3 className="mt-2 text-2xl font-bold tracking-tight text-text">{trip.name}</h3>

        <p className="mt-3 text-sm text-muted">
          {formatDate(trip.startDate)}
          {" → "}
          {formatDate(trip.endDate)}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <span className="rounded-full bg-surface-secondary px-3 py-1.5 text-sm text-muted">
          {trailsCount} {trailsCount === 1 ? "ruta" : "rutas"}
        </span>

        <span className="rounded-full bg-surface-secondary px-3 py-1.5 text-sm text-muted">
          {placesCount} {placesCount === 1 ? "lugar" : "lugares"}
        </span>
      </div>

      <div className="mt-auto flex items-center justify-between gap-4 pt-7">
        <Link to={`/trips/${trip.id}`} className="font-semibold text-primary transition-colors hover:text-primary-dark">
          Ver escapada →
        </Link>

        <button type="button" onClick={handleDelete} className="text-sm font-semibold text-red-700 transition-colors hover:text-red-900" aria-label={`Eliminar ${trip.name}`}>
          Eliminar
        </button>
      </div>
    </article>
  );
}

export default TripCard;
