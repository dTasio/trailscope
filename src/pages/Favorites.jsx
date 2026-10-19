import { useEffect, useState } from "react";

import { Link } from "react-router";

import { getFavorites, removeFavorite } from "../services/favoritesService.js";

import AddToTripModal from "../components/trips/AddToTripModal.jsx";

import routeDefaultImage from "../assets/images/route-default.jpg";
import placeDefaultImage from "../assets/images/place-default.jpg";

import { formatPlaceName, formatPlaceType } from "../utils/placeFormatters.js";

function Favorites() {
  const [favorites, setFavorites] = useState(() => getFavorites());

  const [tripModalContent, setTripModalContent] = useState(null);

  const [tripSuccessMessage, setTripSuccessMessage] = useState("");

  const trailFavorites = favorites.filter((favorite) => favorite.contentType === "trail");

  const placeFavorites = favorites.filter((favorite) => favorite.contentType === "place");

  const hasFavorites = favorites.length > 0;

  /*
   * Ocultar confirmación
   * automáticamente.
   */
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

  /*
   * Eliminar favorito.
   */
  const handleRemoveFavorite = (favoriteId) => {
    const updatedFavorites = removeFavorite(favoriteId);

    setFavorites(updatedFavorites);
  };

  /*
   * Abrir el selector de
   * escapadas para una ruta
   * o un lugar.
   */
  const handleOpenTripModal = (item, type) => {
    setTripModalContent({
      item,
      type,
    });
  };

  /*
   * Cerrar modal.
   */
  const handleCloseTripModal = () => {
    setTripModalContent(null);
  };

  /*
   * Confirmación al añadir
   * contenido a una escapada.
   */
  const handleAddedToTrip = (trip) => {
    const contentLabel = tripModalContent?.type === "trail" ? "Ruta" : "Lugar";

    setTripSuccessMessage(`${contentLabel} añadido a "${trip.name}".`);
  };

  return (
    <main>
      <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
        {/* Cabecera */}
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Tu selección</p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-text sm:text-5xl">Favoritos</h1>

          <p className="mt-5 text-lg leading-8 text-muted">Guarda las rutas y lugares que más te interesen para encontrarlos fácilmente cuando quieras preparar una nueva salida.</p>
        </div>

        {/* Resumen */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <p className="text-3xl font-bold text-text">{trailFavorites.length}</p>

            <p className="mt-1 text-sm text-muted">Rutas favoritas</p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6">
            <p className="text-3xl font-bold text-text">{placeFavorites.length}</p>

            <p className="mt-1 text-sm text-muted">Lugares favoritos</p>
          </div>
        </div>

        {/* Confirmación */}
        {tripSuccessMessage && (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-800" role="status">
            ✓ {tripSuccessMessage}
          </div>
        )}

        {/* Estado vacío */}
        {!hasFavorites && (
          <div className="mt-10 rounded-3xl border border-border bg-surface p-8 text-center sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface-secondary text-2xl">♡</div>

            <h2 className="mt-5 text-2xl font-bold tracking-tight text-text">Todavía no tienes favoritos</h2>

            <p className="mx-auto mt-3 max-w-lg leading-7 text-muted">Explora rutas y lugares naturales y guarda los que quieras tener a mano.</p>

            <Link to="/explore" className="mt-7 inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark">
              Explorar rutas y lugares
            </Link>
          </div>
        )}

        {/* Rutas favoritas */}
        {trailFavorites.length > 0 && (
          <section className="mt-14">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Senderismo</p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-text">Rutas favoritas</h2>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {trailFavorites.map((trail) => (
                <article key={trail.favoriteId} className="flex overflow-hidden rounded-2xl border border-border bg-surface">
                  <div className="flex w-full flex-col">
                    <img src={routeDefaultImage} alt={`Paisaje de la ruta ${trail.name}`} className="aspect-4/3 w-full object-cover" />

                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary">Ruta</p>

                      <h3 className="mt-2 text-xl font-bold tracking-tight text-text">{trail.name}</h3>

                      {(trail.from || trail.to) && (
                        <p className="mt-2 text-sm leading-6 text-muted">
                          {trail.from ?? "Inicio"}

                          {trail.to && ` → ${trail.to}`}
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted">
                        {trail.distance !== null && trail.distance !== undefined && (
                          <span>
                            {trail.distance.toLocaleString("es-ES", {
                              maximumFractionDigits: 1,
                            })}{" "}
                            km
                          </span>
                        )}

                        {trail.ascent !== null && trail.ascent !== undefined && <span>+{trail.ascent} m</span>}

                        {trail.duration && <span>{trail.duration}</span>}
                      </div>

                      {/* Acciones */}
                      <div className="mt-auto pt-6">
                        <div className="flex items-center justify-between gap-4">
                          <Link to={`/routes/${trail.id}`} className="font-semibold text-primary transition-colors hover:text-primary-dark">
                            Ver detalle →
                          </Link>

                          <button type="button" onClick={() => handleRemoveFavorite(trail.favoriteId)} className="text-sm font-medium text-muted transition-colors hover:text-red-700">
                            Quitar
                          </button>
                        </div>

                        <button type="button" onClick={() => handleOpenTripModal(trail, "trail")} className="mt-4 w-full rounded-full border border-border px-4 py-2.5 text-sm font-semibold text-text transition-colors hover:border-primary hover:text-primary">
                          + Añadir a escapada
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Lugares favoritos */}
        {placeFavorites.length > 0 && (
          <section className="mt-14">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Naturaleza</p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-text">Lugares favoritos</h2>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {placeFavorites.map((place) => {
                const displayName = formatPlaceName(place.name, place.type);

                const displayType = formatPlaceType(place.type);

                return (
                  <article key={place.favoriteId} className="flex overflow-hidden rounded-2xl border border-border bg-surface">
                    <div className="flex w-full flex-col">
                      <img src={place.image || placeDefaultImage} alt={displayName} className="aspect-4/3 w-full object-cover" />

                      <div className="flex flex-1 flex-col p-5">
                        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary">{displayType}</p>

                        <h3 className="mt-2 text-xl font-bold tracking-tight text-text">{displayName}</h3>

                        {place.elevation !== null && place.elevation !== undefined && <p className="mt-3 text-sm text-muted">Altitud {place.elevation} m</p>}

                        {/* Acciones */}
                        <div className="mt-auto pt-6">
                          <div className="flex items-center justify-between gap-4">
                            <Link to={`/places/${place.osmKey}`} className="font-semibold text-primary transition-colors hover:text-primary-dark">
                              Ver detalle →
                            </Link>

                            <button type="button" onClick={() => handleRemoveFavorite(place.favoriteId)} className="text-sm font-medium text-muted transition-colors hover:text-red-700">
                              Quitar
                            </button>
                          </div>

                          <button type="button" onClick={() => handleOpenTripModal(place, "place")} className="mt-4 w-full rounded-full border border-border px-4 py-2.5 text-sm font-semibold text-text transition-colors hover:border-primary hover:text-primary">
                            + Añadir a escapada
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* Modal compartido */}
        {tripModalContent && <AddToTripModal isOpen={true} onClose={handleCloseTripModal} item={tripModalContent.item} type={tripModalContent.type} onAdded={handleAddedToTrip} />}
      </section>
    </main>
  );
}

export default Favorites;
