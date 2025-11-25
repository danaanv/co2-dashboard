import React from 'react'
import { generateMockData, latestReadings, computeEvents } from '../utils/mockData'

function formatDate(ts) {
  return new Date(ts).toLocaleString()
}

export default function Alerts() {
  const data = generateMockData(24)
  const events = computeEvents(data, 1000)

  const totalEvents = events.length
  const longest = events.reduce((m, e) => Math.max(m, e.durationMinutes), 0)
  const lastEvent = events.length ? events[events.length - 1] : null

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Alertas</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="card">
          <div className="text-sm text-slate-500 dark:text-slate-300">Eventos (CO2 &gt; 1000 ppm)</div>
          <div className="text-3xl font-bold mt-2">{totalEvents}</div>
          <div className="text-sm text-slate-500 dark:text-slate-300 mt-2">Mayor duración: {longest} min</div>
          <div className="text-sm text-slate-500 dark:text-slate-300">Último evento: {lastEvent ? formatDate(lastEvent.end) : '—'}</div>
        </div>

        <div className="card lg:col-span-2">
          <div className="text-sm text-slate-500 dark:text-slate-300">Resumen de eventos</div>
          <div className="text-lg font-semibold mt-2">
            {totalEvents === 0 ? 'Sin eventos detectados' : `${totalEvents} evento${totalEvents !== 1 ? 's' : ''} detectado${totalEvents !== 1 ? 's' : ''}`}
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Los eventos se muestran en el detalle abajo.
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
