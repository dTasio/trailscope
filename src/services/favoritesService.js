import {getStoredData, setStoredData} from "./storageService.js";

// Clave utilizada para guardar todos los favoritos de TrailScope
const FAVORITES_KEY =
  "trailscope-favorites";

// Recupera los favoritos guardados
// Si el contenido almacenado no es una lista válida, devuelve una lista vacía
export function getFavorites() {
  const favorites = getStoredData(
    FAVORITES_KEY,
    []
  );

  return Array.isArray(favorites)
    ? favorites
    : [];
}

// Comprueba si una ruta o lugar ya está guardado como favorito
export function isFavorite(favoriteId) {
  const favorites = getFavorites();

  return favorites.some(
    (favorite) =>
      favorite.favoriteId === favoriteId
  );
}

// Añade un favorito solo si todavía no existe
export function addFavorite(favorite) {
  const favorites = getFavorites();

  const alreadyExists = favorites.some(
    (storedFavorite) =>
      storedFavorite.favoriteId ===
      favorite.favoriteId
  );

  if (alreadyExists) {
    return favorites;
  }

  const updatedFavorites = [
    ...favorites,
    favorite,
  ];

  setStoredData(
    FAVORITES_KEY,
    updatedFavorites
  );

  return updatedFavorites;
}

// Elimina el favorito que coincide con el identificador recibido
export function removeFavorite(favoriteId) {
  const favorites = getFavorites();

  const updatedFavorites =
    favorites.filter(
      (favorite) =>
        favorite.favoriteId !==
        favoriteId
    );

  setStoredData(
    FAVORITES_KEY,
    updatedFavorites
  );

  return updatedFavorites;
}