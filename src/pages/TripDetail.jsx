import { Link, useParams } from "react-router";

import { getTripById } from "../services/tripsService.js";

function TripDetail() {
  const { id } = useParams();

  const trip = getTripById(id);

  if (!trip) {
    return (
      <main>
        <section className="mx-auto max-w-7xl px-6 py-16">
          <h1 className="text-3xl font-bold text-text">Escapada no encontrada</h1>

          <Link to="/trips" className="mt-6 inline-flex font-semibold text-primary">
            ← Volver a escapadas
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="mx-auto max-w-7xl px-6 py-10">
        <Link to="/trips" className="text-sm font-semibold text-primary transition-colors hover:text-primary-dark">
          ← Volver a escapadas
        </Link>

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{trip.destination.name}</p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-text sm:text-5xl">{trip.name}</h1>

          <p className="mt-4 text-lg text-muted">
            {trip.startDate}
            {" → "}
            {trip.endDate}
          </p>
        </div>

        <div className="mt-12 rounded-3xl border border-border bg-surface p-8">
          <p className="font-semibold text-text">Planificador de escapada</p>

          <p className="mt-3 max-w-2xl leading-7 text-muted">Aquí construiremos el mapa, las rutas y lugares seleccionados, la meteorología y las notas de esta escapada.</p>
        </div>
      </section>
    </main>
  );
}

export default TripDetail;
