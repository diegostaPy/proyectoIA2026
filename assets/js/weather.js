(() => {
  const latitude = -25.3333;
  const longitude = -57.5167;
  const temperature = document.getElementById("forecast-temperature");
  const forecastDate = document.getElementById("forecast-date");
  const summary = document.getElementById("forecast-summary");
  const error = document.getElementById("forecast-error");
  const refreshButton = document.getElementById("refresh-forecast");
  const updatedAt = document.getElementById("updated-at");
  const icon = document.getElementById("forecast-icon");

  if (!temperature || !forecastDate || !summary || !error || !refreshButton || !updatedAt || !icon) {
    return;
  }

  const weatherDescriptions = {
    0: ["Cielo despejado", "☀"],
    1: ["Mayormente despejado", "☀"],
    2: ["Parcialmente nublado", "⛅"],
    3: ["Nublado", "☁"],
    45: ["Niebla", "〰"],
    48: ["Niebla con escarcha", "〰"],
    51: ["Llovizna ligera", "🌦"],
    53: ["Llovizna moderada", "🌦"],
    55: ["Llovizna intensa", "🌧"],
    56: ["Llovizna helada ligera", "🌧"],
    57: ["Llovizna helada intensa", "🌧"],
    61: ["Lluvia ligera", "🌧"],
    63: ["Lluvia moderada", "🌧"],
    65: ["Lluvia intensa", "🌧"],
    66: ["Lluvia helada ligera", "🌧"],
    67: ["Lluvia helada intensa", "🌧"],
    71: ["Nevada ligera", "🌨"],
    73: ["Nevada moderada", "🌨"],
    75: ["Nevada intensa", "🌨"],
    77: ["Granizo menudo", "🌨"],
    80: ["Chubascos ligeros", "🌦"],
    81: ["Chubascos moderados", "🌧"],
    82: ["Chubascos violentos", "⛈"],
    85: ["Chubascos de nieve", "🌨"],
    86: ["Chubascos intensos de nieve", "🌨"],
    95: ["Tormenta", "⛈"],
    96: ["Tormenta con granizo ligero", "⛈"],
    99: ["Tormenta con granizo intenso", "⛈"],
  };

  async function loadForecast() {
    error.hidden = true;
    refreshButton.disabled = true;
    temperature.textContent = "--";
    forecastDate.textContent = "—";
    updatedAt.textContent = "Consultando Open-Meteo…";
    summary.textContent = "Consultando el servicio meteorológico…";

    const params = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      daily: "temperature_2m_max,weather_code",
      forecast_days: "2",
      timezone: "America/Asuncion",
    });

    try {
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
      if (!response.ok) {
        throw new Error(`El servicio respondió con estado ${response.status}.`);
      }

      const data = await response.json();
      const dates = data.daily?.time;
      const maximums = data.daily?.temperature_2m_max;
      if (!Array.isArray(dates) || dates.length < 2 || !Array.isArray(maximums) || maximums.length < 2 ||
          typeof maximums[1] !== "number") {
        throw new Error("La respuesta no contiene un pronóstico válido para mañana.");
      }

      const description = weatherDescriptions[data.daily.weather_code?.[1]] ?? ["Condiciones variables", "◌"];
      temperature.textContent = maximums[1].toLocaleString("es-PY", {
        maximumFractionDigits: 1,
        minimumFractionDigits: 1,
      });
      forecastDate.textContent = new Intl.DateTimeFormat("es-PY", {
        weekday: "short",
        day: "numeric",
        month: "short",
        timeZone: "America/Asuncion",
      }).format(new Date(`${dates[1]}T12:00:00Z`));
      summary.textContent = description[0];
      icon.textContent = description[1];
      updatedAt.textContent = `Pronóstico consultado: ${new Intl.DateTimeFormat("es-PY", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "America/Asuncion",
      }).format(new Date())} (hora de Paraguay).`;
    } catch (cause) {
      summary.textContent = "No se pudo consultar el pronóstico.";
      error.textContent = cause instanceof Error
        ? `${cause.message} Comprueba la conexión e inténtalo de nuevo.`
        : "Ocurrió un error al consultar Open-Meteo. Comprueba la conexión e inténtalo de nuevo.";
      error.hidden = false;
    } finally {
      refreshButton.disabled = false;
    }
  }

  refreshButton.addEventListener("click", loadForecast);
  loadForecast();
})();
