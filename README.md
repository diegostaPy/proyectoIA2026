# IA Climática · San Lorenzo

Página académica Jekyll con el tema [Architect](https://github.com/pages-themes/architect) para presentar un proyecto de predicción de la temperatura máxima del día siguiente en San Lorenzo, Paraguay.

## Ejecución local

GitHub Pages compila el sitio con Jekyll y el tema Architect configurado en `_config.yml`. Para previsualizarlo localmente, instala Ruby y Bundler y luego las dependencias declaradas en `Gemfile`:

```sh
gem install bundler
bundle install
bundle exec jekyll serve
```

Al publicar en GitHub Pages, el repositorio `proyectoIA2026` usa `https://diegostapy.github.io/proyectoIA2026/`, definido mediante `url` y `baseurl`.

Cada push a `main` compila y despliega el sitio mediante el workflow de GitHub Actions en `.github/workflows/pages.yml`. La primera ejecución configura GitHub Pages para publicar desde GitHub Actions; el enlace publicado aparece en el resultado de la acción.

## Demostración meteorológica y modelo

La tarjeta consulta directamente la API Forecast de Open-Meteo para San Lorenzo, con zona horaria `America/Asuncion`, y muestra la temperatura máxima y el código meteorológico de mañana. Esta fuente y los enlaces a su documentación histórica son públicos y no requieren clave API. El servicio requiere conexión a Internet.

La consulta en vivo es un **pronóstico de Open-Meteo**, no una inferencia de XGBoost. El sitio presenta XGBoost como el modelo previsto por el proyecto y deja explícito que su entrenamiento, validación, métricas e integración aún están pendientes. No se incluyen predicciones ni métricas de entrenamiento ficticias.

## Personalización del equipo

Edita los tres renglones de integrantes en `index.html` para sustituir los nombres y responsabilidades de ejemplo por los datos reales del equipo.
