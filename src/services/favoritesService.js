import { getStoredData, setStoredData} from "./storageService.js";

const FAVORITES_KEY =
  "trailscope-favorites";

export function getFavorites() {
  const favorites = getStoredData(
    FAVORITES_KEY,
    []
  );

  return Array.isArray(favorites)
    ? favorites
    : [];
}

export function isFavorite(favoriteId) {
  const favorites = getFavorites();

  return favorites.some(
    (favorite) =>
      favorite.favoriteId === favoriteId
  );
}

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