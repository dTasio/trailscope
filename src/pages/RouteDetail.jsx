import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import { getHikingTrailById } from "../services/trailsService.js";

import RouteMap from "../components/routes/RouteMap.jsx";
import routeDefaultImage from "../assets/images/route-default.jpg";
import AddToTripModal from "../components/trips/AddToTripModal.jsx";

import { formatSurfaceValues, formatTrailVisibilityValues, formatSacScaleValues } from "../utils/trailFormatters.js";

import { addFavorite, removeFavorite, isFavorite as checkIsFavorite } from "../services/favoritesService.js";

import CompleteTrailModal from "../components/activity/CompleteTrailModal.jsx";

import { isTrailCompleted as checkIsTrailCompleted } from "../services/completedTrailsService.js";

// Muestra una métrica principal de la ruta
function DetailMetric({ value, label }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="text-xl font-bold text-text">{value}</p>

      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  );
}

// Muestra una característica de la ruta con sus valores formateados
function TrailCharacteristic({ title, values, formatter }) {
  if (values.length === 0) {
    return null;
  }

  const formattedValues = formatter(values);

  return (
    <div className="min-w-0">
      <p className="font-semibold text-text">{title}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {formattedValues.map((value) => (
          <span key={value} className="rounded-full bg-surface-secondary px-3 py-1.5 text-sm text-muted">
            {value}
          </span>
        ))}
      </div>
    </div>
  );
}

function RouteDetail() {
  const { id } = useParams();

  // Datos de la ruta y estado de carga
  const [trail, setTrail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado de favoritos
  const [isTrailFavorite, setIsTrailFavorite] = useState(false);
  const [favoriteError, setFavoriteError] = useState("");

  // Estado del modal de escapadas y su mensaje de confirmación
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const [tripSuccessMessage, setTripSuccessMessage] = useState("");

  // Estado del modal de completadas y su mensaje de confirmación
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isTrailCompleted, setIsTrailCompleted] = useState(false);
  const [completedSuccessMessage, setCompletedSuccessMessage] = useState("");

  // Oculta el mensaje de escapada después de 3 segundos
  useEffect(() => {
    if (!tripSuccessMessage) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setTripSuccessMessage("");
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [tripSuccessMessage]);

  // Carga la ruta y comprueba si está guardada como favorita o completada
  useEffect(() => {
    const loadTrail = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const trailData = await getHikingTrailById(id);

        setTrail(trailData);

        setIsTrailCompleted(checkIsTrailCompleted(trailData.id));

        const favoriteId = `trail-${trailData.id}`;

        setIsTrailFavorite(checkIsFavorite(favoriteId));
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadTrail();
  }, [id]);

  // Oculta el mensaje de ruta completada después de 3 segundos
  useEffect(() => {
    if (!completedSuccessMessage) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setCompletedSuccessMessage("");
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [completedSuccessMessage]);

  if (isLoading) {
    return (
      <main>
        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex min-h-80 items-center justify-center">
            <div className="text-center">
              <p className="font-semibold text-text">Cargando ruta</p>

              <p className="mt-2 text-sm text-muted">Estamos preparando la información de la ruta.</p>
            </div>
          </div>
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

  // Prepara las características disponibles de la ruta
  const surfaces = trail.surface ?? [];

  const trailVisibility = trail.trailVisibility ?? [];

  const sacScale = trail.sacScale ?? [];

  const hasTrailCharacteristics = surfaces.length > 0 || trailVisibility.length > 0 || sacScale.length > 0;

  const trailCharacteristics = [
    sacScale.length > 0 && {
      id: "difficulty",
      title: "Dificultad",
      values: sacScale,
      formatter: formatSacScaleValues,
    },

    surfaces.length > 0 && {
      id: "surface",
      title: "Superficie",
      values: surfaces,
      formatter: formatSurfaceValues,
    },

    trailVisibility.length > 0 && {
      id: "visibility",
      title: "Visibilidad",
      values: trailVisibility,
      formatter: formatTrailVisibilityValues,
    },
  ].filter(Boolean);

  // Ajusta las columnas según la cantidad de características disponibles
  const characteristicsGridClass = trailCharacteristics.length === 1 ? "max-w-2xl" : trailCharacteristics.length === 2 ? "grid gap-8 md:grid-cols-2" : "grid gap-8 md:grid-cols-2 lg:grid-cols-3";

  // Añade o elimina la ruta de favoritos y actualiza la interfaz solo si el guardado funciona
  const handleFavorite = () => {
    if (!trail) return;

    const favoriteId = `trail-${trail.id}`;

    setFavoriteError("");

    try {
      if (isTrailFavorite) {
        removeFavorite(favoriteId);
        setIsTrailFavorite(false);
        return;
      }

      const favorite = {
        favoriteId,
        contentType: "trail",
        id: trail.id,
        name: trail.name,
        distance: trail.distance,
        ascent: trail.ascent,
        descent: trail.descent,
        duration: trail.duration,
        from: trail.from,
        to: trail.to,
      };

      addFavorite(favorite);
      setIsTrailFavorite(true);
    } catch {
      setFavoriteError("No se ha podido actualizar el favorito");
    }
  };

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
            <button
              type="button"
              onClick={handleFavorite}
              className={`rounded-full px-5 py-2.5 font-semibold transition-colors ${isTrailFavorite ? "bg-primary text-white hover:bg-primary-dark" : "border border-border bg-surface text-text hover:border-primary hover:text-primary"}`}
            >
              {isTrailFavorite ? "♥ Guardado" : "♡ Guardar favorito"}
            </button>

            <button type="button" onClick={() => setIsTripModalOpen(true)} className="rounded-full border border-border bg-surface px-5 py-2.5 font-semibold text-text transition-colors hover:border-primary hover:text-primary">
              + Añadir a escapada
            </button>

            <button
              type="button"
              disabled={isTrailCompleted}
              onClick={() => setIsCompleteModalOpen(true)}
              className={`rounded-full border px-5 py-2.5 font-semibold transition-colors ${isTrailCompleted ? "cursor-default border-primary bg-surface-secondary text-primary" : "border-border bg-surface text-text hover:border-primary hover:text-primary"}`}
            >
              {isTrailCompleted ? "✓ Completada" : "✓ Marcar como completada"}
            </button>
          </div>

          {tripSuccessMessage && (
            <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-800" role="status">
              ✓ {tripSuccessMessage}
            </div>
          )}

          {favoriteError && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800" role="alert">
              {favoriteError}
            </div>
          )}

          {completedSuccessMessage && (
            <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-800" role="status">
              ✓ {completedSuccessMessage}
            </div>
          )}
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

            <div className={`mt-6 ${characteristicsGridClass}`}>
              {trailCharacteristics.map((characteristic) => (
                <TrailCharacteristic key={characteristic.id} title={characteristic.title} values={characteristic.values} formatter={characteristic.formatter} />
              ))}
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

        {/* Modal para añadir la ruta a una escapada */}
        <AddToTripModal
          isOpen={isTripModalOpen}
          onClose={() => setIsTripModalOpen(false)}
          item={trail}
          type="trail"
          onAdded={(trip) => {
            setTripSuccessMessage(`Ruta añadida a "${trip.name}".`);
          }}
        />
        {/* Modal para marcar la ruta como completada */}
        <CompleteTrailModal
          isOpen={isCompleteModalOpen}
          onClose={() => setIsCompleteModalOpen(false)}
          trail={trail}
          onCompleted={() => {
            setIsTrailCompleted(true);

            setCompletedSuccessMessage("Ruta añadida a tu historial.");
          }}
        />
      </section>
    </main>
  );
}

export default RouteDetail;
