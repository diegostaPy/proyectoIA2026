
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import joblib
import numpy as np

app = FastAPI(
    title="Weather Prediction API",
    description="Prediccion de temperatura basada en datos historicos",
    version="1.0.0",
)

model = joblib.load("D:\\ArchivosHDD\\GitHub\\cursoIA2026\\Semana_10\\api\\weather_model.pkl")


class WeatherInput(BaseModel):
    temp_max_lag1: float = Field(..., description="Temp max ayer (C)")
    temp_max_lag2: float = Field(..., description="Temp max hace 2 dias (C)")
    temp_min_lag1: float = Field(..., description="Temp min ayer (C)")
    humidity_lag1: float = Field(..., description="Humedad ayer (%)")
    wind_lag1: float = Field(..., description="Viento ayer (km/h)")


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "weather-prediction"}


@app.post("/api/predict")
def predict(data: WeatherInput):
    try:
        X = np.array([[  
            data.temp_max_lag1,
            data.temp_max_lag2,
            data.temp_min_lag1,
            data.humidity_lag1,
            data.wind_lag1,
        ]])
        prediction = float(model.predict(X)[0])
        return {
            "prediction": round(prediction, 2),
            "unit": "C",
            "confidence_interval": [
                round(prediction - 2.5, 2),
                round(prediction + 2.5, 2),
            ],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/current/{city}")
async def get_current_weather(city: str):
    import httpx

    async with httpx.AsyncClient(timeout=15) as client:
        geo = await client.get(
            "https://geocoding-api.open-meteo.com/v1/search",
            params={"name": city, "count": 1},
        )
        geo_data = geo.json()
        if "results" not in geo_data:
            raise HTTPException(404, f"Ciudad no encontrada: {city}")

        loc = geo_data["results"][0]
        weather = await client.get(
            "https://api.open-meteo.com/v1/forecast",
            params={
                "latitude": loc["latitude"],
                "longitude": loc["longitude"],
                "current": [
                    "temperature_2m",
                    "relative_humidity_2m",
                    "wind_speed_10m",
                    "precipitation",
                ],
                "timezone": "auto",
            },
        )
        return {
            "city": loc["name"],
            "country": loc.get("country", ""),
            "current": weather.json()["current"],
        }
