const WEATHER_API_URL =
  "https://api.open-meteo.com/v1/forecast";

export async function getTripWeather({
  latitude,
  longitude,
  startDate,
  endDate,
}) {
  if (
    typeof latitude !== "number" ||
    typeof longitude !== "number"
  ) {
    throw new Error(
      "No hay una ubicación válida para consultar la meteorología."
    );
  }

  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),

    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_probability_max",
      "precipitation_sum",
      "wind_speed_10m_max",
    ].join(","),

    timezone: "auto",
    forecast_days: "16",
  });

  const response = await fetch(
    `${WEATHER_API_URL}?${params}`
  );

  if (!response.ok) {
    throw new Error(
      "No se ha podido consultar la previsión meteorológica."
    );
  }

  const data = await response.json();

  const daily = data.daily;

  if (!daily?.time) {
    throw new Error(
      "No hay previsión meteorológica disponible."
    );
  }

  const allDays = daily.time.map(
    (date, index) => ({
      date,

      weatherCode:
        daily.weather_code?.[
          index
        ] ?? null,

      temperatureMax:
        daily.temperature_2m_max?.[
          index
        ] ?? null,

      temperatureMin:
        daily.temperature_2m_min?.[
          index
        ] ?? null,

      precipitationProbability:
        daily
          .precipitation_probability_max?.[
          index
        ] ?? null,

      precipitation:
        daily.precipitation_sum?.[
          index
        ] ?? null,

      windSpeed:
        daily.wind_speed_10m_max?.[
          index
        ] ?? null,
    })
  );

  const days = allDays.filter(
    (day) =>
      day.date >= startDate &&
      day.date <= endDate
  );

  return {
    days,

    availableFrom:
      daily.time[0] ?? null,

    availableTo:
      daily.time[
        daily.time.length - 1
      ] ?? null,

    timezone:
      data.timezone ?? null,
  };
}