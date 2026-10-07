import { Link } from "react-router";

function FinalCTASection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="rounded-3xl bg-surface-secondary px-6 py-12 text-center sm:px-10 lg:py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Siguiente destino</p>

        <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-bold tracking-tight text-text sm:text-4xl">Tu próxima escapada empieza aquí.</h2>

        <p className="mx-auto mt-5 max-w-xl leading-7 text-muted">Explora nuevas rutas y lugares naturales, guarda tus favoritos y empieza a preparar tu próxima salida.</p>

        <Link to="/explore" className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark">
          Explorar TrailScope
        </Link>
      </div>
    </section>
  );
}

export default FinalCTASection;
