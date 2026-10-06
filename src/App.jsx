import { Route, Routes, useLocation } from "react-router";
import { useEffect } from "react";

import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";
import Explore from "./pages/Explore.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Footer from "./components/Footer.jsx";

import RouteDetail from "./pages/RouteDetail.jsx";

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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/routes/:id" element={<RouteDetail />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
