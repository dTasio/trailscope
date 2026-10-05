import { runOverpassQuery } from "./overpassClient";

const MIN_TRAIL_DISTANCE_KM = 1;
const MAX_TRAIL_DISTANCE_KM = 30;

// Extrae las geometrías de los caminos que forman una ruta
function getRouteLines(members = []) {
  return members
    .filter(
      (member) =>
        member.type === "way" &&
        Array.isArray(member.geometry)
    )
    .map((member) =>
      member.geometry.map((point) => [
        point.lon,
        point.lat,
      ])
    )
    .filter((line) => line.length >= 2);
}

// Calcula un centro aproximado a partir de la geometría de la ruta
function getRouteCenter(lines) {
  const coordinates = lines.flat();

  if (coordinates.length === 0) {
    return null;
  }

  const longitudes = coordinates.map(
    ([longitude]) => longitude
  );

  const latitudes = coordinates.map(
    ([, latitude]) => latitude
  );

  const west = Math.min(...longitudes);
  const east = Math.max(...longitudes);
  const south = Math.min(...latitudes);
  const north = Math.max(...latitudes);

  return {
    longitude: (west + east) / 2,
    latitude: (south + north) / 2,
  };
}

// Convierte la distancia de OpenStreetMap a kilómetros numéricos
function normalizeDistanceKm(distanceValue) {
  if (distanceValue == null) {
    return null;
  }

  const normalizedValue = String(distanceValue)
    .trim()
    .toLowerCase()
    .replace(",", ".");

  const match = normalizedValue.match(/\d+(?:\.\d+)?/);

  if (!match) {
    return null;
  }

  const distance = Number(match[0]);

  if (!Number.isFinite(distance)) {
    return null;
  }

  return distance;
}

// Obtiene rutas de senderismo dentro de una zona concreta del mapa
export async function getHikingTrails(bounds) {
  const { north, south, east, west } = bounds;

  // Busca relaciones de senderismo y solicita su geometría
  const query = `
    [out:json][timeout:25];

    relation
  ["type"="route"]
  ["route"="hiking"]
  ["name"]
  ["distance"]
  (${south},${west},${north},${east});

    out body geom 30;
  `;

  // Ejecuta la consulta utilizando el cliente común de Overpass
  const data = await runOverpassQuery(query);

// Transformamos Overpass al formato utilizado por TrailScope
return data.elements
  .map((element) => {
    const lines = getRouteLines(element.members);

    const name = element.tags?.name?.trim() || null;

    const distance = normalizeDistanceKm(
      element.tags?.distance
    );

    const geometry =
      lines.length > 0
        ? {
            type: "MultiLineString",
            coordinates: lines,
          }
        : null;

    return {
      id: element.id,
      name,
      distance,
      description:
        element.tags?.description ?? null,
      network:
        element.tags?.network ?? null,
      operator:
        element.tags?.operator ?? null,
      roundtrip:
        element.tags?.roundtrip ?? null,

      center: getRouteCenter(lines),

      geometry,
    };
  })
  .filter(
    (trail) =>
      trail.name !== null &&
      trail.geometry !== null &&
      trail.distance !== null &&
      trail.distance >= MIN_TRAIL_DISTANCE_KM &&
      trail.distance <= MAX_TRAIL_DISTANCE_KM
  );
}