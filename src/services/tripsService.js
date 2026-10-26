import { getStoredData, setStoredData} from "./storageService.js";

// Clave utilizada para guardar todas las escapadas de TrailScope
const TRIPS_KEY = "trailscope-trips";

// Recupera las escapadas guardadas y devuelve una lista vacía si los datos no son válidos
export function getTrips() {
  const trips = getStoredData(
    TRIPS_KEY,
    []
  );

  return Array.isArray(trips)
    ? trips
    : [];
}

// Busca una escapada por su identificador
export function getTripById(tripId) {
  const trips = getTrips();

  return (
    trips.find(
      (trip) => trip.id === tripId
    ) ?? null
  );
}

// Crea una nueva escapada con su estructura inicial y la guarda
export function createTrip(tripData) {
  const trips = getTrips();

  const now =
    new Date().toISOString();

  const newTrip = {
    id: crypto.randomUUID(),

    name: tripData.name,
    startDate: tripData.startDate,
    endDate: tripData.endDate,

    destination: {
      name: tripData.destination,
      latitude: null,
      longitude: null,
    },

    trails: [],
    places: [],

    notes: "",

    createdAt: now,
    updatedAt: now,
  };

  const updatedTrips = [
    ...trips,
    newTrip,
  ];

  setStoredData(
    TRIPS_KEY,
    updatedTrips
  );

  return newTrip;
}

// Actualiza una escapada existente y renueva su fecha de modificación
export function updateTrip(updatedTrip) {
  const trips = getTrips();

  const tripWithUpdatedDate = {
    ...updatedTrip,
    updatedAt: new Date().toISOString(),
  };

  const updatedTrips = trips.map((trip) =>
    trip.id === tripWithUpdatedDate.id
      ? tripWithUpdatedDate
      : trip
  );

  setStoredData(
    TRIPS_KEY,
    updatedTrips
  );

  return tripWithUpdatedDate;
}

// Elimina una escapada por su identificador
export function deleteTrip(tripId) {
  const trips = getTrips();

  const updatedTrips = trips.filter(
    (trip) => trip.id !== tripId
  );

  setStoredData(
    TRIPS_KEY,
    updatedTrips
  );

  return updatedTrips;
}

// Añade una copia de la ruta a la escapada evitando duplicados
export function addTrailToTrip(tripId, trail) {
  const trips = getTrips();

  const trip = trips.find(
    (currentTrip) =>
      currentTrip.id === tripId
  );

  if (!trip) {
    throw new Error(
      "La escapada no existe."
    );
  }

  const trails =
    trip.trails ?? [];

  const alreadyAdded =
    trails.some(
      (storedTrail) =>
        String(storedTrail.id) ===
        String(trail.id)
    );

  if (alreadyAdded) {
    return {
      trip,
      alreadyAdded: true,
    };
  }

  // Guarda solo los datos de la ruta necesarios dentro de la escapada
  const trailSnapshot = {
    id: trail.id,
    name: trail.name,
    distance: trail.distance,
    ascent: trail.ascent,
    descent: trail.descent,
    duration: trail.duration,
    from: trail.from,
    to: trail.to,
    center: trail.center,
    geometry: trail.geometry,
  };

  const updatedTrip =
    updateTrip({
      ...trip,

      trails: [
        ...trails,
        trailSnapshot,
      ],
    });

  return {
    trip: updatedTrip,
    alreadyAdded: false,
  };
}

// Añade una copia del lugar a la escapada evitando duplicados
export function addPlaceToTrip(tripId, place) {
  const trips = getTrips();

  const trip = trips.find(
    (currentTrip) =>
      currentTrip.id === tripId
  );

  if (!trip) {
    throw new Error(
      "La escapada no existe."
    );
  }

  const places =
    trip.places ?? [];

  const alreadyAdded =
    places.some(
      (storedPlace) =>
        storedPlace.osmKey ===
        place.osmKey
    );

  if (alreadyAdded) {
    return {
      trip,
      alreadyAdded: true,
    };
  }

  // Guarda solo los datos del lugar necesarios dentro de la escapada
  const placeSnapshot = {
    osmKey: place.osmKey,
    name: place.name,
    type: place.type,
    elevation: place.elevation,
    coordinates:
      place.coordinates,
    image: place.image,
  };

  const updatedTrip =
    updateTrip({
      ...trip,

      places: [
        ...places,
        placeSnapshot,
      ],
    });

  return {
    trip: updatedTrip,
    alreadyAdded: false,
  };
}