import React from 'react'

export default function Header({ title = 'CO2 Dashboard', lastUpdate }) {
  return (
    <header className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">{title}</h1>
        <p className="text-sm text-slate-500">Monitor de calidad del aire en tiempo real</p>
      </div>
      <div className="text-right text-sm text-slate-600">
        <div>Última actualización</div>
        <div className="font-mono">{lastUpdate ? new Date(lastUpdate).toLocaleString() : '—'}</div>
      </div>
    </header>
  )
}
