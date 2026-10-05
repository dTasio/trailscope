// Endpoint público de Overpass para consultar datos de OpenStreetMap
const OVERPASS_API_URL =
  "https://overpass-api.de/api/interpreter";

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

  const response = await fetch(OVERPASS_API_URL, {
    method: "POST",
    headers: {
      "Content-Type":
        "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      data: query,
    }),
  });

  if (!response.ok) {
    if (response.status === 504) {
      throw new Error(
        "El servicio de lugares está tardando demasiado en responder. Prueba de nuevo en unos segundos o busca en una zona más pequeña."
      );
    }

    throw new Error(
      "No se han podido consultar los lugares naturales."
    );
  }

  const data = await response.json();

  return data.elements
    .map((element) => {
      const coordinates =
        getPlaceCoordinates(element);

      const type =
        getPlaceType(element.tags);

      return {
        id: element.id,
        osmType: element.type,

        name:
          element.tags?.name?.trim() || null,

        type,

        coordinates,

        description:
          element.tags?.description ?? null,

        elevation:
          element.tags?.ele ?? null,

        wikidata:
          element.tags?.wikidata ?? null,

        wikipedia:
          element.tags?.wikipedia ?? null,
      };
    })
    .filter(
      (place) =>
        place.name !== null &&
        place.type !== null &&
        place.coordinates !== null
    );
}