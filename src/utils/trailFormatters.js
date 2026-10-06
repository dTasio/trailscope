const SURFACE_LABELS = {
  paved: "Pavimentado",
  asphalt: "Asfalto",
  concrete: "Hormigón",
  "concrete:lanes": "Carriles de hormigón",
  "concrete:plates": "Placas de hormigón",
  paving_stones: "Adoquines",
  cobblestone: "Empedrado",

  unpaved: "Sin pavimentar",
  compacted: "Terreno compactado",
  fine_gravel: "Grava fina",
  gravel: "Grava",
  pebblestone: "Guijarros",
  ground: "Tierra",
  dirt: "Tierra",
  earth: "Tierra",
  grass: "Hierba",
  mud: "Barro",
  sand: "Arena",
  rock: "Roca",
};

const TRAIL_VISIBILITY_LABELS = {
  excellent: "Excelente",
  good: "Buena",
  intermediate: "Media",
  bad: "Mala",
  horrible: "Muy mala",
  no: "Sin sendero visible",
};

const SAC_SCALE_LABELS = {
  strolling: "Paseo",
  hiking: "Senderismo",
  mountain_hiking: "Senderismo de montaña",
  demanding_mountain_hiking:
    "Senderismo de montaña exigente",
  alpine_hiking: "Senderismo alpino",
  demanding_alpine_hiking:
    "Senderismo alpino exigente",
  difficult_alpine_hiking:
    "Senderismo alpino difícil",
};

function humanizeValue(value) {
  return value
    .replaceAll("_", " ")
    .replaceAll(":", " ");
}

export function formatSurfaceValues(values) {
  return values.map(
    (value) =>
      SURFACE_LABELS[value] ??
      humanizeValue(value)
  );
}

export function formatTrailVisibilityValues(values) {
  return values.map(
    (value) =>
      TRAIL_VISIBILITY_LABELS[value] ??
      humanizeValue(value)
  );
}

export function formatSacScaleValues(values) {
  return values.map(
    (value) =>
      SAC_SCALE_LABELS[value] ??
      humanizeValue(value)
  );
}