// Instancias públicas de Overpass utilizadas por TrailScope, si la principal falla temporalmente, se prueba la siguiente
const OVERPASS_API_URLS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
];

const RETRYABLE_STATUS_CODES = [
  429,
  502,
  503,
  504,
];

// Ejecuta una consulta Overpass utilizando fallback entre distintas instancias públicas
export async function runOverpassQuery(query) {
  for (const apiUrl of OVERPASS_API_URLS) {
    let response;

    try {
      response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          data: query,
        }),
      });
    } catch {
        // Si hay un error de red, prueba la siguiente instancia
      continue;
    }

    if (response.ok) {
      return response.json();
    }

    if (RETRYABLE_STATUS_CODES.includes(response.status)) {
        // Si el error es temporal, prueba la siguiente instancia
      continue;
    }

    throw new Error(
      `Error al consultar Overpass (${response.status}).`
    );
  }

  // Ninguna de las instancias ha respondido correctamente
  throw new Error(
    "El servicio de datos geográficos no está disponible temporalmente. Prueba de nuevo en unos segundos."
  );
}