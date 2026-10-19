import { useState } from "react";

import { addPlaceToTrip, addTrailToTrip, getTrips } from "../../services/tripsService.js";

function AddToTripModal({ isOpen, onClose, item, type, onAdded }) {
  const [selectedTripId, setSelectedTripId] = useState("");

  const [error, setError] = useState("");

  const trips = getTrips();

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    setSelectedTripId("");
    setError("");

    onClose();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedTripId) {
      setError("Selecciona una escapada.");

      return;
    }

    try {
      const result = type === "trail" ? addTrailToTrip(selectedTripId, item) : addPlaceToTrip(selectedTripId, item);

      if (result.alreadyAdded) {
        setError(type === "trail" ? "Esta ruta ya forma parte de la escapada." : "Este lugar ya forma parte de la escapada.");

        return;
      }

      onAdded?.(result.trip);

      handleClose();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Escapadas</p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-text">Añadir a una escapada</h2>

            <p className="mt-2 text-sm leading-6 text-muted">
              Selecciona dónde quieres guardar <span className="font-semibold text-text">{item?.name}</span>.
            </p>
          </div>

          <button type="button" onClick={handleClose} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl text-muted transition-colors hover:bg-surface-secondary hover:text-text" aria-label="Cerrar">
            ×
          </button>
        </div>

        {trips.length === 0 ? (
          <div className="mt-6 rounded-xl bg-surface-secondary p-4">
            <p className="font-medium text-text">Todavía no tienes escapadas</p>

            <p className="mt-1 text-sm leading-6 text-muted">Crea primero una escapada desde la sección Escapadas.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6">
            <fieldset>
              <legend className="text-sm font-semibold text-text">Tus escapadas</legend>

              <div className="mt-3 space-y-2">
                {trips.map((trip) => (
                  <label key={trip.id} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${selectedTripId === trip.id ? "border-primary bg-surface-secondary" : "border-border hover:border-primary/50"}`}>
                    <input
                      type="radio"
                      name="trip"
                      value={trip.id}
                      checked={selectedTripId === trip.id}
                      onChange={() => {
                        setSelectedTripId(trip.id);

                        setError("");
                      }}
                      className="mt-1"
                    />

                    <div>
                      <p className="font-semibold text-text">{trip.name}</p>

                      <p className="mt-1 text-sm text-muted">{trip.destination?.name || "Destino por definir"}</p>
                    </div>
                  </label>
                ))}
              </div>
            </fieldset>

            {error && (
              <p className="mt-4 text-sm font-medium text-red-700" role="alert">
                {error}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={handleClose} className="rounded-full border border-border px-5 py-2.5 font-semibold text-text transition-colors hover:border-primary">
                Cancelar
              </button>

              <button type="submit" className="rounded-full bg-primary px-5 py-2.5 font-semibold text-white transition-colors hover:bg-primary-dark">
                Añadir
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default AddToTripModal;
