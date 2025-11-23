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

Instalación y ejecución:

1. Instalar dependencias

```bash
# en macOS con zsh
npm install
```

2. Ejecutar en desarrollo

```bash
npm run dev
```

Notas:
- Los datos son simulados por `src/utils/mockData.js` (24 lecturas por defecto). Modifica la función si quieres mayor frecuencia.
- El Gauge está implementado con `recharts` (PieChart) y una aguja SVG. La LineChart usa tres líneas (CO2, Temp, Hum).
- Paleta y estilos en `tailwind.config.cjs`.
