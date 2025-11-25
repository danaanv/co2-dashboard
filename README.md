# CO2 Dashboard (React + Vite + Tailwind)

Proyecto de ejemplo para monitoreo de CO2 en tiempo real (mock data).

Stack:
- React 18
- Vite
- TailwindCSS
- Recharts (gráficas)

Estructura relevante:
```
/src
  /components
    Header.jsx
    MetricCard.jsx
    LineChart.jsx
    GaugeChart.jsx
    StatusIndicator.jsx
  /pages
    Dashboard.jsx
  /utils
    mockData.js
```


Instalación y ejecución (frontend):

1. Instalar front-end dependencias

```bash
# en macOS con zsh (desde la carpeta del proyecto)
npm install
```

2. Ejecutar en desarrollo

```bash
npm run dev
```

Backend (API) — Node + Express para conectar a PostgreSQL

He incluido un servidor de ejemplo en `server/` que expone endpoints para lecturas, series y eventos. No incluye credenciales: copia `server/.env.example` a `server/.env` y rellena las variables.

Pasos para el servidor:

1. Ir a la carpeta `server` e instalar dependencias

```bash
cd server
npm install
```

2. Crear `server/.env` (copia `server/.env.example`) con tus credenciales:

```
DB_HOST=pg-prueba-pucp-9303.e.aivencloud.com
DB_PORT=15549
DB_USER=avnadmin
DB_PASS=YOUR_PASSWORD_HERE
DB_NAME=bd-monitoreo-co2
DB_SSL=true
PORT=4000
```

3. Ejecutar el servidor (modo desarrollo):

```bash
npm run dev
```

Endpoints disponibles (ejemplos):

- GET /api/health — chequeo rápido
- GET /api/readings?limit=20 — devuelve las últimas N lecturas (por defecto 20)
- GET /api/series?from=2025-11-24T00:00:00Z&to=2025-11-25T00:00:00Z — serie con promedio/min/max
- GET /api/events?threshold=1000 — detecta eventos CO2 > threshold en últimas 24h

Nota de seguridad: no subas tu `.env` al repositorio. Ya se incluye `server/.env.example` para referencia.

Notas:
- Los datos son simulados por `src/utils/mockData.js` (24 lecturas por defecto). Modifica la función si quieres mayor frecuencia.
- El Gauge está implementado con `recharts` (PieChart) y una aguja SVG. La LineChart usa tres líneas (CO2, Temp, Hum).
- Paleta y estilos en `tailwind.config.cjs`.
