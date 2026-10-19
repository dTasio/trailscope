import { useState } from "react";

function NewTripModal({ isOpen, onClose, onCreateTrip }) {
  const [name, setName] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [validationError, setValidationError] = useState("");

  if (!isOpen) {
    return null;
  }

  const resetForm = () => {
    setName("");
    setDestination("");
    setStartDate("");
    setEndDate("");
    setValidationError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!name.trim() || !destination.trim() || !startDate || !endDate) {
      setValidationError("Completa todos los campos antes de crear la escapada.");

      return;
    }

    if (endDate < startDate) {
      setValidationError("La fecha de finalización no puede ser anterior a la fecha de inicio.");

      return;
    }

    onCreateTrip({
      name: name.trim(),
      destination: destination.trim(),
      startDate,
      endDate,
    });

    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-3xl bg-surface p-6 shadow-xl sm:p-8" role="dialog" aria-modal="true" aria-labelledby="new-trip-title">
        {/* Cabecera */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Nueva escapada</p>

            <h2 id="new-trip-title" className="mt-2 text-2xl font-bold tracking-tight text-text">
              Empieza a preparar tu salida
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted">Define la información básica. Después podrás añadir rutas, lugares, meteorología y notas.</p>
          </div>

          {/* Cerrar */}
          <button
            type="button"
            onClick={handleClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-background text-2xl leading-none text-muted transition-colors hover:border-primary hover:text-primary"
            aria-label="Cerrar ventana"
          >
            ×
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} noValidate className="mt-8">
          <div>
            <label htmlFor="trip-name" className="font-medium text-text">
              Nombre de la escapada
            </label>

            <input
              id="trip-name"
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value);

                setValidationError("");
              }}
              placeholder="Fin de semana en Ordesa"
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-text outline-none transition focus:border-primary"
            />
          </div>

          <div className="mt-5">
            <label htmlFor="trip-destination" className="font-medium text-text">
              Zona o destino
            </label>

            <input
              id="trip-destination"
              type="text"
              value={destination}
              onChange={(event) => {
                setDestination(event.target.value);

                setValidationError("");
              }}
              placeholder="Ordesa, Torla, Pirineos..."
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-text outline-none transition focus:border-primary"
            />
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="trip-start" className="font-medium text-text">
                Desde
              </label>

              <input
                id="trip-start"
                type="date"
                value={startDate}
                onChange={(event) => {
                  setStartDate(event.target.value);

                  setValidationError("");
                }}
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-text outline-none transition focus:border-primary"
              />
            </div>

            <div>
              <label htmlFor="trip-end" className="font-medium text-text">
                Hasta
              </label>

              <input
                id="trip-end"
                type="date"
                value={endDate}
                min={startDate}
                onChange={(event) => {
                  setEndDate(event.target.value);

                  setValidationError("");
                }}
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-text outline-none transition focus:border-primary"
              />
            </div>
          </div>

          {/* Error de validación */}
          {validationError && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">
              {validationError}
            </div>
          )}

          {/* Acciones */}
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button type="button" onClick={handleClose} className="rounded-full border border-border px-5 py-2.5 font-semibold text-text transition-colors hover:border-primary">
              Cancelar
            </button>

            <button type="submit" className="rounded-full bg-primary px-5 py-2.5 font-semibold text-white transition-colors hover:bg-primary-dark">
              Crear escapada
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewTripModal;
