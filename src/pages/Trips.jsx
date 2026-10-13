import { useEffect, useState } from "react";

import NewTripModal from "../components/trips/NewTripModal.jsx";
import TripCard from "../components/trips/TripCard.jsx";

import { createTrip, getTrips, deleteTrip } from "../services/tripsService.js";

function Trips() {
  const [trips, setTrips] = useState(() => getTrips());

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");

  const handleCreateTrip = (tripData) => {
    const newTrip = createTrip(tripData);

    setTrips((currentTrips) => [...currentTrips, newTrip]);

    setSuccessMessage("Escapada creada correctamente.");
  };

  const handleDeleteTrip = (tripId) => {
    const updatedTrips = deleteTrip(tripId);

    setTrips(updatedTrips);

    setSuccessMessage("Escapada eliminada correctamente.");
  };

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setSuccessMessage("");
    }, 3500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [successMessage]);

  return (
    <main>
      <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
        {/* Cabecera */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Planifica</p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-text sm:text-5xl">Escapadas</h1>

            <p className="mt-5 text-lg leading-8 text-muted">Organiza tus próximas salidas agrupando rutas, lugares, fechas y notas en un mismo espacio.</p>
          </div>

          <button type="button" onClick={() => setIsModalOpen(true)} className="w-fit rounded-full bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark">
            + Nueva escapada
          </button>
        </div>

        {/* Mensaje de éxito */}
        {successMessage && (
          <div className="mt-8 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-800" role="status">
            ✓ {successMessage}
          </div>
        )}

        {/* Explicación */}
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <p className="text-sm font-semibold text-primary">01</p>

            <h2 className="mt-3 text-lg font-semibold text-text">Elige fechas</h2>

            <p className="mt-2 leading-7 text-muted">Define cuándo quieres realizar tu próxima salida.</p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6">
            <p className="text-sm font-semibold text-primary">02</p>

            <h2 className="mt-3 text-lg font-semibold text-text">Añade rutas y lugares</h2>

            <p className="mt-2 leading-7 text-muted">Agrupa todo lo que quieras visitar durante la escapada.</p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6">
            <p className="text-sm font-semibold text-primary">03</p>

            <h2 className="mt-3 text-lg font-semibold text-text">Organiza el plan</h2>

            <p className="mt-2 leading-7 text-muted">Añade notas, consulta el tiempo y prepara tu salida.</p>
          </div>
        </div>

        {/* Tus escapadas */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight text-text">Tus escapadas</h2>

          <p className="mt-2 text-muted">Consulta y continúa preparando todas tus próximas salidas.</p>

          {trips.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-border bg-surface p-8 text-center sm:p-12">
              <h3 className="text-xl font-semibold text-text">Todavía no tienes escapadas</h3>

              <p className="mx-auto mt-3 max-w-lg leading-7 text-muted">Crea tu primera escapada y empieza a organizar rutas y lugares para tu próxima salida.</p>

              <button type="button" onClick={() => setIsModalOpen(true)} className="mt-7 rounded-full bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark">
                Crear primera escapada
              </button>
            </div>
          ) : (
            <div className="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {trips.map((trip) => (
                <TripCard key={trip.id} trip={trip} onDelete={handleDeleteTrip} />
              ))}
            </div>
          )}
        </section>
      </section>

      <NewTripModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreateTrip={handleCreateTrip} />
    </main>
  );
}

export default Trips;
