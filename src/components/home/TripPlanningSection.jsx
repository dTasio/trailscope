function TripPlanningSection() {
  return (
    <section className="bg-primary text-white">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">Prepara tu escapada</p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Del descubrimiento al plan.</h2>

          <p className="mt-5 text-lg leading-8 text-white/75">Guarda lo que te interesa y organiza cada salida antes de ponerte en marcha.</p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <div>
            <p className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">01</p>

            <h3 className="mt-3 text-xl font-semibold">Descubre</h3>

            <p className="mt-2 leading-7 text-white/70">Explora rutas y espacios naturales directamente desde el mapa.</p>
          </div>

          <div>
            <p className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">02</p>

            <h3 className="mt-3 text-xl font-semibold">Guarda</h3>

            <p className="mt-2 leading-7 text-white/70">Conserva tus rutas y lugares favoritos para encontrarlos fácilmente.</p>
          </div>

          <div>
            <p className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">03</p>

            <h3 className="mt-3 text-xl font-semibold">Planifica</h3>

            <p className="mt-2 leading-7 text-white/70">Crea escapadas con fechas, rutas, lugares y notas personales.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TripPlanningSection;
