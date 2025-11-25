import React from 'react'
import { ResponsiveContainer, PieChart, Pie } from 'recharts'

// Rango visual: hasta 2100 ppm
const MAX = 2100

// Friendly segments with explicit min/max and short descriptions.
const segments = [
  { key: 'excelente', label: 'Excelente', color: '#059669', min: 0, max: 499, desc: 'Muy buena calidad del aire' },
  { key: 'bueno', label: 'Bueno', color: '#10b981', min: 500, max: 699, desc: 'Calidad aceptable' },
  { key: 'normal', label: 'Normal', color: '#84cc16', min: 700, max: 999, desc: 'Mantener ventilación' },
  { key: 'precaucion', label: 'Precaución', color: '#f59e0b', min: 1000, max: 1599, desc: 'Mejorar ventilación' },
  { key: 'critico', label: 'Crítico', color: '#ef4444', min: 1600, max: MAX, desc: 'Ventilar inmediatamente' }
]

function valueToAngle(value) {
  const ratio = Math.max(0, Math.min(1, value / MAX))
  return ratio * 360
}

function currentSegment(value) {
  return segments.find(s => value >= s.min && value <= s.max) || segments[segments.length - 1]
}

export default function GaugeChart({ value = 0 }) {
  const data = segments.map(s => ({ name: s.key, value: s.max - s.min + 1, fill: s.color }))
  const angle = valueToAngle(value)
  const active = currentSegment(value)

  return (
    <div className="card flex flex-col items-center justify-center">
      <h3 className="mb-3 font-semibold text-center">CO2 actual</h3>
      <div style={{ width: '340px', height: '340px' }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              innerRadius={100}
              outerRadius={150}
              paddingAngle={2}
              stroke="none"
            />
            {/* Indicador (aguja) */}
            <g transform="translate(170,170)">
              <g transform={`rotate(${angle - 90})`}>
                <line x1="0" y1="0" x2="0" y2="-140" stroke="#111827" strokeWidth="4" strokeLinecap="round" />
                <circle cx="0" cy="0" r="7" fill="#111827" />
              </g>
            </g>
            {/* Valor centrado */}
            <text x="50%" y="54%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 24, fontWeight: 800 }}>
              {value} ppm
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Friendly Legend: label, range and short description. Highlight the active level. */}
      <div className="mt-4 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          {segments.map((s) => {
            const isActive = active.key === s.key
            const labelRange = s.max >= MAX ? `${s.min}+ ppm` : `${s.min}–${s.max} ppm`
            return (
              <div key={s.key} className={`flex items-center gap-3 p-2 rounded ${isActive ? 'ring-2 ring-offset-1 ring-primary' : 'bg-transparent'}`}>
                <span style={{ background: s.color }} className="w-5 h-5 rounded-sm inline-block border" />
                <div className="flex-1">
                  <div className={`font-semibold ${isActive ? 'text-primary' : ''}`}>{s.label} <span className="text-xs text-slate-500 dark:text-slate-300">{labelRange}</span></div>
                  <div className="text-slate-500 dark:text-slate-300 text-xs">{s.desc}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
