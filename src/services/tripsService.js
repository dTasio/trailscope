import { getStoredData, setStoredData} from "./storageService.js";

const TRIPS_KEY = "trailscope-trips";

export function getTrips() {
  const trips = getStoredData(
    TRIPS_KEY,
    []
  );

  return Array.isArray(trips)
    ? trips
    : [];
}

export function getTripById(tripId) {
  const trips = getTrips();

  return (
    trips.find(
      (trip) => trip.id === tripId
    ) ?? null
  );
}

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