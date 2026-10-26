import { Link } from "react-router";

// Formatea una fecha para mostrarla en español
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
  // Cantidad de rutas y lugares incluidos en la escapada
  const trailsCount = trip.trails?.length ?? 0;
  const placesCount = trip.places?.length ?? 0;

  // Confirma la eliminación antes de solicitarla
  const handleDelete = () => {
    const confirmed = window.confirm(`¿Quieres eliminar "${trip.name}"? Esta acción no se puede deshacer.`);

    if (!confirmed) {
      return;
    }

    onDelete(trip.id);
  };

  return (
    <article className="flex h-full flex-col rounded-2xl border border-[#c7d7cc] bg-[#f7faf8] p-6 transition duration-200 hover:-translate-y-1 hover:border-[#8eae99] hover:shadow-md">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#3f6b53]">{trip.destination?.name || "Destino por definir"}</p>
        <h3 className="mt-2 text-2xl font-bold tracking-tight text-text">{trip.name}</h3>

        <p className="mt-3 text-sm text-muted">
          {formatDate(trip.startDate)}
          {" → "}
          {formatDate(trip.endDate)}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <span className="rounded-full bg-[#dfece2] px-3 py-1.5 text-sm font-medium text-[#365947]">
          {trailsCount} {trailsCount === 1 ? "ruta" : "rutas"}
        </span>

        <span className="rounded-full bg-[#dfece2] px-3 py-1.5 text-sm font-medium text-[#365947]">
          {placesCount} {placesCount === 1 ? "lugar" : "lugares"}
        </span>
      </div>

      <div className="mt-auto flex items-center justify-between gap-4 pt-7">
        <Link to={`/trips/${trip.id}`} className="-mx-2 inline-flex min-h-11 items-center underline px-2 font-semibold text-[#2f654c] transition-colors hover:text-[#193c2d]">
          Ver escapada →
        </Link>

        <button type="button" onClick={handleDelete} className="-mx-2 inline-flex min-h-11 items-center rounded-lg px-2 text-sm font-medium text-[#66776d] transition-colors hover:bg-red-50 hover:text-red-700">
          Eliminar
        </button>
      </div>
    </article>
  );
}

export default TripCard;
