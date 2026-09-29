import { useState } from "react";
import { Link } from "react-router";

function Header() {
  //States
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-xl font-bold tracking-tight text-primary">
          TrailScope
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/explore" className="text-sm font-medium text-text transition-colors hover:text-primary">
            Explorar
          </Link>
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link to="/login" className="text-sm font-medium text-text transition-colors hover:text-primary">
            Iniciar sesión
          </Link>

          <Link to="/register" className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">
            Registrarse
          </Link>
        </div>

        <button type="button" className="text-sm font-medium text-text md:hidden" aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"} aria-expanded={menuOpen} onClick={() => setMenuOpen((prevMenuOpen) => !prevMenuOpen)}>
          {menuOpen ? "Cerrar" : "Menú"}
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-border bg-background px-6 py-5 md:hidden">
          <div className="flex flex-col gap-5">
            <Link to="/explore" className="font-medium text-text" onClick={closeMenu}>
              Explorar
            </Link>

            <Link to="/login" className="font-medium text-text" onClick={closeMenu}>
              Iniciar sesión
            </Link>

            <Link to="/register" className="w-fit rounded-full bg-primary px-5 py-2.5 font-semibold text-white" onClick={closeMenu}>
              Registrarse
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

export default Header;
