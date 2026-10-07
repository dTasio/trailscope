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

// Extrae la geometría de los ways completos que forman una ruta
function getRouteLinesFromWays(ways = []) {
  return ways
    .filter((way) =>
      Array.isArray(way.geometry)
    )
    .map((way) =>
      way.geometry.map((point) => [
        point.lon,
        point.lat,
      ])
    )
    .filter((line) => line.length >= 2);
}

// Obtiene los diferentes valores de una etiqueta presente en los caminos que forman la ruta
function getUniqueWayTagValues(ways = [],tagName) {
  if (!Array.isArray(ways)) {
    return [];
  }

  return [
    //eliminar duplicados
    ...new Set(
      ways
        .map((way) => way.tags?.[tagName])
        .filter(Boolean)
    ),
  ];
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

// Convierte valores de elevación o desnivel a metros numericos
function normalizeMeters(value) {
  if (value == null) {
    return null;
  }

  const normalizedValue = String(value)
    .trim()
    .toLowerCase()
    .replace(",", ".");

  const match =
    normalizedValue.match(/\d+(?:\.\d+)?/);

  if (!match) {
    return null;
  }

  const meters = Number(match[0]);

  return Number.isFinite(meters)
    ? meters
    : null;
}

// Convierte una relación de OpenStreetMap al formato de ruta utilizado por TrailScope
function normalizeTrail(element, routeWays = []) {
  const lines =
  routeWays.length > 0
    ? getRouteLinesFromWays(routeWays)
    : getRouteLines(element.members);

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

  name:
    element.tags?.name?.trim() || null,

  distance: normalizeDistanceKm(
    element.tags?.distance
  ),

  ascent: normalizeMeters(
    element.tags?.ascent
  ),

  descent: normalizeMeters(
    element.tags?.descent
  ),

  duration:
    element.tags?.duration?.trim() ?? null,

  description:
    element.tags?.description?.trim() ?? null,

  from:
    element.tags?.from?.trim() ?? null,

  to:
    element.tags?.to?.trim() ?? null,

  website:
    element.tags?.website?.trim() ?? null,

  wikipedia:
    element.tags?.wikipedia?.trim() ?? null,

  wikidata:
    element.tags?.wikidata?.trim() ?? null,

  wikimediaCommons:
    element.tags?.wikimedia_commons?.trim() ??
    null,

  image:
    element.tags?.image?.trim() ?? null,

  surface: getUniqueWayTagValues(
    routeWays,
    "surface"
  ),

  trailVisibility: getUniqueWayTagValues(
    routeWays,
    "trail_visibility"
  ),

  sacScale: getUniqueWayTagValues(
    routeWays,
    "sac_scale"
  ),

  center: getRouteCenter(lines),

  geometry:
    lines.length > 0
      ? {
          type: "MultiLineString",
          coordinates: lines,
        }
      : null,
};
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
  .map((element) => normalizeTrail(element))
  .filter(
    (trail) =>
      trail.name !== null &&
      trail.geometry !== null &&
      trail.distance !== null &&
      trail.distance >= MIN_TRAIL_DISTANCE_KM &&
      trail.distance <= MAX_TRAIL_DISTANCE_KM
  );
}

// Obtiene una ruta concreta y sus caminos a partir de su ID de OpenStreetMap
export async function getHikingTrailById(id) {

  const query = `
    [out:json][timeout:25];

  relation(${id})->.route;

  .route out body;

  way(r.route);

  out body geom;
  `;

  const data = await runOverpassQuery(query);

  const route = data.elements.find(
  (element) => element.type === "relation"
  );

  const routeWays = data.elements.filter(
    (element) => element.type === "way"
  );

  if (!route) {
    throw new Error("No se ha encontrado esta ruta.");
  }

  return normalizeTrail(route, routeWays);
}