import { useEffect, useState } from "react";
import { Link } from "react-router";

import { getFavorites, removeFavorite } from "../services/favoritesService.js";

import AddToTripModal from "../components/trips/AddToTripModal.jsx";

import routeDefaultImage from "../assets/images/route-default.jpg";
import placeDefaultImage from "../assets/images/place-default.jpg";

import { formatPlaceName, formatPlaceType } from "../utils/placeFormatters.js";

function Favorites() {
  // Favoritos guardados y posibles errores al eliminarlos
  const [favorites, setFavorites] = useState(() => getFavorites());
  const [favoriteError, setFavoriteError] = useState("");

  // Contenido seleccionado para añadir a una escapada
  const [tripModalContent, setTripModalContent] = useState(null);
  const [tripSuccessMessage, setTripSuccessMessage] = useState("");

  // Separa los favoritos entre rutas y lugares
  const trailFavorites = favorites.filter((favorite) => favorite.contentType === "trail");
  const placeFavorites = favorites.filter((favorite) => favorite.contentType === "place");
  const hasFavorites = favorites.length > 0;

  // Oculta el mensaje de escapada después de 3 segundos
  useEffect(() => {
    if (!tripSuccessMessage) return;

    const timeoutId = setTimeout(() => {
      setTripSuccessMessage("");
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [tripSuccessMessage]);

  // Elimina un favorito solo si el guardado funciona
  const handleRemoveFavorite = (favoriteId) => {
    setFavoriteError("");

    try {
      const updatedFavorites = removeFavorite(favoriteId);

      setFavorites(updatedFavorites);
    } catch {
      setFavoriteError("No se ha podido quitar el favorito");
    }
  };

  // Abre el selector de escapadas con la ruta o lugar elegido
  const handleOpenTripModal = (item, type) => {
    setTripModalContent({
      item,
      type,
    });
  };

  // Cierra el selector de escapadas
  const handleCloseTripModal = () => {
    setTripModalContent(null);
  };

  // Muestra la confirmación después de añadir contenido a una escapada
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

        {/* Confirmación */}
        {tripSuccessMessage && (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-800" role="status">
            ✓ {tripSuccessMessage}
          </div>
        )}

        {favoriteError && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-800" role="alert">
            {favoriteError}
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
            {/* Cabecera */}
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Senderismo</p>

                <h2 className="mt-2 text-2xl font-bold tracking-tight text-text">Rutas favoritas</h2>
              </div>

              <div className="shrink-0 rounded-xl border border-[#b8cbbf] bg-[#edf4ef] px-4 py-2.5 text-center">
                <p className="text-xl font-bold leading-none text-[#214b3c]">{trailFavorites.length}</p>

                <p className="mt-1 text-xs font-medium text-[#52705f]">guardadas</p>
              </div>
            </div>

            {/* Cards */}
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {trailFavorites.map((trail) => (
                <article key={trail.favoriteId} className="group flex overflow-hidden rounded-2xl border border-[#c7d7cc] bg-[#f2f7f3] transition duration-200 hover:-translate-y-1 hover:border-[#8eae99] hover:shadow-md">
                  <div className="flex w-full flex-col">
                    <img src={routeDefaultImage} alt={`Paisaje de la ruta ${trail.name}`} className="aspect-4/3 w-full object-cover" />

                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#3f6b53]">Ruta guardada</p>

                      <h3 className="mt-2 text-xl font-bold tracking-tight text-[#102d23]">{trail.name}</h3>

                      {(trail.from || trail.to) && (
                        <p className="mt-2 text-sm leading-6 text-[#5d7065]">
                          {trail.from ?? "Inicio"}
                          {trail.to && ` → ${trail.to}`}
                        </p>
                      )}

                      {/* Métricas */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {trail.distance !== null && trail.distance !== undefined && (
                          <span className="rounded-full bg-[#dfece2] px-3 py-1.5 text-sm font-medium text-[#365947]">
                            {trail.distance.toLocaleString("es-ES", {
                              maximumFractionDigits: 1,
                            })}{" "}
                            km
                          </span>
                        )}

                        {trail.ascent !== null && trail.ascent !== undefined && <span className="rounded-full bg-[#dfece2] px-3 py-1.5 text-sm font-medium text-[#365947]">+{trail.ascent} m</span>}

                        {trail.duration && <span className="rounded-full bg-[#dfece2] px-3 py-1.5 text-sm font-medium text-[#365947]">{trail.duration}</span>}
                      </div>

                      {/* Acciones */}
                      <div className="mt-auto pt-6">
                        <div className="flex items-center justify-between gap-4">
                          <Link to={`/routes/${trail.id}`} className="-mx-2 inline-flex min-h-11 items-center px-2 font-semibold text-[#2f654c] underline transition-colors hover:text-[#193c2d]">
                            Explorar ruta →
                          </Link>

                          <button type="button" onClick={() => handleRemoveFavorite(trail.favoriteId)} className="-mx-2 inline-flex min-h-11 items-center rounded-lg px-2 text-sm font-medium text-[#66776d] transition-colors hover:bg-red-50 hover:text-red-700">
                            Quitar
                          </button>
                        </div>

                        <button type="button" onClick={() => handleOpenTripModal(trail, "trail")} className="mt-4 w-full rounded-full bg-[#315f49] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#244b39]">
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
            {/* Cabecera */}
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#3f6b53]">Naturaleza</p>

                <h2 className="mt-2 text-2xl font-bold tracking-tight text-text">Lugares favoritos</h2>
              </div>

              {/* Contador */}
              <div className="shrink-0 rounded-xl border border-[#b8cbbf] bg-[#edf4ef] px-4 py-2.5 text-center">
                <p className="text-xl font-bold leading-none text-[#214b3c]">{placeFavorites.length}</p>

                <p className="mt-1 text-xs font-medium text-[#52705f]">guardados</p>
              </div>
            </div>

            {/* Cards */}
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {placeFavorites.map((place) => {
                const displayName = formatPlaceName(place.name, place.type);
                const displayType = formatPlaceType(place.type);

                return (
                  <article key={place.favoriteId} className="group flex overflow-hidden rounded-2xl border border-[#c7d7cc] bg-[#f2f7f3] transition duration-200 hover:-translate-y-1 hover:border-[#8eae99] hover:shadow-md">
                    <div className="flex w-full flex-col">
                      {/* Imagen */}
                      <img src={place.image || placeDefaultImage} alt={displayName} className="aspect-4/3 w-full object-cover" />

                      {/* Contenido */}
                      <div className="flex flex-1 flex-col p-5">
                        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#3f6b53]">{displayType}</p>

                        <h3 className="mt-2 text-xl font-bold tracking-tight text-[#102d23]">{displayName}</h3>

                        {/* Métricas */}
                        <div className="mt-4 flex flex-wrap gap-2">{place.elevation !== null && place.elevation !== undefined && <span className="rounded-full bg-[#dfece2] px-3 py-1.5 text-sm font-medium text-[#365947]">Altitud {place.elevation} m</span>}</div>

                        {/* Acciones */}
                        <div className="mt-auto pt-6">
                          <div className="flex items-center justify-between gap-4">
                            <Link to={`/places/${place.osmKey}`} className="-mx-2 inline-flex min-h-11 items-center px-2 font-semibold text-[#2f654c] transition-colors hover:text-[#193c2d]">
                              Explorar lugar →
                            </Link>

                            <button type="button" onClick={() => handleRemoveFavorite(place.favoriteId)} className="-mx-2 inline-flex min-h-11 items-center rounded-lg px-2 text-sm font-medium text-[#66776d] transition-colors hover:bg-red-50 hover:text-red-700">
                              Quitar
                            </button>
                          </div>

                          <button type="button" onClick={() => handleOpenTripModal(place, "place")} className="mt-4 w-full rounded-full bg-[#315f49] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#244b39]">
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
