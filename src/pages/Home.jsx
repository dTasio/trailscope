import { Link } from "react-router";
import TrailCard from "../components/TrailCard.jsx";
import PlaceCard from "../components/PlaceCard.jsx";
import heroImage from "../assets/images/hero-ordesa.jpg";

//Constantes
const featuredTrails = [
  {
    id: 1,
    name: "Valle de Ordesa",
    location: "Huesca · Aragón",
    distance: "12,4 km",
    duration: "3 h 30 min",
    difficulty: "Media",
    image: heroImage,
  },
  {
    id: 2,
    name: "Ibón de Plan",
    location: "Huesca · Aragón",
    distance: "14 km",
    duration: "4 h",
    difficulty: "Media",
    image: null,
  },
  {
    id: 3,
    name: "Ruta de las Cascadas",
    location: "Pirineo Aragonés",
    distance: "9,8 km",
    duration: "2 h 45 min",
    difficulty: "Fácil",
    image: heroImage,
  },
];

const featuredPlaces = [
  {
    id: 1,
    name: "Cola de Caballo",
    type: "Cascada",
    location: "Ordesa · Huesca",
    altitude: "1.760 m",
  },
  {
    id: 2,
    name: "Ibón de Plan",
    type: "Lago",
    location: "Valle de Chistau · Huesca",
    altitude: "1.910 m",
  },
  {
    id: 3,
    name: "Mirador de Calcilarruego",
    type: "Mirador",
    location: "Ordesa · Huesca",
    altitude: "1.950 m",
  },
];

function Home() {
  return (
    <main>
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
        <div className="max-w-xl">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Rutas · Naturaleza · Escapadas</p>

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-text sm:text-5xl lg:text-6xl">Descubre lugares que merece la pena recorrer.</h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-muted">Explora rutas y espacios naturales, consulta información útil y prepara tu próxima escapada.</p>

          <Link to="/explore" className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark">
            Explorar rutas
          </Link>
        </div>

        <div className="relative min-h-105 overflow-hidden rounded-2xl lg:min-h-140">
          <img src={heroImage} alt="Paisaje montañoso en el entorno de Ordesa" className="h-full min-h-105 w-full object-cover lg:min-h-140" />
          <div className="absolute bottom-5 left-5 right-5 rounded-xl bg-white/90 p-5 shadow-lg backdrop-blur-sm sm:right-auto sm:max-w-xs">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Ruta destacada</p>

            <h2 className="mt-2 text-xl font-bold text-text">Valle de Ordesa</h2>

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted">
              <span>12,4 km</span>
              <span>3 h 30 min</span>
              <span>Dificultad media</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Descubre</p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-text">Rutas destacadas</h2>

          <p className="mt-3 max-w-2xl text-muted">Explora algunas rutas para inspirar tu próxima escapada.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredTrails.map((trail) => (
            <TrailCard key={trail.id} name={trail.name} location={trail.location} distance={trail.distance} duration={trail.duration} difficulty={trail.difficulty} image={trail.image} />
          ))}
        </div>
      </section>

      <section className="bg-surface-secondary">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Lugares naturales</p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-text">Lugares que merece la pena descubrir</h2>

            <p className="mt-3 max-w-2xl text-muted">Descubre cascadas, lagos, miradores y otros espacios naturales.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredPlaces.map((place) => (
              <PlaceCard key={place.id} name={place.name} type={place.type} location={place.location} altitude={place.altitude} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Explora visualmente</p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-text sm:text-4xl">Encuentra tu próxima ruta directamente sobre el mapa.</h2>

          <p className="mt-5 text-lg leading-8 text-muted">Explora rutas y lugares naturales por zona, descubre qué tienes cerca y consulta cada punto sin perder el contexto geográfico.</p>

          <Link to="/explore" className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark">
            Explorar mapa
          </Link>
        </div>

        <div className="relative min-h-100 overflow-hidden rounded-2xl border border-border bg-surface-secondary">
          <div className="absolute inset-0 opacity-60">
            <div className="absolute left-[20%] top-[25%] h-3 w-3 rounded-full bg-primary"></div>
            <div className="absolute left-[58%] top-[38%] h-3 w-3 rounded-full bg-accent"></div>
            <div className="absolute left-[72%] top-[68%] h-3 w-3 rounded-full bg-primary"></div>
          </div>

          <div className="absolute bottom-5 left-5 rounded-xl bg-white/90 px-5 py-4 shadow-lg backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Explorar</p>

            <p className="mt-1 font-semibold text-text">12 rutas y 8 lugares en esta zona</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
