import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import { getNaturalPlaceByKey } from "../services/placesService.js";

import PlaceMap from "../components/places/PlaceMap.jsx";
import placeDefaultImage from "../assets/images/place-default.jpg";

import { formatAccess, formatDirection, formatPlaceName, formatPlaceType, formatWheelchair, formatYesNo } from "../utils/placeFormatters.js";

import { addFavorite, removeFavorite, isFavorite as checkIsFavorite } from "../services/favoritesService.js";

function DetailMetric({ value, label }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="text-xl font-bold text-text">{value}</p>

      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  );
}

function PlaceInformationItem({ title, value }) {
  if (!value) {
    return null;
  }

  return (
    <div className="min-w-0">
      <p className="font-semibold text-text">{title}</p>

      <div className="mt-3">
        <span className="inline-flex rounded-full bg-surface-secondary px-3 py-1.5 text-sm text-muted">{value}</span>
      </div>
    </div>
  );
}

function PlaceCharacteristics({ place }) {
  const characteristics = [
    place.seasonal && {
      id: "seasonal",
      title: "Estacional",
      value: formatYesNo(place.seasonal),
    },

    place.intermittent && {
      id: "intermittent",
      title: "Intermitente",
      value: formatYesNo(place.intermittent),
    },

    place.viewpointType && {
      id: "viewpoint-type",
      title: "Tipo de mirador",
      value: place.viewpointType,
    },

    place.salt && {
      id: "salt",
      title: "Tipo de agua",
      value: formatYesNo(place.salt),
    },
  ].filter(Boolean);

  if (characteristics.length === 0) {
    return null;
  }

  const gridClass = characteristics.length === 1 ? "max-w-2xl" : characteristics.length === 2 ? "grid gap-8 md:grid-cols-2" : "grid gap-8 md:grid-cols-2 lg:grid-cols-3";

  return (
    <section className="mt-14">
      <h2 className="text-2xl font-bold tracking-tight text-text">Características</h2>

      <div className={`mt-6 ${gridClass}`}>
        {characteristics.map((characteristic) => (
          <PlaceInformationItem key={characteristic.id} title={characteristic.title} value={characteristic.value} />
        ))}
      </div>
    </section>
  );
}

function VisitInformation({ place }) {
  const visitInformation = [
    place.access && {
      id: "access",
      title: "Acceso",
      value: formatAccess(place.access),
    },

    place.wheelchair && {
      id: "wheelchair",
      title: "Accesibilidad",
      value: formatWheelchair(place.wheelchair),
    },

    place.fee && {
      id: "fee",
      title: "Acceso de pago",
      value: formatYesNo(place.fee),
    },

    place.charge && {
      id: "charge",
      title: "Precio",
      value: place.charge,
    },

    place.openingHours && {
      id: "opening-hours",
      title: "Horario",
      value: place.openingHours,
    },
  ].filter(Boolean);

  if (visitInformation.length === 0) {
    return null;
  }

  const gridClass = visitInformation.length === 1 ? "max-w-2xl" : visitInformation.length === 2 ? "grid gap-8 md:grid-cols-2" : "grid gap-8 md:grid-cols-2 lg:grid-cols-3";

  return (
    <section className="mt-14">
      <h2 className="text-2xl font-bold tracking-tight text-text">Información de visita</h2>

      <div className={`mt-6 ${gridClass}`}>
        {visitInformation.map((information) => (
          <PlaceInformationItem key={information.id} title={information.title} value={information.value} />
        ))}
      </div>
    </section>
  );
}

