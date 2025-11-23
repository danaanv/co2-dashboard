// Generador de datos mock para CO2 (ppm), temperatura (°C) y humedad (%)
function randomBetween(min, max) {
  return Math.round(Math.random() * (max - min) + min)
}

// Genera `hours` lecturas (1 por hora) para un sensor individual
export function generateSensorData(hours = 24) {
  const now = new Date()
  const data = []
  for (let i = hours - 1; i >= 0; i--) {
    const ts = new Date(now.getTime() - i * 60 * 60 * 1000)
    data.push({
      timestamp: ts.toISOString(),
      co2: randomBetween(400, 1800),
      temp: (Math.random() * (28 - 18) + 18).toFixed(1),
      hum: randomBetween(30, 70)
    })
  }
  return data
}

// Genera datos para múltiples sensores
export function generateMultiSensorData(sensorCount = 3, hours = 24) {
  const out = {}
  for (let s = 1; s <= sensorCount; s++) {
    out[`sensor-${s}`] = generateSensorData(hours)
  }
  return out
}

// Retorna las últimas `n` lecturas (más recientes primero)
export function latestReadings(data, n = 20) {
  if (!Array.isArray(data)) return []
  return data.slice(-n).reverse()
}

// Retorna la lectura más reciente
export function latest(data) {
  if (!Array.isArray(data) || data.length === 0) return null
  return data[data.length - 1]
}

// Calcula eventos donde co2 > threshold. Devuelve {start, end, durationMinutes, maxValue}
export function computeEvents(data, threshold = 1000) {
  const events = []
  let current = null
  for (let i = 0; i < data.length; i++) {
    const d = data[i]
    if (d.co2 > threshold) {
      if (!current) {
        current = { start: d.timestamp, end: d.timestamp, maxValue: d.co2 }
      } else {
        current.end = d.timestamp
        if (d.co2 > current.maxValue) current.maxValue = d.co2
      }
    } else {
      if (current) {
        const start = new Date(current.start)
        const end = new Date(current.end)
        const durationMinutes = Math.round((end - start) / 60000) || 60
        events.push({ start: current.start, end: current.end, durationMinutes, maxValue: current.maxValue })
        current = null
      }
    }
  }
  if (current) {
    const start = new Date(current.start)
    const end = new Date(current.end)
    const durationMinutes = Math.round((end - start) / 60000) || 60
    events.push({ start: current.start, end: current.end, durationMinutes, maxValue: current.maxValue })
  }
  return events
}

export default {
  generateSensorData,
  generateMultiSensorData,
  latestReadings,
  latest,
  computeEvents
}
