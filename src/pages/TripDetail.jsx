import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import TripPlannerMap from "../components/trips/TripPlannerMap.jsx";
import NearbyResultsCarousel from "../components/trips/NearbyResultsCarousel.jsx";
import TripWeather from "../components/trips/TripWeather.jsx";

import { getTripById, updateTrip } from "../services/tripsService.js";

import { searchLocations } from "../services/geocodingService.js";

import { getHikingTrails } from "../services/trailsService.js";
import { getNaturalPlaces } from "../services/placesService.js";

// Formatea una fecha para mostrarla en español
function formatDate(date) {
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

// Calcula los límites aproximados de búsqueda alrededor de unas coordenadas
function getBoundsAroundLocation(latitude, longitude, radiusKm = 12) {
  const latitudeDelta = radiusKm / 111;

  const longitudeDelta = radiusKm / (111 * Math.cos((latitude * Math.PI) / 180));

  return {
    north: latitude + latitudeDelta,

    south: latitude - latitudeDelta,

    east: longitude + longitudeDelta,

    west: longitude - longitudeDelta,
  };
}

function TripDetail() {
  const { id } = useParams();
  const [trip, setTrip] = useState(() => getTripById(id));
  const [notes, setNotes] = useState(trip?.notes ?? "");

  // Mensajes del planificador
  const [plannerSuccessMessage, setPlannerSuccessMessage] = useState("");
  const [plannerError, setPlannerError] = useState("");

  // Mensajes de las notas
  const [notesSuccessMessage, setNotesSuccessMessage] = useState("");
  const [notesError, setNotesError] = useState("");

  // Búsqueda geográfica
  const [searchTerm, setSearchTerm] = useState("");
  const [locationResults, setLocationResults] = useState([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [locationSearchError, setLocationSearchError] = useState("");

  // Rutas y lugares encontrados cerca de la zona
  const [contentType, setContentType] = useState("all");
  const [nearbyTrails, setNearbyTrails] = useState([]);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [isLoadingNearbyContent, setIsLoadingNearbyContent] = useState(false);
  const [nearbyContentError, setNearbyContentError] = useState("");
  const [hasSearchedNearbyContent, setHasSearchedNearbyContent] = useState(false);
  const [selectedNearbyResult, setSelectedNearbyResult] = useState(null);

  // Cambia el tipo de contenido visible en el mapa y carrusel
  const handleContentTypeChange = (nextContentType) => {
    setContentType(nextContentType);

    setSelectedNearbyResult(null);
  };

  // Oculta el mensaje del planificador después de 3 segundos
  useEffect(() => {
    if (!plannerSuccessMessage) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setPlannerSuccessMessage("");
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [plannerSuccessMessage]);

  // Oculta el mensaje de notas después de 3 segundos
  useEffect(() => {
    if (!notesSuccessMessage) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setNotesSuccessMessage("");
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [notesSuccessMessage]);

  // Escapada inexistente
  if (!trip) {
    return (
      <main>
        <section className="mx-auto max-w-7xl px-6 py-16">
          <h1 className="text-3xl font-bold text-text">Escapada no encontrada</h1>

          <p className="mt-3 text-muted">Esta escapada no existe o ha sido eliminada.</p>

          <Link to="/trips" className="mt-6 inline-flex font-semibold text-primary transition-colors hover:text-primary-dark">
            ← Volver a escapadas
          </Link>
        </section>
      </main>
    );
  }

  // Rutas y lugares guardados actualmente en la escapada
  const trails = trip.trails ?? [];
  const places = trip.places ?? [];

  // Filtra los resultados usados por el mapa y el carrusel
  const visibleNearbyTrails = contentType === "places" ? [] : nearbyTrails;
  const visibleNearbyPlaces = contentType === "trails" ? [] : nearbyPlaces;

  const visibleNearbyResults = [
    ...visibleNearbyTrails.map((trail) => ({
      ...trail,
      resultType: "trail",
    })),
    ...visibleNearbyPlaces.map((place) => ({
      ...place,
      resultType: "place",
    })),
  ];

  const hasDestinationCoordinates = typeof trip.destination?.latitude === "number" && typeof trip.destination?.longitude === "number";

  // Busca rutas y lugares alrededor de la zona seleccionada
  const loadNearbyContent = async (location) => {
    const bounds = getBoundsAroundLocation(location.latitude, location.longitude);

    setIsLoadingNearbyContent(true);
    setNearbyContentError("");

    setNearbyTrails([]);
    setNearbyPlaces([]);

    setHasSearchedNearbyContent(false);
    setContentType("all");
    setSelectedNearbyResult(null);

    try {
      const results = await Promise.allSettled([getHikingTrails(bounds), getNaturalPlaces(bounds)]);

      const [trailsResult, placesResult] = results;

      if (trailsResult.status === "fulfilled") {
        setNearbyTrails(trailsResult.value);
      }

      if (placesResult.status === "fulfilled") {
        setNearbyPlaces(placesResult.value);
      }

      const trailsFailed = trailsResult.status === "rejected";
      const placesFailed = placesResult.status === "rejected";

      if (trailsFailed && placesFailed) {
        setNearbyContentError("No hemos podido cargar las rutas ni los lugares de esta zona. Prueba de nuevo más tarde.");
      } else if (trailsFailed) {
        setNearbyContentError("Las rutas no están disponibles temporalmente. Se muestran los lugares encontrados.");
      } else if (placesFailed) {
        setNearbyContentError("Los lugares no están disponibles temporalmente. Se muestran las rutas encontradas.");
      }
    } finally {
      setIsLoadingNearbyContent(false);
      setHasSearchedNearbyContent(true);
    }
  };

  // Busca localidades a partir del texto introducido
  const handleLocationSearch = async (event) => {
    event.preventDefault();

    const normalizedSearch = searchTerm.trim();

    if (normalizedSearch.length < 3) {
      setLocationSearchError("Escribe al menos 3 caracteres.");

      return;
    }

    setIsSearchingLocation(true);

    setLocationSearchError("");

    setLocationResults([]);

    try {
      const results = await searchLocations(normalizedSearch);

      setLocationResults(results);

      if (results.length === 0) {
        setLocationSearchError("No hemos encontrado ninguna zona con ese nombre.");
      }
    } catch (error) {
      setLocationSearchError(error.message);
    } finally {
      setIsSearchingLocation(false);
    }
  };

  // Guarda la zona seleccionada y carga su contenido cercano
  const handleSelectLocation = (location) => {
    setPlannerError("");
    setPlannerSuccessMessage("");

    try {
      const updatedTrip = updateTrip({
        ...trip,
        destination: {
          ...trip.destination,
          latitude: location.latitude,
          longitude: location.longitude,
          locationLabel: location.label,
        },
      });

      setTrip(updatedTrip);
      setSearchTerm("");
      setLocationResults([]);
      setLocationSearchError("");
      setSelectedNearbyResult(null);
      setPlannerSuccessMessage(`Zona localizada: ${location.label}`);

      void loadNearbyContent(location);
    } catch {
      setPlannerError("No se ha podido guardar la zona seleccionada");
    }
  };

  // Añade una copia de la ruta a la escapada si todavía no existe
  const handleAddTrail = (trail) => {
    const alreadyAdded = trails.some((storedTrail) => String(storedTrail.id) === String(trail.id));

    if (alreadyAdded) return;

    const trailSnapshot = {
      id: trail.id,
      name: trail.name,
      distance: trail.distance,
      ascent: trail.ascent,
      descent: trail.descent,
      duration: trail.duration,
      from: trail.from,
      to: trail.to,
      center: trail.center,
      geometry: trail.geometry,
    };

    setPlannerError("");
    setPlannerSuccessMessage("");

    try {
      const updatedTrip = updateTrip({
        ...trip,
        trails: [...trails, trailSnapshot],
      });

      setTrip(updatedTrip);
      setPlannerSuccessMessage("Ruta añadida a la escapada.");
    } catch {
      setPlannerError("No se ha podido añadir la ruta a la escapada");
    }
  };

  // Añade una copia del lugar a la escapada si todavía no existe
  const handleAddPlace = (place) => {
    const alreadyAdded = places.some((storedPlace) => storedPlace.osmKey === place.osmKey);

    if (alreadyAdded) return;

    const placeSnapshot = {
      osmKey: place.osmKey,
      name: place.name,
      type: place.type,
      elevation: place.elevation,
      coordinates: place.coordinates,
      image: place.image,
    };

    setPlannerError("");
    setPlannerSuccessMessage("");
    try {
      const updatedTrip = updateTrip({
        ...trip,
        places: [...places, placeSnapshot],
      });

      setTrip(updatedTrip);
      setPlannerSuccessMessage("Lugar añadido a la escapada.");
    } catch {
      setPlannerError("No se ha podido añadir el lugar a la escapada");
    }
  };

  // Elimina una ruta guardada de la escapada
  const handleRemoveTrail = (trailId) => {
    setPlannerError("");
    setPlannerSuccessMessage("");

    try {
      const updatedTrip = updateTrip({
        ...trip,
        trails: trails.filter((trail) => String(trail.id) !== String(trailId)),
      });

      setTrip(updatedTrip);
      setPlannerSuccessMessage("Ruta eliminada de la escapada.");
    } catch {
      setPlannerError("No se ha podido eliminar la ruta de la escapada");
    }
  };

  // Elimina un lugar guardado de la escapada
  const handleRemovePlace = (osmKey) => {
    setPlannerError("");
    setPlannerSuccessMessage("");

    try {
      const updatedTrip = updateTrip({
        ...trip,
        places: places.filter((place) => place.osmKey !== osmKey),
      });

      setTrip(updatedTrip);
      setPlannerSuccessMessage("Lugar eliminado de la escapada.");
    } catch {
      setPlannerError("No se ha podido eliminar el lugar de la escapada");
    }
  };

  // Guarda las notas y mantiene el texto si el guardado falla
  const handleSaveNotes = () => {
    setNotesError("");
    setNotesSuccessMessage("");

    try {
      const updatedTrip = updateTrip({
        ...trip,
        notes: notes.trim(),
      });

      setTrip(updatedTrip);
      setNotesSuccessMessage("Notas guardadas correctamente.");
    } catch {
      setNotesError("No se han podido guardar las notas");
    }
  };

  return (
    <main>
      <section className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
        {/* Volver */}
        <Link to="/trips" className="inline-flex min-h-10 items-center font-semibold text-primary transition-colors hover:text-primary-dark">
          ← Volver a escapadas
        </Link>

        {/* Fondo general de la escapada */}
        <div className="mt-5">
          {/* Cabecera */}
          <header className="rounded-3xl border border-[#d6e3da] bg-surface p-6 sm:p-8">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#3f6b53]">{trip.destination?.name || "Destino por definir"}</p>

                <h1 className="mt-3 text-4xl font-bold tracking-tight text-text sm:text-5xl">{trip.name}</h1>

                {/* Fechas */}
                <div className="mt-5 inline-flex rounded-2xl border border-[#d6e3da] bg-[#f7faf8] px-4 py-3">
                  <p className="font-medium text-[#52675b]">
                    {formatDate(trip.startDate)}

                    {" → "}

                    {formatDate(trip.endDate)}
                  </p>
                </div>
              </div>

              {/* Resumen */}
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <span className="rounded-full bg-[#dfece2] px-4 py-2 text-sm font-semibold text-[#365947]">
                  {trails.length} {trails.length === 1 ? "ruta" : "rutas"}
                </span>

                <span className="rounded-full bg-[#dfece2] px-4 py-2 text-sm font-semibold text-[#365947]">
                  {places.length} {places.length === 1 ? "lugar" : "lugares"}
                </span>
              </div>
            </div>
          </header>

          {/* Planificador */}
          <section className="mt-8 rounded-3xl border border-[#d6e3da] bg-surface p-6 sm:p-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#3f6b53]">Planificador</p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-text">Prepara tu escapada</h2>

              <p className="mt-3 max-w-2xl leading-7 text-muted">Explora la zona, añade rutas y lugares y organiza todo lo que quieres hacer durante la salida.</p>
            </div>

            {/* Mensaje */}
            {plannerSuccessMessage && (
              <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-800" role="status">
                ✓ {plannerSuccessMessage}
              </div>
            )}
            {plannerError && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-800" role="alert">
                {plannerError}
              </div>
            )}

            {/* Planificador */}
            <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)]">
              {/* Panel izquierdo */}
              <div className="min-w-0 rounded-2xl border border-[#d6e3da] bg-[#f8fbf9] p-6">
                <h3 className="text-xl font-bold text-text">Explorar zona</h3>

                <p className="mt-2 leading-7 text-muted">Busca una ciudad, pueblo o zona natural para encontrar rutas y lugares cercanos.</p>

                {/* Buscador */}
                <div className="mt-6">
                  <label htmlFor="trip-search" className="font-medium text-text">
                    Buscar zona
                  </label>

                  <p className="mt-1 text-sm leading-6 text-muted">Busca una localidad cercana a la zona que quieres explorar.</p>

                  <form onSubmit={handleLocationSearch} className="mt-3 flex gap-2">
                    <input
                      id="trip-search"
                      type="search"
                      value={searchTerm}
                      onChange={(event) => {
                        setSearchTerm(event.target.value);

                        setLocationSearchError("");
                      }}
                      placeholder="Torla, Biescas, Sallent..."
                      className="min-w-0 flex-1 rounded-xl border border-[#d6e3da] bg-surface px-4 py-3 text-text outline-none transition focus:border-[#315f49]"
                    />

                    <button type="submit" disabled={isSearchingLocation} className="shrink-0 rounded-xl bg-[#315f49] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#244b39] disabled:cursor-not-allowed disabled:opacity-60">
                      {isSearchingLocation ? "Buscando..." : "Buscar"}
                    </button>
                  </form>

                  {/* Error */}
                  {locationSearchError && (
                    <p className="mt-3 text-sm font-medium text-red-700" role="alert">
                      {locationSearchError}
                    </p>
                  )}

                  {/* Resultados de localidades */}
                  {locationResults.length > 0 && (
                    <div className="mt-4 overflow-hidden rounded-xl border border-[#d6e3da] bg-surface">
                      {locationResults.map((location) => (
                        <button key={location.id} type="button" onClick={() => handleSelectLocation(location)} className="flex w-full items-start justify-between gap-4 border-b border-[#d6e3da] px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-[#edf4ef]">
                          <div>
                            <p className="font-semibold text-text">{location.name}</p>

                            <p className="mt-1 text-sm text-muted">{location.label}</p>
                          </div>

                          <span className="text-[#315f49]">→</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Zona localizada */}
                {hasDestinationCoordinates && (
                  <div className="mt-5 rounded-xl border border-[#d6e3da] bg-[#edf4ef] p-4">
                    <p className="text-sm font-semibold text-[#3f6b53]">Zona localizada</p>

                    <p className="mt-1 font-medium text-text">{trip.destination.locationLabel || trip.destination.name}</p>
                  </div>
                )}

                {/* Contenido */}
                <div className="mt-8 border-t border-[#d6e3da] pt-6">
                  <p className="font-semibold text-text">Contenido</p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleContentTypeChange("all")}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${contentType === "all" ? "bg-[#315f49] text-white" : "border border-[#c7d7cc] bg-surface text-text hover:border-[#8eae99] hover:bg-[#edf4ef]"}`}
                    >
                      Todos
                    </button>

                    <button
                      type="button"
                      onClick={() => handleContentTypeChange("trails")}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${contentType === "trails" ? "bg-[#315f49] text-white" : "border border-[#c7d7cc] bg-surface text-text hover:border-[#8eae99] hover:bg-[#edf4ef]"}`}
                    >
                      Rutas
                    </button>

                    <button
                      type="button"
                      onClick={() => handleContentTypeChange("places")}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${contentType === "places" ? "bg-[#315f49] text-white" : "border border-[#c7d7cc] bg-surface text-text hover:border-[#8eae99] hover:bg-[#edf4ef]"}`}
                    >
                      Lugares
                    </button>
                  </div>

                  {/* Explicación */}
                  {hasSearchedNearbyContent && !isLoadingNearbyContent && visibleNearbyResults.length > 0 && (
                    <div className="mt-5 rounded-xl bg-[#edf4ef] p-4">
                      <p className="text-sm leading-6 text-muted">
                        Añade las rutas y lugares que te interesen a tu escapada desde el botón <span className="font-semibold text-text">Añadir</span>.
                      </p>
                    </div>
                  )}

                  {/* Error API */}
                  {nearbyContentError && (
                    <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-800" role="status">
                      {nearbyContentError}
                    </div>
                  )}

                  {/* Estado inicial */}
                  {!hasSearchedNearbyContent && !isLoadingNearbyContent && (
                    <div className="mt-5 rounded-xl bg-[#edf4ef] p-4">
                      <p className="font-medium text-text">Busca una zona para empezar</p>

                      <p className="mt-2 text-sm leading-6 text-muted">Los resultados aparecerán junto al mapa.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Mapa + resultados */}
              <div className="min-w-0">
                <TripPlannerMap destination={trip.destination} trails={visibleNearbyTrails} places={visibleNearbyPlaces} selectedResult={selectedNearbyResult} onSelectResult={setSelectedNearbyResult} />

                <div className="mt-5 min-w-0">
                  {isLoadingNearbyContent && (
                    <div className="rounded-xl bg-[#edf4ef] p-5">
                      <p className="font-medium text-text">Buscando rutas y lugares...</p>

                      <p className="mt-2 text-sm leading-6 text-muted">Estamos consultando el contenido disponible en esta zona.</p>
                    </div>
                  )}

                  {!isLoadingNearbyContent && hasSearchedNearbyContent && (
                    <>
                      {visibleNearbyResults.length > 0 ? (
                        <NearbyResultsCarousel title="Resultados" items={visibleNearbyResults} trails={trails} places={places} selectedItem={selectedNearbyResult} onSelect={setSelectedNearbyResult} onAddTrail={handleAddTrail} onAddPlace={handleAddPlace} />
                      ) : (
                        !nearbyContentError && (
                          <div className="rounded-xl bg-[#edf4ef] p-5">
                            <p className="font-medium text-text">No hemos encontrado contenido</p>

                            <p className="mt-2 text-sm leading-6 text-muted">Prueba buscando otra localidad cercana o seleccionando otro tipo de contenido.</p>
                          </div>
                        )
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Tu plan */}
          <section className="mt-8 rounded-3xl border border-[#d6e3da] bg-surface p-6 sm:p-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#3f6b53]">Organización</p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-text">Tu plan</h2>

              <p className="mt-2 text-muted">Rutas y lugares que has añadido a esta escapada.</p>
            </div>

            <div className="mt-7 grid gap-6 lg:grid-cols-2">
              {/* Rutas */}
              <div className="rounded-2xl border border-[#d6e3da] bg-[#f8fbf9] p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-xl font-bold text-text">Rutas</h3>

                  <span className="rounded-full bg-[#dfece2] px-3 py-1.5 text-sm font-semibold text-[#365947]">{trails.length}</span>
                </div>

                {trails.length === 0 ? (
                  <p className="mt-5 leading-7 text-muted">Todavía no has añadido ninguna ruta.</p>
                ) : (
                  <div className="mt-5 space-y-3">
                    {trails.map((trail) => (
                      <article key={trail.id} className="flex items-center justify-between gap-4 rounded-xl bg-[#eef2ee] px-4 py-3">
                        {/* Información */}
                        <div className="min-w-0">
                          <Link to={`/routes/${trail.id}`} className="font-semibold leading-6 text-text transition-colors hover:text-primary">
                            {trail.name}
                          </Link>

                          <div className="mt-0.5 flex flex-wrap gap-x-3 text-sm text-muted">
                            {trail.distance !== null && trail.distance !== undefined && <span>{trail.distance} km</span>}

                            {trail.ascent !== null && trail.ascent !== undefined && <span>+{trail.ascent} m</span>}
                          </div>
                        </div>

                        {/* Quitar */}
                        <button type="button" onClick={() => handleRemoveTrail(trail.id)} className="inline-flex min-h-10 shrink-0 items-center rounded-lg px-3 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 hover:text-red-800">
                          Quitar
                        </button>
                      </article>
                    ))}
                  </div>
                )}
              </div>

              {/* Lugares */}
              <div className="rounded-2xl border border-[#d6e3da] bg-[#f8fbf9] p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-xl font-bold text-text">Lugares</h3>

                  <span className="rounded-full bg-[#dfece2] px-3 py-1.5 text-sm font-semibold text-[#365947]">{places.length}</span>
                </div>

                {places.length === 0 ? (
                  <p className="mt-5 leading-7 text-muted">Todavía no has añadido ningún lugar.</p>
                ) : (
                  <div className="mt-5 space-y-3">
                    {places.map((place) => (
                      <article key={place.osmKey} className="flex items-center justify-between gap-4 rounded-xl bg-[#eef2ee] px-4 py-3">
                        {/* Información */}
                        <div className="min-w-0">
                          <Link to={`/places/${place.osmKey}`} className="font-semibold leading-6 text-text transition-colors hover:text-primary">
                            {place.name}
                          </Link>

                          {place.elevation !== null && place.elevation !== undefined && <p className="mt-0.5 text-sm text-muted">Altitud {place.elevation} m</p>}
                        </div>

                        {/* Quitar */}
                        <button type="button" onClick={() => handleRemovePlace(place.osmKey)} className="inline-flex min-h-10 shrink-0 items-center rounded-lg px-3 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 hover:text-red-800">
                          Quitar
                        </button>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Meteorología */}
          <div className="mt-8 rounded-3xl border border-[#d6e3da] bg-surface px-6 pb-8 sm:px-8 [&>section]:mt-0 [&>section]:pt-8">
            <TripWeather trip={trip} />
          </div>

          {/* Notas */}
          <section className="mt-8 rounded-3xl border border-[#d6e3da] bg-surface p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#3f6b53]">Organización</p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-text">Notas</h2>

            <p className="mt-2 max-w-2xl leading-7 text-muted">Guarda cualquier información que necesites recordar para esta salida.</p>

            <div className="mt-6 rounded-2xl border border-[#d6e3da] bg-[#f8fbf9] p-5 sm:p-6">
              <label htmlFor="trip-notes" className="sr-only">
                Notas de la escapada
              </label>

              <textarea
                id="trip-notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows="6"
                placeholder="Alojamiento, material, horarios, recordatorios..."
                className="w-full resize-y rounded-xl border border-[#d6e3da] bg-[#eef2ee] px-4 py-3 leading-7 text-text outline-none transition-colors placeholder:text-muted focus:border-[#315f49] focus:bg-surface"
              />

              <div className="mt-4 flex justify-end">
                <button type="button" onClick={handleSaveNotes} className="rounded-full bg-[#315f49] px-5 py-2.5 font-semibold text-white transition-colors hover:bg-[#244b39]">
                  Guardar notas
                </button>
              </div>
            </div>

            {notesSuccessMessage && (
              <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-800" role="status">
                ✓ {notesSuccessMessage}
              </div>
            )}

            {notesError && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800" role="alert">
                {notesError}
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}

export default TripDetail;
