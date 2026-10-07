import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import { getNaturalPlaceByKey } from "../services/placesService.js";

import PlaceMap from "../components/places/PlaceMap.jsx";
import placeDefaultImage from "../assets/images/place-default.jpg";

function PlaceDetail() {
  const { osmKey } = useParams();

  const [place, setPlace] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPlace = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const placeData = await getNaturalPlaceByKey(osmKey);

        setPlace(placeData);
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

  function getPlaceTypeLabel(type) {
    const labels = {
      waterfall: "Cascada",
      viewpoint: "Mirador",
      lake: "Lago",
    };

    return labels[type] ?? "Lugar natural";
  }

  function DetailMetric({ value, label }) {
    return (
      <div className="rounded-xl border border-border bg-surface p-4">
        <p className="text-xl font-bold text-text">{value}</p>

        <p className="mt-1 text-sm text-muted">{label}</p>
      </div>
    );
  }

  function PlaceCharacteristics({ place }) {
    const hasWaterfallData = place.type === "waterfall" && (place.seasonal || place.intermittent);

    const hasViewpointData = place.type === "viewpoint" && place.viewpointType;

    const hasLakeData = place.type === "lake" && (place.seasonal || place.intermittent || place.salt);

    if (!hasWaterfallData && !hasViewpointData && !hasLakeData) {
      return null;
    }

    return (
      <section className="mt-14">
        <h2 className="text-2xl font-bold tracking-tight text-text">Características</h2>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {place.seasonal && <InformationItem title="Estacional" value={place.seasonal} />}

          {place.intermittent && <InformationItem title="Intermitente" value={place.intermittent} />}

          {place.viewpointType && <InformationItem title="Tipo de mirador" value={place.viewpointType} />}

          {place.salt && <InformationItem title="Tipo de agua" value={place.salt} />}
        </div>
      </section>
    );
  }

  function InformationItem({ title, value }) {
    return (
      <div>
        <p className="font-semibold text-text">{title}</p>

        <p className="mt-2 leading-7 text-muted">{value}</p>
      </div>
    );
  }

  function VisitInformation({ place }) {
    const hasVisitInformation = place.access || place.wheelchair || place.fee || place.charge || place.openingHours;

    if (!hasVisitInformation) {
      return null;
    }

    return (
      <section className="mt-14">
        <h2 className="text-2xl font-bold tracking-tight text-text">Información de visita</h2>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {place.access && <InformationItem title="Acceso" value={place.access} />}

          {place.wheelchair && <InformationItem title="Accesibilidad" value={place.wheelchair} />}

          {place.fee && <InformationItem title="Acceso de pago" value={place.fee} />}

          {place.charge && <InformationItem title="Precio" value={place.charge} />}

          {place.openingHours && <InformationItem title="Horario" value={place.openingHours} />}
        </div>
      </section>
    );
  }

  return (
    <main>
      <section className="mx-auto max-w-7xl px-6 py-10">
        <Link to="/explore" className="text-sm font-semibold text-primary transition hover:text-primary-dark">
          ← Volver a explorar
        </Link>

        {/* Imagen */}
        <div className="mt-6 overflow-hidden rounded-2xl">
          <img src={place.image || placeDefaultImage} alt={place.name} className="h-64 w-full object-cover sm:h-80 lg:h-96" />
        </div>

        {/* Cabecera */}
        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{getPlaceTypeLabel(place.type)}</p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-text sm:text-4xl lg:text-5xl">{place.name}</h1>
        </div>

        {/* Datos principales */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {place.elevation !== null && <DetailMetric value={`${place.elevation} m`} label="Altitud" />}

          {place.type === "waterfall" && place.height !== null && <DetailMetric value={`${place.height} m`} label="Altura del salto" />}

          {place.type === "waterfall" && place.width !== null && <DetailMetric value={`${place.width} m`} label="Anchura" />}

          {place.type === "viewpoint" && place.direction && <DetailMetric value={place.direction} label="Orientación" />}
        </div>

        {/* Mapa */}
        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-text">Ubicación</h2>

          <div className="mt-5">
            <PlaceMap coordinates={place.coordinates} type={place.type} />
          </div>
        </section>

        {/* Información específica */}
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

            <div className="mt-4 flex flex-wrap gap-4">
              {place.website && (
                <a href={place.website} target="_blank" rel="noreferrer" className="font-semibold text-primary transition hover:text-primary-dark">
                  Web oficial →
                </a>
              )}

              {place.wikipedia && <span className="font-medium text-muted">Wikipedia: {place.wikipedia}</span>}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

export default PlaceDetail;
