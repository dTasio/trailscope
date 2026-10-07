import { runOverpassQuery } from "./overpassClient";

// Determina qué categoría de TrailScope corresponde a un elemento de OSM
function getPlaceType(tags = {}) {
  if (tags.waterway === "waterfall") {
    return "waterfall";
  }

  if (tags.tourism === "viewpoint") {
    return "viewpoint";
  }

  if (
    tags.natural === "water" &&
    tags.water === "lake"
  ) {
    return "lake";
  }

  return null;
}

// Obtiene las coordenadas de un elemento de OpenStreetMap
function getPlaceCoordinates(element) {
  // Los nodos tienen latitud y longitud directamente
  if (
    typeof element.lon === "number" &&
    typeof element.lat === "number"
  ) {
    return {
      longitude: element.lon,
      latitude: element.lat,
    };
  }

  // Ways y relations pueden devolver un centro calculado por Overpass
  if (element.center) {
    return {
      longitude: element.center.lon,
      latitude: element.center.lat,
    };
  }

  return null;
}

function normalizePlace(element) {
  const tags = element.tags ?? {};

  const type = getPlaceType(tags);
  const coordinates =
    getPlaceCoordinates(element);

  return {
    id: element.id,
    osmType: element.type,
    osmKey: `${element.type}-${element.id}`,

    name: tags.name?.trim() || null,
    type,
    coordinates,

    // Información general
    description:
      tags.description?.trim() ?? null,

    elevation:
      normalizeMeters(tags.ele),

    website:
      tags.website?.trim() ?? null,

    wikipedia:
      tags.wikipedia?.trim() ?? null,

    wikidata:
      tags.wikidata?.trim() ?? null,

    wikimediaCommons:
      tags.wikimedia_commons?.trim() ?? null,

    image:
      tags.image?.trim() ?? null,

    // Información de visita
    access:
      tags.access?.trim() ?? null,

    wheelchair:
      tags.wheelchair?.trim() ?? null,

    fee:
      tags.fee?.trim() ?? null,

    charge:
      tags.charge?.trim() ?? null,

    openingHours:
      tags.opening_hours?.trim() ?? null,

    seasonal:
      tags.seasonal?.trim() ?? null,

    intermittent:
      tags.intermittent?.trim() ?? null,

    // Cascadas
    height:
      type === "waterfall"
        ? normalizeMeters(tags.height)
        : null,

    width:
      type === "waterfall"
        ? normalizeMeters(tags.width)
        : null,

    // Miradores
    direction:
      type === "viewpoint"
        ? tags.direction?.trim() ?? null
        : null,

    viewpointType:
      type === "viewpoint"
        ? tags.viewpoint?.trim() ?? null
        : null,

    // Lagos
    salt:
      type === "lake"
        ? tags.salt?.trim() ?? null
        : null,
  };
}

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

// Obtiene lugares naturales dentro de una zona concreta del mapa
export async function getNaturalPlaces(bounds) {
  const { north, south, east, west } = bounds;

  const query = `
    [out:json][timeout:20];

    (
      nwr
        ["waterway"="waterfall"]
        ["name"]
        (${south},${west},${north},${east});

      nwr
        ["tourism"="viewpoint"]
        ["name"]
        (${south},${west},${north},${east});

      nwr
        ["natural"="water"]
        ["water"="lake"]
        ["name"]
        (${south},${west},${north},${east});
    );

    out body center 50;
  `;

  // Ejecuta la consulta utilizando el cliente común de Overpass
  const data = await runOverpassQuery(query);

  return data.elements
  .map((element) => normalizePlace(element))
  .filter(
    (place) =>
      place.name !== null &&
      place.type !== null &&
      place.coordinates !== null
  );
    
}

export async function getNaturalPlaceByKey(osmKey) {

  const [osmType, id] = osmKey.split("-");

  const validTypes = [
  "node",
  "way",
  "relation",
  ];

  if (!validTypes.includes(osmType)) {
    throw new Error(
      "El tipo de lugar no es válido."
    );
  }

  const query = `
    [out:json][timeout:20];

    ${osmType}(${id});

    out body center;
  `;

  const data =
    await runOverpassQuery(query);

  const place = data.elements[0];

  if (!place) {
    throw new Error(
      "No se ha encontrado este lugar."
    );
  }

  return normalizePlace(place);

}