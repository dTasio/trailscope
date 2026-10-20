import { useState } from "react";
import { Link } from "react-router";

import { getCompletedTrails, removeCompletedTrail } from "../services/completedTrailsService.js";

function formatCompletedDate(date) {
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function Activity() {
  const [completedTrails, setCompletedTrails] = useState(() => getCompletedTrails());

  /*
   * Ordenamos las rutas de más
   * reciente a más antigua.
   */
  const sortedCompletedTrails = [...completedTrails].sort((a, b) => b.completedDate.localeCompare(a.completedDate));

  /*
   * Estadísticas generales.
   */
  const totalCompleted = completedTrails.length;

  const totalDistance = completedTrails.reduce((total, trail) => total + (Number(trail.distance) || 0), 0);

  const totalAscent = completedTrails.reduce((total, trail) => total + (Number(trail.ascent) || 0), 0);

  /*
   * Eliminar una ruta del historial.
   */
  const handleRemoveCompleted = (completionId) => {
    const confirmed = window.confirm("¿Quieres quitar esta ruta de tu historial de completadas?");

    if (!confirmed) {
      return;
    }

    const updatedTrails = removeCompletedTrail(completionId);

    setCompletedTrails(updatedTrails);
  };

  const hasCompletedTrails = completedTrails.length > 0;

  return (
    <main>
      <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
        {/* Cabecera */}
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Tu actividad</p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-text sm:text-5xl">Completadas</h1>

          <p className="mt-5 text-lg leading-8 text-muted">Consulta las rutas que has realizado y sigue la evolución de tu actividad.</p>
        </div>

        {/* Estadísticas */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <article className="rounded-2xl border border-border bg-surface p-6">
            <p className="text-3xl font-bold text-text">{totalCompleted}</p>

            <p className="mt-1 text-sm text-muted">Rutas completadas</p>
          </article>

          <article className="rounded-2xl border border-border bg-surface p-6">
            <p className="text-3xl font-bold text-text">
              {totalDistance.toLocaleString("es-ES", {
                maximumFractionDigits: 1,
              })}{" "}
              km
            </p>

            <p className="mt-1 text-sm text-muted">Distancia recorrida</p>
          </article>

          <article className="rounded-2xl border border-border bg-surface p-6">
            <p className="text-3xl font-bold text-text">{totalAscent.toLocaleString("es-ES")} m</p>

            <p className="mt-1 text-sm text-muted">Desnivel acumulado</p>
          </article>
        </div>

        {/* Estado vacío */}
        {!hasCompletedTrails && (
          <div className="mt-12 rounded-3xl border border-border bg-surface p-8 text-center sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface-secondary text-2xl">✓</div>

            <h2 className="mt-5 text-2xl font-bold tracking-tight text-text">Todavía no has completado ninguna ruta</h2>

            <p className="mx-auto mt-3 max-w-lg leading-7 text-muted">Cuando marques una ruta como completada, aparecerá aquí junto con tus estadísticas.</p>

            <Link to="/explore" className="mt-7 inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark">
              Explorar rutas
            </Link>
          </div>
        )}

        {/* Historial */}
        {hasCompletedTrails && (
          <section className="mt-14">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Historial</p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-text">Tus rutas realizadas</h2>

              <p className="mt-2 text-muted">Ordenadas desde la actividad más reciente.</p>
            </div>

            <div className="mt-6 space-y-4">
              {sortedCompletedTrails.map((trail) => (
                <article key={trail.completionId} className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    {/* Información */}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary">{formatCompletedDate(trail.completedDate)}</p>

                      <h3 className="mt-2 text-xl font-bold tracking-tight text-text">{trail.name}</h3>

                      {/* Métricas relevantes */}
                      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
                        {trail.distance !== null && trail.distance !== undefined && (
                          <span>
                            {Number(trail.distance).toLocaleString("es-ES", {
                              maximumFractionDigits: 1,
                            })}{" "}
                            km
                          </span>
                        )}

                        {trail.ascent !== null && trail.ascent !== undefined && <span>+{trail.ascent} m</span>}
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:min-w-[150px]">
                      <Link to={`/routes/${trail.trailId}`} className="flex min-h-11 items-center justify-center rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:border-primary hover:bg-surface-secondary">
                        Ver detalle →
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleRemoveCompleted(trail.completionId)}
                        className="min-h-11 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-muted transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

export default Activity;
