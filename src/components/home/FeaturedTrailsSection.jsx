import TrailCard from "../TrailCard.jsx";

function FeaturedTrailsSection({ trails }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Descubre</p>

        <h2 className="mt-3 text-3xl font-bold tracking-tight text-text">Rutas destacadas</h2>

        <p className="mt-3 max-w-2xl text-muted">Una selección de rutas para empezar a descubrir nuevos destinos.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {trails.map((trail) => (
          <TrailCard key={trail.id} name={trail.name} location={trail.location} distance={trail.distance} duration={trail.duration} difficulty={trail.difficulty} image={trail.image} />
        ))}
      </div>
    </section>
  );
}

export default FeaturedTrailsSection;
