export function getStoredData(key, fallbackValue = null) {
  try {
    const storedValue = localStorage.getItem(key);

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
  }
}