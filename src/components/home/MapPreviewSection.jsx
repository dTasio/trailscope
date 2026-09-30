import { Link } from "react-router";

function MapPreviewSection() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
      <div className="max-w-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Explora visualmente</p>

        <h2 className="mt-3 text-3xl font-bold tracking-tight text-text sm:text-4xl">Explora el territorio desde el mapa.</h2>

        <p className="mt-5 text-lg leading-8 text-muted">Descubre rutas y lugares naturales por zona y mantén siempre el contexto geográfico.</p>

        <Link to="/explore" className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark">
          Explorar mapa
        </Link>
      </div>

      <div className="relative min-h-100 overflow-hidden rounded-2xl border border-border bg-surface-secondary">
        <div className="absolute inset-0 opacity-60">
          <div className="absolute top-[25%] left-[20%] h-3 w-3 rounded-full bg-primary"></div>
          <div className="absolute top-[38%] left-[58%] h-3 w-3 rounded-full bg-accent"></div>
          <div className="absolute top-[68%] left-[72%] h-3 w-3 rounded-full bg-primary"></div>
        </div>

        <div className="absolute bottom-5 left-5 rounded-xl bg-white/90 px-5 py-4 shadow-lg backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Explorar</p>

          <p className="mt-1 font-semibold text-text">12 rutas y 8 lugares en esta zona</p>
        </div>
      </div>
    </section>
  );
}

export default MapPreviewSection;
