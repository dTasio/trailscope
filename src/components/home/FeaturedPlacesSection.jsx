import PlaceCard from "../PlaceCard.jsx";

function FeaturedPlacesSection({ places }) {
  return (
    <section className="bg-surface-secondary">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Lugares naturales</p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-text">Naturaleza que invita a salir.</h2>

          <p className="mt-3 max-w-2xl text-muted">Descubre cascadas, lagos, miradores y otros espacios naturales.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {places.map((place) => (
            <PlaceCard key={place.id} name={place.name} type={place.type} location={place.location} altitude={place.altitude} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedPlacesSection;
