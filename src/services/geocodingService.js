const GEOCODING_API_URL = "https://geocoding-api.open-meteo.com/v1/search";

// Busca hasta cinco localidades de España para situar la escapada
export async function searchLocations(query) {
  const normalizedQuery = query.trim();

  if (normalizedQuery.length < 3) {
    return [];
  }

  const params = new URLSearchParams({
    name: normalizedQuery,
    count: "5",
    language: "es",
    format: "json",
    countryCode: "ES",
  });

  const response = await fetch(`${GEOCODING_API_URL}?${params}`);

  if (!response.ok) {
    throw new Error("No se ha podido buscar la zona.");
  }

  const data = await response.json();

  return (data.results ?? []).map((location) => {
    const labelParts = [location.name, location.admin2, location.admin1].filter(Boolean);
    const label = [...new Set(labelParts)].join(" · ");

    return {
      id: location.id,
      name: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
      admin1: location.admin1 ?? null,
      admin2: location.admin2 ?? null,
      country: location.country ?? null,
      label,
    };
  });
}