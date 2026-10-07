import { Link } from "react-router";

function Favorites() {
  return (
    <main>
      <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Tu selección</p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-text sm:text-5xl">Favoritos</h1>

          <p className="mt-5 text-lg leading-8 text-muted">Guarda las rutas y lugares que más te interesen para encontrarlos fácilmente cuando quieras preparar una nueva salida.</p>
        </div>

        {/* Resumen */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <p className="text-3xl font-bold text-text">0</p>

            <p className="mt-1 text-sm text-muted">Rutas favoritas</p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6">
            <p className="text-3xl font-bold text-text">0</p>

            <p className="mt-1 text-sm text-muted">Lugares favoritos</p>
          </div>
        </div>

        {/* Estado vacío */}
        <div className="mt-10 rounded-3xl border border-border bg-surface p-8 text-center sm:p-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface-secondary text-2xl">♡</div>

          <h2 className="mt-5 text-2xl font-bold tracking-tight text-text">Todavía no tienes favoritos</h2>

          <p className="mx-auto mt-3 max-w-lg leading-7 text-muted">Explora rutas y lugares naturales y guarda los que quieras tener a mano.</p>

          <Link to="/explore" className="mt-7 inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark">
            Explorar rutas y lugares
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Favorites;
