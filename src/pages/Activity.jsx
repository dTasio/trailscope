import { Link } from "react-router";

function Activity() {
  return (
    <main>
      <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Tu recorrido</p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-text sm:text-5xl">Rutas completadas</h1>

          <p className="mt-5 text-lg leading-8 text-muted">Lleva un registro de las rutas que ya has recorrido y consulta tu progreso.</p>
        </div>

        {/* Estadísticas */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <p className="text-3xl font-bold text-text">0</p>

            <p className="mt-1 text-sm text-muted">Rutas completadas</p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6">
            <p className="text-3xl font-bold text-text">0 km</p>

            <p className="mt-1 text-sm text-muted">Distancia recorrida</p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6">
            <p className="text-3xl font-bold text-text">0 m</p>

            <p className="mt-1 text-sm text-muted">Desnivel acumulado</p>
          </div>
        </div>

        {/* Rutas */}
        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-text">Historial</h2>

          <div className="mt-6 rounded-3xl border border-border bg-surface p-8 text-center sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface-secondary text-xl">✓</div>

            <h3 className="mt-5 text-xl font-semibold text-text">Aún no has completado ninguna ruta</h3>

            <p className="mx-auto mt-3 max-w-lg leading-7 text-muted">Cuando marques una ruta como completada, aparecerá aquí junto con tus estadísticas.</p>

            <Link to="/explore" className="mt-7 inline-flex rounded-full border border-border bg-surface px-6 py-3 font-semibold text-text transition-colors hover:border-primary hover:text-primary">
              Explorar rutas
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}

export default Activity;
