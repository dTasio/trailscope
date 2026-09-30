const OVERPASS_API_URL = "https://overpass-api.de/api/interpreter";

export async function getHikingTrails(bounds) {
  const { north, south, east, west } = bounds;

  const query = `
    [out:json][timeout:25];

    relation
      ["type"="route"]
      ["route"="hiking"]
      (${south},${west},${north},${east});

    out tags center 30;
  `;

  const response = await fetch(OVERPASS_API_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: new URLSearchParams({
    data: query,
  }),
});

if (!response.ok) {
  throw new Error("Error al consultar las rutas");
}

const data = await response.json();

return data.elements.map((element) => ({
  id: element.id,
  name: element.tags?.name ?? "Ruta sin nombre",
  distance: element.tags?.distance ?? null,
  description: element.tags?.description ?? null,
  network: element.tags?.network ?? null,
  operator: element.tags?.operator ?? null,
  roundtrip: element.tags?.roundtrip ?? null,
  center: element.center
    ? {
        longitude: element.center.lon,
        latitude: element.center.lat,
      }
    : null,
}));
}