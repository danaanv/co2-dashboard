import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function NavBar() {
  const loc = useLocation()
  const active = (p) => loc.pathname === p ? 'text-primary font-semibold' : 'text-slate-700'

  return (
    <nav className="w-full bg-white border-b">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl font-bold text-primary">CO2 Dashboard</Link>
          <div className="hidden md:flex items-center gap-3">
            <Link to="/" className={`${active('/')}`}>Dashboard</Link>
            <Link to="/analysis" className={`${active('/analysis')}`}>Histórico & Análisis</Link>
          </div>
        </div>
        <div className="text-sm text-slate-500">Modo claro • Paleta azul-verde</div>
      </div>
    </nav>
  )
}
