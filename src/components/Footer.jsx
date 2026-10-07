import { Link } from "react-router";

function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
          {/* Marca */}
          <div>
            <Link to="/" className="text-2xl font-bold tracking-tight text-primary">
              TrailScope
            </Link>

            <p className="mt-4 max-w-md leading-7 text-muted">Explora rutas, descubre lugares naturales y organiza tus próximas escapadas desde un mismo lugar.</p>
          </div>

          {/* Navegación */}
          <div>
            <p className="font-semibold text-text">Explorar</p>

            <nav className="mt-4 flex flex-col gap-3 text-sm text-muted">
              <Link to="/explore" className="transition-colors hover:text-primary">
                Rutas y lugares
              </Link>

              <Link to="/favorites" className="transition-colors hover:text-primary">
                Favoritos
              </Link>

              <Link to="/trips" className="transition-colors hover:text-primary">
                Escapadas
              </Link>

              <Link to="/activity" className="transition-colors hover:text-primary">
                Completadas
              </Link>
            </nav>
          </div>

          {/* Proyecto */}
          <div>
            <p className="font-semibold text-text">Proyecto</p>

            <div className="mt-4 flex flex-col gap-3 text-sm text-muted">
              <p>Aplicación frontend de exploración y planificación outdoor.</p>

              <p>Datos geográficos de OpenStreetMap.</p>
            </div>
          </div>
        </div>

        {/* Parte inferior */}
        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 TrailScope</p>

          <p>Proyecto de portfolio · Datos © OpenStreetMap contributors</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
