function Trips() {
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

          <button type="button" className="w-fit rounded-full bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark">
            + Nueva escapada
          </button>
        </div>

        {/* Cómo funciona */}
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

            <p className="mt-2 leading-7 text-muted">Añade notas y prepara la salida antes de ponerte en marcha.</p>
          </div>
        </div>

        {/* Lista */}
        <section className="mt-14">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-text">Tus escapadas</h2>

              <p className="mt-2 text-muted">Aquí aparecerán todas las escapadas que prepares.</p>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-border bg-surface p-8 text-center sm:p-12">
            <h3 className="text-xl font-semibold text-text">Todavía no tienes escapadas</h3>

            <p className="mx-auto mt-3 max-w-lg leading-7 text-muted">Crea tu primera escapada y empieza a organizar rutas y lugares para tu próxima salida.</p>
          </div>
        </section>
      </section>
    </main>
  );
}

export default Trips;
