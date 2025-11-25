import React from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

// bins matching gauge segments
const bins = [
  { key: 'excelente', label: 'Excelente', min: 0, max: 499 },
  { key: 'bueno', label: 'Bueno', min: 500, max: 699 },
  { key: 'normal', label: 'Normal', min: 700, max: 999 },
  { key: 'precaucion', label: 'Precaución', min: 1000, max: 1599 },
  { key: 'critico', label: 'Crítico', min: 1600, max: 2100 }
]

export default function Co2Histogram({ data }) {
  const counts = bins.map(b => {
    const cnt = data.filter(d => d.co2 >= b.min && d.co2 <= b.max).length
    return { name: b.label, count: cnt }
  })

  return (
    <div className="card">
      <h3 className="mb-2 font-semibold">Distribución CO2 (24h)</h3>
      <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer>
          <BarChart data={counts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#0ea5a4" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
