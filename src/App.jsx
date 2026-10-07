import { Route, Routes, useLocation } from "react-router";
import { useEffect } from "react";

import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";
import Explore from "./pages/Explore.jsx";
import Footer from "./components/Footer.jsx";

import Favorites from "./pages/Favorites.jsx";
import Trips from "./pages/Trips.jsx";
import Activity from "./pages/Activity.jsx";

import RouteDetail from "./pages/RouteDetail.jsx";
import PlaceDetail from "./pages/PlaceDetail.jsx";

function App() {
  const { pathname } = useLocation();

  // Lleva la página al inicio cada vez que cambia la ruta.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/routes/:id" element={<RouteDetail />} />
        <Route path="/places/:osmKey" element={<PlaceDetail />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/activity" element={<Activity />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
