import { Link } from "react-router";
import heroImage from "../../assets/images/hero-ordesa.jpg";

function HeroSection() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
      <div className="max-w-xl">
        <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Rutas · Naturaleza · Escapadas</p>

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-text sm:text-5xl lg:text-6xl">Encuentra tu próxima aventura al aire libre.</h1>

        <p className="mt-6 max-w-lg text-lg leading-8 text-muted">Explora rutas y espacios naturales, consulta información útil y prepara tu próxima escapada.</p>

        <Link to="/explore" className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark">
          Explorar rutas
        </Link>
      </div>

      <div className="relative min-h-105 overflow-hidden rounded-2xl lg:min-h-140">
        <img src={heroImage} alt="Paisaje montañoso en el entorno de Ordesa" className="h-full min-h-105 w-full object-cover lg:min-h-140" />

        <div className="absolute right-5 bottom-5 left-5 rounded-xl bg-white/90 p-5 shadow-lg backdrop-blur-sm sm:right-auto sm:max-w-xs">
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
  );
}

export default HeroSection;
