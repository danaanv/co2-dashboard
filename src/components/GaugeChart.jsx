import React from 'react'
import { ResponsiveContainer, PieChart, Pie } from 'recharts'

// Rango: 0 - 2000 ppm
const MAX = 2000
const ranges = [
  { name: 'optimo', value: 800, color: '#10b981' },
  { name: 'aceptable', value: 400, color: '#f59e0b' },
  { name: 'ventilar', value: 400, color: '#f97316' },
  { name: 'critico', value: 400, color: '#ef4444' }
]

function valueToAngle(value) {
  const ratio = Math.max(0, Math.min(1, value / MAX))
  return ratio * 360
}

export default function GaugeChart({ value = 0 }) {
  const data = ranges.map(r => ({ name: r.name, value: r.value, fill: r.color }))
  const angle = valueToAngle(value)

  return (
    <div className="card flex flex-col items-center justify-center">
      <h3 className="mb-3 font-semibold">CO2 actual</h3>
      <div style={{ width: '220px', height: '220px' }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              stroke="none"
            />
            {/* Indicador (aguja) */}
            <g transform="translate(110,110)">
              <g transform={`rotate(${angle - 90})`}>
                <line x1="0" y1="0" x2="0" y2="-90" stroke="#111827" strokeWidth="3" strokeLinecap="round" />
                <circle cx="0" cy="0" r="6" fill="#111827" />
              </g>
            </g>
            {/* Valor centrado */}
            <text x="50%" y="52%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 18, fontWeight: 700 }}>
              {value} ppm
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-sm text-slate-600">0 — 2000 ppm</div>
    </div>
  )
}
