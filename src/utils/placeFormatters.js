export function formatPlaceName(name, type) {
  if (!name) {
    return "Lugar natural";
  }

  const names = name
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean);

  if (names.length === 1) {
    return names[0];
  }

  if (type === "viewpoint") {
    const viewpointName = names.find((item) =>
      item.toLowerCase().includes("mirador")
    );

    if (viewpointName) {
      return viewpointName;
    }
  }

  return names[0];
}

export function formatPlaceType(type) {
  const labels = {
    waterfall: "Cascada",
    viewpoint: "Mirador",
    lake: "Lago",
  };

  return labels[type] ?? "Lugar natural";
}

export function formatDirection(direction) {
  if (!direction) {
    return null;
  }

  const numericDirection = Number(direction);

  if (!Number.isFinite(numericDirection)) {
    return direction;
  }

  const directions = [
    "Norte",
    "Noreste",
    "Este",
    "Sureste",
    "Sur",
    "Suroeste",
    "Oeste",
    "Noroeste",
  ];

  const index =
    Math.round(numericDirection / 45) % 8;

  return `${directions[index]} · ${numericDirection}°`;
}

export function formatYesNo(value) {
  if (!value) {
    return null;
  }

  const normalizedValue =
    value.toLowerCase();

  if (normalizedValue === "yes") {
    return "Sí";
  }

  if (normalizedValue === "no") {
    return "No";
  }

  return value;
}

export function formatWheelchair(value) {
  const labels = {
    yes: "Accesible",
    no: "No adaptado",
    limited: "Acceso limitado",
  };

  return labels[value] ?? value;
}

export function formatAccess(value) {
  const labels = {
    yes: "Permitido",
    no: "No permitido",
    private: "Privado",
    permissive: "Permitido",
    customers: "Solo clientes",
    destination: "Solo destino",
  };

  return labels[value] ?? value;
}