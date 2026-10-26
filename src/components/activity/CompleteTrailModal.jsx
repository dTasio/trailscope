import { useState } from "react";
import { addCompletedTrail } from "../../services/completedTrailsService.js";

// Devuelve la fecha actual en formato YYYY-MM-DD
function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();

  const month = String(today.getMonth() + 1).padStart(2, "0");

  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function CompleteTrailModal({ isOpen, onClose, trail, onCompleted }) {
  // Fecha seleccionada y posibles errores
  const [completedDate, setCompletedDate] = useState(getTodayDate());
  const [error, setError] = useState("");

  if (!isOpen || !trail) {
    return null;
  }

  // Limpia el formulario antes de cerrar el modal
  const handleClose = () => {
    setCompletedDate(getTodayDate());
    setError("");
    onClose();
  };

  // Valida la fecha y registra la ruta solo si el guardado funciona
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!completedDate) {
      setError("Selecciona la fecha en la que realizaste la ruta.");
      return;
    }

    try {
      const result = addCompletedTrail(trail, completedDate);

      if (result.alreadyCompleted) {
        setError("Esta ruta ya está registrada como completada.");
        return;
      }

      onCompleted?.(result.completion);
      handleClose();
    } catch {
      setError("No se ha podido registrar la ruta como completada");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-xl">
        {/* Cabecera */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Actividad</p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-text">Marcar como completada</h2>
          </div>

          <button type="button" onClick={handleClose} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl text-muted transition-colors hover:bg-surface-secondary hover:text-text" aria-label="Cerrar">
            ×
          </button>
        </div>

        {/* Ruta */}
        <div className="mt-5 rounded-xl bg-surface-secondary p-4">
          <p className="text-sm text-muted">Ruta</p>

          <p className="mt-1 font-semibold text-primary">{trail.name}</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6">
          <label htmlFor="completed-date" className="font-semibold text-text">
            Fecha de realización
          </label>

          <p className="mt-1 text-sm leading-6 text-muted">Indica cuándo realizaste esta ruta.</p>

          <input
            id="completed-date"
            type="date"
            value={completedDate}
            max={getTodayDate()}
            onChange={(event) => {
              setCompletedDate(event.target.value);

              setError("");
            }}
            className="mt-3 w-full rounded-xl border border-border bg-background px-4 py-3 text-text outline-none transition focus:border-primary"
          />

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
              Completar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CompleteTrailModal;
