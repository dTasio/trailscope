import { Link } from "react-router";
import mapPreview from "../../assets/images/jaca.png";

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

      <div className="relative min-h-105 overflow-hidden rounded-3xl border border-[#c7d7cc] bg-surface shadow-sm lg:min-h-115">
        <img src={mapPreview} alt="Vista previa del mapa de TrailScope en la zona de Ordesa" className="absolute inset-0 h-full w-full object-cover" />

        <div className="absolute top-5 right-5 rounded-full border border-white/60 bg-white/90 px-4 py-2 shadow-sm backdrop-blur-sm">
          <p className="text-xs font-semibold text-[#315f49]">Hoz de Jaca · Huesca</p>
        </div>

        <div className="absolute right-5 bottom-5 left-5 rounded-2xl border border-white/60 bg-white/92 px-5 py-4 shadow-lg backdrop-blur-md sm:right-auto sm:max-w-xs">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Explorar</p>

          <p className="mt-1 font-semibold text-text">Rutas y lugares naturales</p>

          <p className="mt-1 text-sm text-muted">Descubre qué hay alrededor.</p>
        </div>
      </div>
    </section>
  );
}

export default MapPreviewSection;
