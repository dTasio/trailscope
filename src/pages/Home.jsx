import { Link } from "react-router";
import HeroSection from "../components/home/HeroSection.jsx";
import FeaturedTrailsSection from "../components/home/FeaturedTrailsSection.jsx";
import FeaturedPlacesSection from "../components/home/FeaturedPlacesSection.jsx";
import MapPreviewSection from "../components/home/MapPreviewSection.jsx";
import TripPlanningSection from "../components/home/TripPlanningSection.jsx";
import FinalCTASection from "../components/home/FinalCTASection.jsx";
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