function PlaceDetail() {
  const { osmKey } = useParams();

  const [place, setPlace] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isPlaceFavorite, setIsPlaceFavorite] = useState(false);

  useEffect(() => {
    const loadPlace = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const placeData = await getNaturalPlaceByKey(osmKey);

        setPlace(placeData);

        const favoriteId = `place-${placeData.osmKey}`;

        setIsPlaceFavorite(checkIsFavorite(favoriteId));
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadPlace();
  }, [osmKey]);

  if (isLoading) {
    return (
      <main>
        <section className="mx-auto max-w-7xl px-6 py-10">
          <p className="text-muted">Cargando lugar...</p>
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

  if (!place) {
    return null;
  }

  const displayName = formatPlaceName(place.name, place.type);

  const displayType = formatPlaceType(place.type);

  const handleFavorite = () => {
    if (!place) {
      return;
    }

    const favoriteId = `place-${place.osmKey}`;

    if (isPlaceFavorite) {
      removeFavorite(favoriteId);

      setIsPlaceFavorite(false);

      return;
    }

    const favorite = {
      favoriteId,
      contentType: "place",

      osmKey: place.osmKey,
      name: place.name,
      type: place.type,

      elevation: place.elevation,
      coordinates: place.coordinates,

      image: place.image,
    };

    addFavorite(favorite);

    setIsPlaceFavorite(true);
  };

  return (
    <main>
      <section className="mx-auto max-w-7xl px-6 py-10">
        {/* Volver */}
        <Link to="/explore" className="text-sm font-semibold text-primary transition-colors hover:text-primary-dark">
          ← Volver a explorar
        </Link>

        {/* Imagen */}
        <div className="mt-6 overflow-hidden rounded-2xl">
          <img src={place.image || placeDefaultImage} alt={displayName} className="h-64 w-full object-cover sm:h-80 lg:h-96" />
        </div>

        {/* Cabecera */}
        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{displayType}</p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-text sm:text-4xl lg:text-5xl">{displayName}</h1>

          {/* Acciones */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleFavorite}
              className={`rounded-full px-5 py-2.5 font-semibold transition-colors ${isPlaceFavorite ? "bg-primary text-white hover:bg-primary-dark" : "border border-border bg-surface text-text hover:border-primary hover:text-primary"}`}
            >
              {isPlaceFavorite ? "♥ Guardado" : "♡ Guardar favorito"}
            </button>

            <button type="button" className="rounded-full border border-border bg-surface px-5 py-2.5 font-semibold text-text transition-colors hover:border-primary hover:text-primary">
              + Añadir a escapada
            </button>
          </div>
        </div>

        {/* Datos principales */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {place.elevation !== null && <DetailMetric value={`${place.elevation} m`} label="Altitud" />}

          {place.type === "waterfall" && place.height !== null && <DetailMetric value={`${place.height} m`} label="Altura del salto" />}

          {place.type === "waterfall" && place.width !== null && <DetailMetric value={`${place.width} m`} label="Anchura" />}

          {place.type === "viewpoint" && place.direction && <DetailMetric value={formatDirection(place.direction)} label="Orientación de las vistas" />}
        </div>

        {/* Ubicación */}
        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-text">Ubicación</h2>

          <div className="mt-5">
            <PlaceMap coordinates={place.coordinates} type={place.type} />
          </div>

          {/* Coordenadas */}
          {place.coordinates && (
            <div className="mt-5 flex flex-wrap gap-x-10 gap-y-4 text-sm">
              <div>
                <p className="text-muted">Latitud</p>

                <p className="mt-1 font-medium text-text">{place.coordinates.latitude.toFixed(5)}</p>
              </div>

              <div>
                <p className="text-muted">Longitud</p>

                <p className="mt-1 font-medium text-text">{place.coordinates.longitude.toFixed(5)}</p>
              </div>
            </div>
          )}
        </section>

        {/* Características */}
        <PlaceCharacteristics place={place} />

        {/* Información de visita */}
        <VisitInformation place={place} />

        {/* Descripción */}
        {place.description && (
          <section className="mt-14">
            <h2 className="text-2xl font-bold tracking-tight text-text">Sobre el lugar</h2>

            <p className="mt-4 max-w-3xl leading-7 text-muted">{place.description}</p>
          </section>
        )}

        {/* Enlaces */}
        {(place.website || place.wikipedia) && (
          <section className="mt-14">
            <h2 className="text-2xl font-bold tracking-tight text-text">Más información</h2>

            <div className="mt-4 flex flex-wrap gap-5">
              {place.website && (
                <a href={place.website} target="_blank" rel="noreferrer" className="font-semibold text-primary transition-colors hover:text-primary-dark">
                  Web oficial →
                </a>
              )}

              {place.wikipedia && <p className="font-medium text-muted">Wikipedia: {place.wikipedia}</p>}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

export default PlaceDetail;
