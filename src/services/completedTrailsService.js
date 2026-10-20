import {getStoredData,setStoredData,} from "./storageService.js";

const COMPLETED_TRAILS_KEY = "trailscope_completed_trails";

export function getCompletedTrails() {
  return getStoredData(
    COMPLETED_TRAILS_KEY,
    []
  );
}

export function isTrailCompleted(trailId) {
  const completedTrails =
    getCompletedTrails();

  return completedTrails.some(
    (completedTrail) =>
      String(
        completedTrail.trailId
      ) === String(trailId)
  );
}

export function addCompletedTrail(trail,completedDate) {
  const completedTrails =
    getCompletedTrails();

  const existingCompletion =
    completedTrails.find(
      (completedTrail) =>
        String(
          completedTrail.trailId
        ) === String(trail.id)
    );

  if (existingCompletion) {
    return {
      completion:
        existingCompletion,
      alreadyCompleted: true,
    };
  }

  const completion = {
    completionId:
      crypto.randomUUID(),

    trailId: trail.id,

    name: trail.name,

    distance:
      trail.distance,

    ascent:
      trail.ascent,

    descent:
      trail.descent,

    duration:
      trail.duration,

    from:
      trail.from,

    to:
      trail.to,

    completedDate,

    createdAt:
      new Date().toISOString(),
  };

  setStoredData(
    COMPLETED_TRAILS_KEY,
    [
      ...completedTrails,
      completion,
    ]
  );

  return {
    completion,
    alreadyCompleted: false,
  };
}

export function removeCompletedTrail(completionId) {
  const completedTrails =
    getCompletedTrails();

  const updatedCompletedTrails =
    completedTrails.filter(
      (completedTrail) =>
        completedTrail.completionId !==
        completionId
    );

  setStoredData(
    COMPLETED_TRAILS_KEY,
    updatedCompletedTrails
  );

  return updatedCompletedTrails;
}