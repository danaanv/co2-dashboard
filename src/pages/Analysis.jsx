import React, { useState, useEffect } from 'react'
import { ResponsiveContainer, LineChart as ReLineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ScatterChart, Scatter, ZAxis } from 'recharts'
import api from '../utils/api'

function formatDate(ts) {
  if (!ts) return '—'
  const d = new Date(ts)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString()
}

export default function Analysis() {
  const [range, setRange] = useState(7)
  const [data, setData] = useState([])
  const [events, setEvents] = useState([])

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const rows = await api.getSeries(range)
        if (!mounted) return
        setData(Array.isArray(rows) ? rows : [])
        const ev = await api.getEvents(1000)
        setEvents(Array.isArray(ev) ? ev : (ev?.events ?? []))
      } catch (err) {
        // keep existing state on error
      }
    }
    load()
    return () => { mounted = false }
  }, [range])

  // prepare scatter heatmap: map each point to {x: hour, y: dayIndex, co2}
  const scatter = data.map(d => {
    const ts = d.time || d.timestamp || d.window_end
    const dt = new Date(ts)
    const co2 = Number(d.co2 ?? d.value ?? d.co2_avg_ppm)
    return { x: dt.getHours(), y: Math.floor((new Date() - dt) / (24 * 60 * 60 * 1000)), co2, ts }
  })

  // calculate average CO2
  const chartData = Array.isArray(data) ? data.map(d => ({ time: d.time || d.timestamp || d.window_end, CO2: (()=>{ const v = Number(d?.co2 ?? d?.value ?? d?.co2_avg_ppm); return Number.isFinite(v) ? v : null})() })) : []
  const avgCo2 = chartData.length > 0
    ? Math.round(chartData.reduce((sum, d) => sum + (d.CO2 || 0), 0) / chartData.length)
    : 0

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Histórico y Análisis</h2>

      <div className="card mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold">Tendencia histórica de CO2</h3>
            <div className="text-sm text-slate-500">Rango: últimos {range} días</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setRange(7)} className={`px-3 py-1 rounded ${range===7? 'bg-primary text-white':'bg-slate-100'}`}>7 días</button>
            <button onClick={() => setRange(30)} className={`px-3 py-1 rounded ${range===30? 'bg-primary text-white':'bg-slate-100'}`}>30 días</button>
          </div>
        </div>
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer>
            <ReLineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tickFormatter={(t) => new Date(t).toLocaleDateString()} />
              <YAxis />
              <Tooltip labelFormatter={(t) => new Date(t).toLocaleString()} />
              <Legend />
              <Line type="monotone" dataKey="CO2" stroke="#0ea5a4" dot={false} name="CO2" />
              {/* Línea de promedio */}
              <Line isAnimationActive={false} type="monotone" dataKey={() => avgCo2} stroke="#ef4444" strokeDasharray="5 5" name={`Promedio: ${avgCo2} ppm`} />
            </ReLineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-4">
        <div className="card">
          <h3 className="font-semibold mb-4">Mapa de calor - CO2 por hora del día</h3>
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Nivel de CO2 (ppm)</span>
              <div className="flex gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded" style={{ background: '#10b981' }}></div>
                  <span>Bajo (&lt;600)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded" style={{ background: '#f59e0b' }}></div>
                  <span>Medio (600-1000)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded" style={{ background: '#ef4444' }}></div>
                  <span>Alto (&gt;1000)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Professional heatmap grid */}
          <div className="overflow-x-auto">
            <div className="min-w-full bg-slate-50 dark:bg-slate-900 p-4 rounded">
              <div className="flex gap-1">
                {/* Y-axis labels (días) */}
                <div className="flex flex-col gap-1 pr-2">
                  <div className="h-6 flex items-center text-xs font-semibold text-slate-500">Día</div>
                  {Array.from({ length: Math.max(...scatter.map(s => s.y), 0) + 1 }).map((_, i) => (
                    <div key={i} className="h-6 flex items-center text-xs text-slate-500">
                      {i === 0 ? 'Hoy' : i === 1 ? 'Ayer' : `-${i}d`}
                    </div>
                  ))}
                </div>

                {/* Heatmap grid */}
                <div className="flex-1 flex flex-col gap-1">
                  {/* X-axis labels (horas) */}
                  <div className="flex gap-1 mb-2">
                    {Array.from({ length: 24 }).map((_, h) => (
                      <div key={h} className="flex-1 text-center text-xs text-slate-500 font-semibold" style={{ minWidth: '20px' }}>
                        {h}h
                      </div>
                    ))}
                  </div>

                  {/* Grid rows */}
                  {Array.from({ length: Math.max(...scatter.map(s => s.y), 0) + 1 }).map((_, dayIdx) => (
                    <div key={dayIdx} className="flex gap-1">
                      {Array.from({ length: 24 }).map((_, hourIdx) => {
                        const point = scatter.find(s => s.x === hourIdx && s.y === dayIdx)
                        const co2 = point?.co2 ?? 0
                        let bgColor = '#e5e7eb' // empty cell
                        if (co2 > 0) {
                          if (co2 <= 600) bgColor = '#10b981'
                          else if (co2 <= 1000) bgColor = '#f59e0b'
                          else bgColor = '#ef4444'
                        }
                        return (
                          <div
                            key={`${dayIdx}-${hourIdx}`}
                            className="flex-1 h-6 rounded cursor-pointer hover:opacity-75 transition relative group"
                            style={{ background: bgColor, minWidth: '20px' }}
                            title={point ? `${co2} ppm` : 'Sin datos'}
                          >
                            {/* Tooltip */}
                            {point && (
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
                                {point.x}:00 - {co2} ppm
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded text-sm text-blue-800 dark:text-blue-200">
            <strong>Interpretación:</strong> Cada celda representa una hora. El color indica el nivel de CO2 en esa hora.
            Más datos disponibles en los últimos {range} días.
          </div>
        </div>
      </div>
    </div>
  )
}
