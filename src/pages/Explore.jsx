import ExploreMap from "../components/explore/ExploreMap.jsx";

function Explore() {
  return (
    <main>
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Explorar</p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-text sm:text-4xl">Explora rutas y lugares naturales.</h1>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border">
          <ExploreMap />
        </div>
      </section>
    </main>
  );
}

export default Explore;
