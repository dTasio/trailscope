import { useState } from "react";

import { addPlaceToTrip, addTrailToTrip, getTrips } from "../../services/tripsService.js";

import { formatPlaceName } from "../../utils/placeFormatters.js";

function AddToTripModal({ isOpen, onClose, item, type, onAdded }) {
  // Escapada seleccionada y posibles errores
  const [selectedTripId, setSelectedTripId] = useState("");
  const [error, setError] = useState("");

  const trips = getTrips();

  if (!isOpen || !item) {
    return null;
  }

  // Indica si el elemento recibido es una ruta o un lugar
  const isTrail = type === "trail";

  // Colores compartidos por todo el modal
  const theme = {
    eyebrow: "text-[#3f6b53]",
    itemBox: "border-[#c7d7cc] bg-[#f2f7f3]",
    itemText: "text-[#2f5d50]",
    selectedTrip: "border-[#8eae99] bg-[#f2f7f3]",
    addedTrip: "border-[#8eae99] bg-[#edf4ef]",
    badge: "bg-[#315f49] text-white",
    button: "bg-[#315f49] text-white hover:bg-[#244b39]",
    radio: "accent-[#315f49]",
  };

  // Prepara el nombre que se mostrará según el tipo de elemento
  const displayName = isTrail ? item.name : formatPlaceName(item.name, item.type);

  // Comprueba si la ruta o lugar ya forma parte de una escapada
  const isItemAlreadyInTrip = (trip) => {
    if (isTrail) {
      return (trip.trails ?? []).some((trail) => String(trail.id) === String(item.id));
    }

    return (trip.places ?? []).some((place) => place.osmKey === item.osmKey);
  };

  // Limpia la selección y los errores antes de cerrar el modal
  const handleClose = () => {
    setSelectedTripId("");
    setError("");

    onClose();
  };

  // Valida la selección y añade el elemento solo si el guardado funciona
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedTripId) {
      setError("Selecciona una escapada.");

      return;
    }

    const selectedTrip = trips.find((trip) => trip.id === selectedTripId);

    // Evita intentar guardar un elemento que ya está en la escapada
    if (selectedTrip && isItemAlreadyInTrip(selectedTrip)) {
      setError(isTrail ? "Esta ruta ya forma parte de la escapada." : "Este lugar ya forma parte de la escapada.");

      return;
    }

    try {
      const result = isTrail ? addTrailToTrip(selectedTripId, item) : addPlaceToTrip(selectedTripId, item);

      if (result.alreadyAdded) {
        setError(isTrail ? "Esta ruta ya forma parte de la escapada." : "Este lugar ya forma parte de la escapada.");

        return;
      }

      onAdded?.(result.trip);

      handleClose();
    } catch (error) {
      setError(error.message === "La escapada no existe." ? error.message : "No se ha podido añadir a la escapada");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-xl">
        {/* Cabecera */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className={`text-sm font-semibold uppercase tracking-[0.14em] ${theme.eyebrow}`}>Escapadas</p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-text">Añadir a una escapada</h2>
          </div>

          <button type="button" onClick={handleClose} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl text-muted transition-colors hover:bg-surface-secondary hover:text-text" aria-label="Cerrar">
            ×
          </button>
        </div>

        {/* Elemento seleccionado */}
        <div className="mt-5">
          <p className="text-sm leading-6 text-muted">Selecciona dónde quieres guardar</p>

          <div className={`mt-2 rounded-xl border px-4 py-3 ${theme.itemBox}`}>
            <p className={`font-semibold leading-6 ${theme.itemText}`}>{displayName}</p>
          </div>
        </div>

        {/* Sin escapadas */}
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
                {trips.map((trip) => {
                  const isAlreadyAdded = isItemAlreadyInTrip(trip);

                  const isSelected = selectedTripId === trip.id;

                  return (
                    <label
                      key={trip.id}
                      className={`flex items-start gap-3 rounded-xl border p-4 transition-colors ${isAlreadyAdded ? `cursor-default ${theme.addedTrip}` : isSelected ? `cursor-pointer ${theme.selectedTrip}` : "cursor-pointer border-border bg-surface hover:border-[#8eae99]"}`}
                    >
                      <input
                        type="radio"
                        name="trip"
                        value={trip.id}
                        disabled={isAlreadyAdded}
                        checked={isSelected}
                        onChange={() => {
                          setSelectedTripId(trip.id);

                          setError("");
                        }}
                        className={`mt-1 ${theme.radio}`}
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <p className={`font-semibold ${isAlreadyAdded ? theme.itemText : "text-text"}`}>{trip.name}</p>

                          {isAlreadyAdded && <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${theme.badge}`}>✓ Añadida</span>}
                        </div>

                        <p className="mt-1 text-sm text-muted">{trip.destination?.name || "Destino por definir"}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {/* Error */}
            {error && (
              <p className="mt-4 text-sm font-medium text-red-700" role="alert">
                {error}
              </p>
            )}

            {/* Acciones */}
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={handleClose} className="min-h-11 rounded-full border border-border px-5 py-2.5 font-semibold text-text transition-colors hover:bg-surface-secondary">
                Cancelar
              </button>

              <button type="submit" disabled={!selectedTripId} className={`min-h-11 rounded-full px-5 py-2.5 font-semibold transition-colors ${selectedTripId ? theme.button : "cursor-not-allowed bg-surface-secondary text-muted"}`}>
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
