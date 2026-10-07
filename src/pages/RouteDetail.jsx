import { Link, useParams } from "react-router";
import { useEffect, useState } from "react";

import RouteMap from "../components/routes/RouteMap.jsx";
import routeDefaultImage from "../assets/images/route-default.jpg";

import { getHikingTrailById } from "../services/trailsService.js";

import { formatSurfaceValues, formatTrailVisibilityValues, formatSacScaleValues } from "../utils/trailFormatters.js";

function RouteDetail() {
  const { id } = useParams();

  const [trail, setTrail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTrail = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const trailData = await getHikingTrailById(id);

        setTrail(trailData);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadTrail();
  }, [id]);

  if (isLoading) {
    return (
      <main>
        <section className="mx-auto max-w-7xl px-6 py-10">
          <p className="text-muted">Cargando ruta...</p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <section className="mx-auto max-w-7xl px-6 py-10">
          <p className="text-red-700">{error}</p>
        </section>
      </main>
    );
  }

  if (!trail) {
    return null;
  }

  return (
    <main>
      <section className="mx-auto max-w-7xl px-6 py-10">
        <Link to="/explore" className="text-sm font-semibold text-primary transition hover:text-primary-dark">
          ← Volver a explorar
        </Link>

        {/* Imagen principal */}
        <div className="mt-6 overflow-hidden rounded-2xl">
          <img src={routeDefaultImage} alt="Paisaje de senderismo" className="h-64 w-full object-cover sm:h-80 lg:h-96" />
        </div>

        {/* Cabecera */}
        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Ruta de senderismo</p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-text sm:text-4xl lg:text-5xl">{trail.name}</h1>

          {trail.from && trail.to && (
            <p className="mt-3 text-lg text-muted">
              {trail.from} → {trail.to}
            </p>
          )}
        </div>

        {/* Métricas principales */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {trail.distance !== null && (
            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="text-xl font-bold text-text">
                {trail.distance.toLocaleString("es-ES", {
                  maximumFractionDigits: 1,
                })}{" "}
                km
              </p>

              <p className="mt-1 text-sm text-muted">Distancia</p>
            </div>
          )}

          {trail.ascent !== null && (
            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="text-xl font-bold text-text">+{trail.ascent} m</p>

              <p className="mt-1 text-sm text-muted">Ascenso</p>
            </div>
          )}

          {trail.descent !== null && (
            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="text-xl font-bold text-text">-{trail.descent} m</p>

              <p className="mt-1 text-sm text-muted">Descenso</p>
            </div>
          )}

          {trail.duration && (
            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="text-xl font-bold text-text">{trail.duration}</p>

              <p className="mt-1 text-sm text-muted">Duración</p>
            </div>
          )}
        </div>

        {/* Recorrido */}
        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-text">Recorrido</h2>

          <div className="mt-5">
            <RouteMap geometry={trail.geometry} />
          </div>
        </section>

        {/* Inicio y destino */}
        {(trail.from || trail.to) && (
          <section className="mt-14">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-center sm:gap-8">
              {/* Inicio */}
              <div className="sm:w-56">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Inicio</p>

                <p className="mt-2 text-lg font-semibold text-text">{trail.from}</p>
              </div>

              {/* Representación visual del recorrido */}
              {trail.from && trail.to && (
                <div className="flex justify-center sm:w-72" aria-hidden="true">
                  <div className="flex h-14 flex-col items-center sm:h-auto sm:w-full sm:flex-row">
                    <span className="h-3 w-3 shrink-0 rounded-full bg-primary" />

                    <span className="h-full w-px bg-border sm:h-px sm:w-auto sm:flex-1" />

                    <span className="h-3 w-3 shrink-0 rounded-full border-2 border-primary bg-background" />
                  </div>
                </div>
              )}

              {/* Destino */}
              <div className="sm:w-56 sm:text-right">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Destino</p>

                <p className="mt-2 text-lg font-semibold text-text">{trail.to}</p>
              </div>
            </div>
          </section>
        )}

        {/* Características */}
        {(trail.surface.length > 0 || trail.trailVisibility.length > 0 || trail.sacScale.length > 0) && (
          <section className="mt-14">
            <h2 className="text-2xl font-bold tracking-tight text-text">Características del sendero</h2>

            <div className="mt-6 grid gap-y-8 lg:grid-cols-12 lg:gap-x-12">
              {trail.sacScale.length > 0 && (
                <div className="min-w-0 lg:col-span-3">
                  <p className="font-semibold text-text">Dificultad</p>

                  <p className="mt-2 leading-7 text-muted">{formatSacScaleValues(trail.sacScale).join(" · ")}</p>
                </div>
              )}

              {trail.surface.length > 0 && (
                <div className="min-w-0 lg:col-span-6">
                  <p className="font-semibold text-text">Superficie</p>

                  <p className="mt-2 leading-7 text-muted">{formatSurfaceValues(trail.surface).join(" · ")}</p>
                </div>
              )}

              {trail.trailVisibility.length > 0 && (
                <div className="min-w-0 lg:col-span-3">
                  <p className="font-semibold text-text">Visibilidad</p>

                  <p className="mt-2 leading-7 text-muted">{formatTrailVisibilityValues(trail.trailVisibility).join(" · ")}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Descripción */}
        {trail.description && (
          <section className="mt-14">
            <h2 className="text-2xl font-bold tracking-tight text-text">Sobre la ruta</h2>

            <p className="mt-4 max-w-3xl leading-7 text-muted">{trail.description}</p>
          </section>
        )}

        {/* Enlaces externos */}
        {(trail.website || trail.wikipedia) && (
          <section className="mt-14">
            <h2 className="text-2xl font-bold tracking-tight text-text">Más información</h2>

            <div className="mt-4 flex flex-wrap gap-4">
              {trail.website && (
                <a href={trail.website} target="_blank" rel="noreferrer" className="font-semibold text-primary transition hover:text-primary-dark">
                  Web oficial →
                </a>
              )}

              {trail.wikipedia && <span className="font-medium text-muted">Wikipedia: {trail.wikipedia}</span>}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

export default RouteDetail;
