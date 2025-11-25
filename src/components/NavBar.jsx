import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function NavBar() {
  const loc = useLocation()
  const active = (p) => loc.pathname === p ? 'text-primary font-semibold' : 'text-slate-700'
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem('theme') === 'dark'
    } catch (e) {
      return false
    }
  })

  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])

  return (
    <nav className="w-full bg-white dark:bg-slate-900 border-b">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl font-bold text-primary">CO2 Dashboard</Link>
          <div className="hidden md:flex items-center gap-3">
            <Link to="/" className={`${active('/')}`}>Dashboard</Link>
            <Link to="/analysis" className={`${active('/analysis')}`}>Análisis</Link>
            <Link to="/alerts" className={`${active('/alerts')}`}>Alertas</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-500 dark:text-slate-300">{dark ? 'Oscuro' : 'Claro'}</div>
          <button
            aria-label="Toggle theme"
            onClick={() => setDark(d => !d)}
            className="p-2 bg-slate-100 dark:bg-slate-800 rounded"
          >
            {dark ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </nav>
  )
}
