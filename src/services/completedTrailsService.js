import { getStoredData, setStoredData } from "./storageService.js";

const COMPLETED_TRAILS_KEY = "trailscope_completed_trails";

// Recupera las rutas completadas y devuelve una lista vacía si los datos no son válidos
export function getCompletedTrails() {
  const completedTrails = getStoredData(COMPLETED_TRAILS_KEY, []);

  return Array.isArray(completedTrails) ? completedTrails : [];
}

// Comprueba si una ruta ya está registrada como completada
export function isTrailCompleted(trailId) {
  const completedTrails = getCompletedTrails();

  return completedTrails.some((completedTrail) => String(completedTrail.trailId) === String(trailId));
}

// Guarda una copia de la ruta completada evitando duplicados
export function addCompletedTrail(trail, completedDate) {
  const completedTrails = getCompletedTrails();

  const existingCompletion = completedTrails.find((completedTrail) => String(completedTrail.trailId) === String(trail.id));

  if (existingCompletion) {
    return {
      completion: existingCompletion,
      alreadyCompleted: true,
    };
  }

  // Guarda los datos necesarios para conservar el historial aunque cambie la ruta original
  const completion = {
    completionId: crypto.randomUUID(),
    trailId: trail.id,
    name: trail.name,
    distance: trail.distance,
    ascent: trail.ascent,
    descent: trail.descent,
    duration: trail.duration,
    from: trail.from,
    to: trail.to,
    completedDate,
    createdAt: new Date().toISOString(),
  };

  setStoredData(COMPLETED_TRAILS_KEY, [...completedTrails, completion]);

  return {
    completion,
    alreadyCompleted: false,
  };
}

// Elimina una ruta completada por su identificador de historial
export function removeCompletedTrail(completionId) {
  const completedTrails = getCompletedTrails();

  const updatedCompletedTrails = completedTrails.filter((completedTrail) => completedTrail.completionId !== completionId);

  setStoredData(COMPLETED_TRAILS_KEY, updatedCompletedTrails);

  return updatedCompletedTrails;
}