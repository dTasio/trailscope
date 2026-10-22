import HeroSection from "../components/home/HeroSection.jsx";
import FeaturedTrailsSection from "../components/home/FeaturedTrailsSection.jsx";
import FeaturedPlacesSection from "../components/home/FeaturedPlacesSection.jsx";
import MapPreviewSection from "../components/home/MapPreviewSection.jsx";
import TripPlanningSection from "../components/home/TripPlanningSection.jsx";
import FinalCTASection from "../components/home/FinalCTASection.jsx";
import anayet from "../assets/images/anayet.jpg";
import plan from "../assets/images/plan.jpg";
import tresCascadas from "../assets/images/tresCascadas.jpg";
import colaCaballo from "../assets/images/colaCaballo.jpg";
import piedrafita from "../assets/images/piedrafita.jpg";
import mirador from "../assets/images/mirador.jpg";

//Constantes
const featuredTrails = [
  {
    id: 1,
    name: "Ibones de Anayet",
    location: "Sallent de Gállego · Huesca",
    distance: "11 km",
    duration: "4 h",
    difficulty: "Media",
    image: anayet,
  },
  {
    id: 2,
    name: "Ibón de Plan",
    location: "Saravillo · Huesca",
    distance: "3 km",
    duration: "55 min",
    difficulty: "Fácil",
    image: plan,
  },
  {
    id: 3,
    name: "Tres Cascadas de Cerler",
    location: "Cerler · Huesca",
    distance: "6,3 km",
    duration: "2 h 10 min",
    difficulty: "Fácil",
    image: tresCascadas,
  },
];

const featuredPlaces = [
  {
    id: 1,
    name: "Cola de Caballo",
    type: "Cascada",
    location: "Ordesa · Huesca",
    altitude: "1.760 m",
    image: colaCaballo,
  },
  {
    id: 2,
    name: "Ibón de Piedrafita",
    type: "Lago",
    location: "Piedrafita de Jaca · Huesca",
    altitude: "1.611 m",
    image: piedrafita,
  },
  {
    id: 3,
    name: "Mirador de Calcilarruego",
    type: "Mirador",
    location: "Ordesa · Huesca",
    altitude: "1.950 m",
    image: mirador,
  },
];

function Home() {
  return (
    <main>
      <HeroSection />

      <FeaturedTrailsSection trails={featuredTrails} />

      <FeaturedPlacesSection places={featuredPlaces} />

      <MapPreviewSection />

      <TripPlanningSection />

      <FinalCTASection />
    </main>
  );
}

export default Home;
