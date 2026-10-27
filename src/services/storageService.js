// Lee un valor de localStorage y devuelve el valor alternativo si no existe o no puede recuperarse correctamente
export function getStoredData(
  key,
  fallbackValue = null
) {
  try {
    const storedValue =
      localStorage.getItem(key);

    if (storedValue === null) {
      return fallbackValue;
    }

    return JSON.parse(storedValue);
  } catch (error) {
    console.error(
      `Error al leer "${key}" de localStorage:`,
      error
    );

    return fallbackValue;
  }
}

// Guarda un valor en localStorage
// Si falla, propaga el error para que quien inició la operación pueda informar al usuario y no confirmar un guardado inexistente
export function setStoredData(key, value) {
  try {
    localStorage.setItem(
      key,
      JSON.stringify(value)
    );
  } catch (error) {
    console.error(
      `Error al guardar "${key}" en localStorage:`,
      error
    );

    throw error;
  }
}