import React from 'react'

function Icon({ type }) {
  // small, simple icons using inline SVG
  if (type === 'co2') return (
    <svg className="w-7 h-7 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeWidth="1.5" d="M12 2v20M5 8h14M5 16h14" />
    </svg>
  )
  if (type === 'temp') return (
    <svg className="w-7 h-7 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeWidth="1.5" d="M14 14.76V3a2 2 0 10-4 0v11.76A4 4 0 1014 14.76z" />
    </svg>
  )
  return (
    <svg className="w-7 h-7 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeWidth="1.5" d="M12 2v20M20 12H4" />
    </svg>
  )
}

export default function MetricCard({ label, value, unit, type }) {
  return (
    <div className="card flex items-center gap-4">
      <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-700">
        <Icon type={type} />
      </div>
      <div>
        <div className="text-sm text-slate-500">{label}</div>
        <div className="text-xl font-semibold">{value} <span className="text-sm text-slate-500">{unit}</span></div>
      </div>
    </div>
  )
}
