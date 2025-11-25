import React, { useState, useEffect } from 'react'
import api from '../utils/api'

function formatDate(ts) {
  if (!ts) return '—'
  const d = new Date(ts)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString('es-ES')
}

function formatDateInput(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  if (Number.isNaN(d.getTime())) return ''
  return d.toISOString().split('T')[0]
}

export default function Historico() {
  const [data, setData] = useState([])
  const [pageSize, setPageSize] = useState(10)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [searchCo2, setSearchCo2] = useState('')

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const rows = await api.getSeries(30) // 30 days
        const safeRows = Array.isArray(rows) ? rows : []
        const normalized = safeRows
          .map(r => {
            const timestamp = r?.time ?? r?.window_end ?? r?.timestamp ?? null
            const co2 = Number(r?.co2 ?? r?.value ?? r?.co2_avg_ppm ?? NaN)
            return { timestamp, co2: Number.isFinite(co2) ? co2 : null }
          })
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // newest first
        if (!mounted) return
        setData(normalized)
      } catch (err) {
        // keep existing state on error
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  // Filter data by date and CO2 range
  const filtered = data.filter(row => {
    const rowDate = new Date(row.timestamp)
    if (fromDate) {
      const from = new Date(fromDate)
      if (rowDate < from) return false
    }
    if (toDate) {
      const to = new Date(toDate)
      to.setHours(23, 59, 59)
      if (rowDate > to) return false
    }
    if (searchCo2) {
      const co2Val = parseInt(searchCo2)
      if (isNaN(co2Val)) return true
      if (row.co2 !== co2Val) return false
    }
    return true
  })

  // Paginate
  const paginated = filtered.slice(0, pageSize)

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Histórico de lecturas</h2>

      {/* Filters */}
      <div className="card mb-6">
        <h3 className="font-semibold mb-4">Filtros y opciones</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Page size selector */}
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-slate-300">Mostrar por página</label>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded bg-white dark:bg-slate-700 dark:text-white"
            >
              <option value={5}>5 lecturas</option>
              <option value={10}>10 lecturas</option>
              <option value={20}>20 lecturas</option>
              <option value={50}>50 lecturas</option>
              <option value={100}>100 lecturas</option>
            </select>
          </div>

          {/* From date */}
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-slate-300">Desde</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full px-3 py-2 border rounded bg-white dark:bg-slate-700 dark:text-white"
            />
          </div>

          {/* To date */}
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-slate-300">Hasta</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full px-3 py-2 border rounded bg-white dark:bg-slate-700 dark:text-white"
            />
          </div>

          {/* CO2 search */}
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-slate-300">Buscar CO2 (ppm)</label>
            <input
              type="number"
              placeholder="ej: 500"
              value={searchCo2}
              onChange={(e) => setSearchCo2(e.target.value)}
              className="w-full px-3 py-2 border rounded bg-white dark:bg-slate-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card">
          <div className="text-sm text-slate-500 dark:text-slate-300">Total de registros</div>
          <div className="text-2xl font-bold mt-1">{data.length}</div>
        </div>
        <div className="card">
          <div className="text-sm text-slate-500 dark:text-slate-300">Registros filtrados</div>
          <div className="text-2xl font-bold mt-1">{filtered.length}</div>
        </div>
        <div className="card">
          <div className="text-sm text-slate-500 dark:text-slate-300">Promedio CO2</div>
          <div className="text-2xl font-bold mt-1">
            {filtered.length > 0
              ? Math.round(filtered.reduce((sum, r) => sum + (r.co2 || 0), 0) / filtered.length)
              : '—'}
            <span className="text-sm"> ppm</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <h3 className="font-semibold mb-4">Tabla de registros</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
                <th className="p-3">Fecha y hora</th>
                <th className="p-3 text-right">CO2 (ppm)</th>
                <th className="p-3">Nivel</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length > 0 ? (
                paginated.map((r, i) => {
                  const co2 = r?.co2 ?? 0
                  let level = '—'
                  let levelColor = 'text-slate-500'
                  if (co2 <= 499) { level = 'Excelente'; levelColor = 'text-green-600 dark:text-green-400' }
                  else if (co2 <= 699) { level = 'Bueno'; levelColor = 'text-blue-600 dark:text-blue-400' }
                  else if (co2 <= 999) { level = 'Normal'; levelColor = 'text-yellow-600 dark:text-yellow-400' }
                  else if (co2 <= 1599) { level = 'Precaución'; levelColor = 'text-orange-600 dark:text-orange-400' }
                  else { level = 'Crítico'; levelColor = 'text-red-600 dark:text-red-400' }

                  return (
                    <tr key={i} className="border-t hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                      <td className="p-3">{formatDate(r?.timestamp)}</td>
                      <td className="p-3 text-right font-semibold">{co2}</td>
                      <td className={`p-3 font-medium ${levelColor}`}>{level}</td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={3} className="p-6 text-center text-slate-500 dark:text-slate-400">
                    No hay registros que coincidan con los filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > pageSize && (
          <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-700 rounded text-sm text-slate-600 dark:text-slate-300">
            Mostrando {paginated.length} de {filtered.length} registros filtrados.
            <span className="font-semibold"> {filtered.length - paginated.length}</span> más disponibles.
          </div>
        )}
      </div>
    </div>
  )
}
