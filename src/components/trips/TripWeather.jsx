import { useEffect, useState } from "react";
import { getTripWeather } from "../../services/weatherService.js";

// Formatea una fecha de previsión para mostrarla en español
function formatWeatherDate(date) {
  return new Intl.DateTimeFormat("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(`${date}T00:00:00`));
}

// Convierte el código meteorológico en una descripción legible
function formatWeatherCode(code) {
  if (code === 0) {
    return "Despejado";
  }

  if ([1, 2].includes(code)) {
    return "Parcialmente nuboso";
  }

  if (code === 3) {
    return "Cubierto";
  }

  if ([45, 48].includes(code)) {
    return "Niebla";
  }

  if ([51, 53, 55].includes(code)) {
    return "Llovizna";
  }

  if ([56, 57].includes(code)) {
    return "Llovizna helada";
  }

  if ([61, 63, 65].includes(code)) {
    return "Lluvia";
  }

  if ([66, 67].includes(code)) {
    return "Lluvia helada";
  }

  if ([71, 73, 75, 77].includes(code)) {
    return "Nieve";
  }

  if ([80, 81, 82].includes(code)) {
    return "Chubascos";
  }

  if ([85, 86].includes(code)) {
    return "Chubascos de nieve";
  }

  if ([95, 96, 99].includes(code)) {
    return "Tormenta";
  }

  return "Tiempo variable";
}

function TripWeather({ trip }) {
  // Previsión meteorológica y estado de la consulta
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const latitude = trip.destination?.latitude;
  const longitude = trip.destination?.longitude;

  const hasCoordinates = typeof latitude === "number" && typeof longitude === "number";

  // Carga la previsión cuando cambian la zona o las fechas de la escapada
  useEffect(() => {
    if (!hasCoordinates) {
      setWeather(null);
      setWeatherError("");
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const loadWeather = async () => {
      setIsLoading(true);
      setWeather(null);
      setWeatherError("");

      try {
        const result = await getTripWeather({
          latitude,
          longitude,
          startDate: trip.startDate,
          endDate: trip.endDate,
        });

        if (!cancelled) {
          setWeather(result);
        }
      } catch (error) {
        if (!cancelled) {
          setWeather(null);
          setWeatherError(error.message);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadWeather();

    return () => {
      cancelled = true;
    };
  }, [latitude, longitude, trip.startDate, trip.endDate, hasCoordinates]);

  const days = weather?.days ?? [];

  const isOutsideForecast = weather && days.length === 0;

  const hasPartialForecast = weather && days.length > 0 && (trip.startDate < weather.availableFrom || trip.endDate > weather.availableTo);

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold tracking-tight text-text">Meteorología</h2>

      <p className="mt-2 max-w-2xl leading-7 text-muted">Consulta la previsión para las fechas y la zona de tu escapada.</p>

      {!hasCoordinates && (
        <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
          <p className="font-medium text-text">Localiza primero la zona</p>

          <p className="mt-2 leading-7 text-muted">Selecciona una localidad en el planificador para poder consultar la meteorología.</p>
        </div>
      )}

      {hasCoordinates && isLoading && (
        <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
          <p className="font-medium text-text">Consultando previsión...</p>
        </div>
      )}

      {weatherError && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700" role="alert">
          {weatherError}
        </div>
      )}

      {hasCoordinates && !isLoading && !weatherError && isOutsideForecast && (
        <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
          <p className="font-medium text-text">Previsión todavía no disponible</p>

          <p className="mt-2 leading-7 text-muted">Las fechas de esta escapada quedan fuera del periodo de previsión disponible. Vuelve a consultarlo cuando se acerque la fecha.</p>
        </div>
      )}

      {hasCoordinates && !isLoading && !weatherError && days.length > 0 && (
        <>
          {hasPartialForecast && <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-800">Solo se muestra la previsión disponible actualmente para las fechas de esta escapada.</div>}

          <div className="mt-6 flex w-full snap-x snap-mandatory gap-4 overflow-x-auto pb-3">
            {days.map((day) => (
              <article key={day.date} className="w-46.25 shrink-0 snap-start rounded-2xl border border-[#d6e3da] bg-[#eef2ee] p-5">
                <p className="text-sm font-semibold capitalize text-primary">{formatWeatherDate(day.date)}</p>

                <p className="mt-3 min-h-12 font-semibold leading-6 text-text">{formatWeatherCode(day.weatherCode)}</p>

                <div className="mt-4">
                  <p className="text-2xl font-bold text-text">{day.temperatureMax ?? "—"}°</p>

                  <p className="text-sm text-muted">Mín. {day.temperatureMin ?? "—"}°</p>
                </div>

                <div className="mt-4 border-t border-border pt-3 text-xs leading-5 text-muted">
                  {day.precipitationProbability !== null && <p>Lluvia: {day.precipitationProbability}%</p>}

                  {day.windSpeed !== null && <p>Viento: {day.windSpeed} km/h</p>}
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default TripWeather;
