import { useState } from "react";
import { Link, NavLink } from "react-router";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const getNavLinkClass = ({ isActive }) => `rounded-lg px-4 py-3 text-lg font-medium transition-colors ${isActive ? "text-primary" : "text-text hover:text-primary"}`;

  const getMobileNavLinkClass = ({ isActive }) => `font-medium transition-colors ${isActive ? "text-primary" : "text-text hover:text-primary"}`;

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-7xl items-center px-6 py-5">
        {/* Logo */}
        <Link to="/" className="shrink-0 rounded-lg px-3 py-2 text-3xl font-bold tracking-tight text-primary" onClick={closeMenu}>
          TrailScope
        </Link>

        {/* Navegación desktop */}
        <nav className="ml-28 hidden flex-1 items-center justify-between md:flex" aria-label="Navegación principal">
          <NavLink to="/explore" className={getNavLinkClass}>
            Explorar
          </NavLink>

          <NavLink to="/favorites" className={getNavLinkClass}>
            Favoritos
          </NavLink>

          <NavLink to="/trips" className={getNavLinkClass}>
            Escapadas
          </NavLink>

          <NavLink to="/activity" className={getNavLinkClass}>
            Completadas
          </NavLink>
        </nav>

        {/* Botón menú mobile */}
        <button type="button" className="rounded-lg px-3 py-2 font-medium text-text transition-colors hover:text-primary md:hidden" aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"} aria-expanded={menuOpen} onClick={() => setMenuOpen((prevMenuOpen) => !prevMenuOpen)}>
          {menuOpen ? "Cerrar" : "Menú"}
        </button>
      </div>

      {/* Navegación mobile */}
      {menuOpen && (
        <nav className="border-t border-border bg-background px-6 py-5 md:hidden" aria-label="Navegación móvil">
          <div className="mx-auto flex max-w-7xl flex-col gap-5">
            <NavLink to="/explore" className={getMobileNavLinkClass} onClick={closeMenu}>
              Explorar
            </NavLink>

            <NavLink to="/favorites" className={getMobileNavLinkClass} onClick={closeMenu}>
              Favoritos
            </NavLink>

            <NavLink to="/trips" className={getMobileNavLinkClass} onClick={closeMenu}>
              Escapadas
            </NavLink>

            <NavLink to="/activity" className={getMobileNavLinkClass} onClick={closeMenu}>
              Completadas
            </NavLink>
          </div>
        </nav>
      )}
    </header>
  );
}

export default Header;
