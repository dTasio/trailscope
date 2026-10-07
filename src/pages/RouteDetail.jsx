import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import { getHikingTrailById } from "../services/trailsService.js";

import RouteMap from "../components/routes/RouteMap.jsx";
import routeDefaultImage from "../assets/images/route-default.jpg";

import { formatSurfaceValues, formatTrailVisibilityValues, formatSacScaleValues } from "../utils/trailFormatters.js";

function DetailMetric({ value, label }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="text-xl font-bold text-text">{value}</p>

      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  );
}

function TrailInformationItem({ title, values, formatter }) {
  if (values.length === 0) {
    return null;
  }

  return (
    <div className="min-w-0">
      <p className="font-semibold text-text">{title}</p>

      <p className="mt-2 leading-7 text-muted">{formatter(values).join(" · ")}</p>
    </div>
  );
}

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

  const surfaces = trail.surface ?? [];

  const trailVisibility = trail.trailVisibility ?? [];

  const sacScale = trail.sacScale ?? [];

  const hasTrailCharacteristics = surfaces.length > 0 || trailVisibility.length > 0 || sacScale.length > 0;

  return (
    <main>
      <section className="mx-auto max-w-7xl px-6 py-10">
        {/* Volver */}
        <Link to="/explore" className="text-sm font-semibold text-primary transition-colors hover:text-primary-dark">
          ← Volver a explorar
        </Link>

        {/* Imagen principal */}
        <div className="mt-6 overflow-hidden rounded-2xl">
          <img src={routeDefaultImage} alt={`Paisaje de la ruta ${trail.name}`} className="h-64 w-full object-cover sm:h-80 lg:h-96" />
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

          {/* Acciones */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" className="rounded-full bg-primary px-5 py-2.5 font-semibold text-white transition-colors hover:bg-primary-dark">
              ♡ Guardar favorito
            </button>

            <button type="button" className="rounded-full border border-border bg-surface px-5 py-2.5 font-semibold text-text transition-colors hover:border-primary hover:text-primary">
              + Añadir a escapada
            </button>

            <button type="button" className="rounded-full border border-border bg-surface px-5 py-2.5 font-semibold text-text transition-colors hover:border-primary hover:text-primary">
              ✓ Marcar como completada
            </button>
          </div>
        </div>

        {/* Métricas principales */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {trail.distance !== null && (
            <DetailMetric
              value={`${trail.distance.toLocaleString("es-ES", {
                maximumFractionDigits: 1,
              })} km`}
              label="Distancia"
            />
          )}

          {trail.ascent !== null && <DetailMetric value={`+${trail.ascent} m`} label="Ascenso" />}

          {trail.descent !== null && <DetailMetric value={`-${trail.descent} m`} label="Descenso" />}

          {trail.duration && <DetailMetric value={trail.duration} label="Duración" />}
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
              {trail.from && (
                <div className="sm:w-56">
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Inicio</p>

                  <p className="mt-2 text-lg font-semibold text-text">{trail.from}</p>
                </div>
              )}

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
              {trail.to && (
                <div className="sm:w-56 sm:text-right">
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Destino</p>

                  <p className="mt-2 text-lg font-semibold text-text">{trail.to}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Características */}
        {hasTrailCharacteristics && (
          <section className="mt-14">
            <h2 className="text-2xl font-bold tracking-tight text-text">Características del sendero</h2>

            <div className="mt-6 grid gap-y-8 lg:grid-cols-12 lg:gap-x-12">
              {sacScale.length > 0 && (
                <div className="lg:col-span-3">
                  <TrailInformationItem title="Dificultad" values={sacScale} formatter={formatSacScaleValues} />
                </div>
              )}

              {surfaces.length > 0 && (
                <div className="lg:col-span-6">
                  <TrailInformationItem title="Superficie" values={surfaces} formatter={formatSurfaceValues} />
                </div>
              )}

              {trailVisibility.length > 0 && (
                <div className="lg:col-span-3">
                  <TrailInformationItem title="Visibilidad" values={trailVisibility} formatter={formatTrailVisibilityValues} />
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

            <div className="mt-4 flex flex-wrap gap-5">
              {trail.website && (
                <a href={trail.website} target="_blank" rel="noreferrer" className="font-semibold text-primary transition-colors hover:text-primary-dark">
                  Web oficial →
                </a>
              )}

              {trail.wikipedia && <p className="font-medium text-muted">Wikipedia: {trail.wikipedia}</p>}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

export default RouteDetail;
