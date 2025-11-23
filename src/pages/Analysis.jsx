import React, { useState } from 'react'
import { ResponsiveContainer, LineChart as ReLineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ScatterChart, Scatter, ZAxis } from 'recharts'
import { generateSensorData, computeEvents } from '../utils/mockData'

function formatDate(ts) {
  return new Date(ts).toLocaleString()
}

function makeLineData(days = 7) {
  // generate days*24 hours of data
  const hours = days * 24
  return generateSensorData(hours)
}

export default function Analysis() {
  const [range, setRange] = useState(7)
  const [sensorIdx, setSensorIdx] = useState(1)

  const data = makeLineData(range)
  const events = computeEvents(data, 1000)

  // prepare scatter heatmap: map each point to {x: hour, y: dayIndex, co2}
  const scatter = data.map(d => {
    const dt = new Date(d.timestamp)
    return { x: dt.getHours(), y: Math.floor((new Date() - dt) / (24 * 60 * 60 * 1000)), co2: d.co2, ts: d.timestamp }
  })

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
            <ReLineChart data={data.map(d => ({ time: d.timestamp, CO2: d.co2 }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tickFormatter={(t) => new Date(t).toLocaleDateString()} />
              <YAxis />
              <Tooltip labelFormatter={(t) => new Date(t).toLocaleString()} />
              <Legend />
              <Line type="monotone" dataKey="CO2" stroke="#0ea5a4" dot={false} />
              {/* umbral crítico */}
              <Line isAnimationActive={false} type="monotone" dataKey={() => 1000} stroke="#ef4444" strokeDasharray="5 5" />
            </ReLineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="card">
          <h3 className="font-semibold mb-2">Mapa de calor (hora del día vs día)</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <ScatterChart>
                <CartesianGrid />
                <XAxis type="number" dataKey="x" name="hora" unit="h" />
                <YAxis reversed type="number" dataKey="y" name="día" />
                <ZAxis dataKey="co2" range={[50, 500]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(value, name) => [value, 'CO2']} labelFormatter={(label) => `ts: ${label.ts}`} />
                <Scatter data={scatter} fill="#0ea5a4" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-2">Eventos (CO2 &gt; 1000 ppm)</h3>
          <div className="text-sm text-slate-500 mb-2">Sensor: sensor-{sensorIdx}</div>
          <div className="overflow-auto">
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
                {events.length === 0 && (
                  <tr><td className="p-2" colSpan={4}>No hay eventos en el rango seleccionado.</td></tr>
                )}
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
        </div>
      </div>
    </div>
  )
}
