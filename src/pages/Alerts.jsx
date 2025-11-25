import React from 'react'
import { generateMockData, latestReadings, computeEvents } from '../utils/mockData'

function formatDate(ts) {
  return new Date(ts).toLocaleString()
}

export default function Alerts() {
  const data = generateMockData(24)
  const latest20 = latestReadings(data, 20)
  const events = computeEvents(data, 1000)

  const totalEvents = events.length
  const longest = events.reduce((m, e) => Math.max(m, e.durationMinutes), 0)
  const lastEvent = events.length ? events[events.length - 1] : null

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Alertas</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="card">
          <div className="text-sm text-slate-500">Eventos (CO2 &gt; 1000 ppm)</div>
          <div className="text-3xl font-bold mt-2">{totalEvents}</div>
          <div className="text-sm text-slate-500 mt-2">Mayor duración: {longest} min</div>
          <div className="text-sm text-slate-500">Último evento: {lastEvent ? formatDate(lastEvent.end) : '—'}</div>
        </div>

        <div className="card lg:col-span-2">
          <h3 className="font-semibold mb-3">Tabla histórica (últimas 20 lecturas)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-600 text-sm">
                  <th className="p-2">Timestamp</th>
                  <th className="p-2">CO2 (ppm)</th>
                </tr>
              </thead>
              <tbody>
                {latest20.map((r, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2 text-sm">{formatDate(r.timestamp)}</td>
                    <td className="p-2 font-medium">{r.co2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-3">Detalle de eventos</h3>
        {events.length === 0 && <div className="text-sm text-slate-500">No se detectaron eventos en las últimas 24 horas.</div>}
        {events.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-slate-600">
                  <th className="p-2">Inicio</th>
                  <th className="p-2">Fin</th>
                  <th className="p-2">Duración (min)</th>
                  <th className="p-2">Pico (ppm)</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">{formatDate(e.start)}</td>
                    <td className="p-2">{formatDate(e.end)}</td>
                    <td className="p-2">{e.durationMinutes}</td>
                    <td className="p-2">{e.maxValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
