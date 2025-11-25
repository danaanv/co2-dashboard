import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import MetricCard from '../components/MetricCard'
import LineChart from '../components/LineChart'
import GaugeChart from '../components/GaugeChart'
import StatusIndicator from '../components/StatusIndicator'
import RecommendationCard from '../components/RecommendationCard'
import { latestReadings, latest } from '../utils/mockData'
import api from '../utils/api'

function formatDate(ts) {
  if (!ts) return '—'
  const d = new Date(ts)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString()
}

export default function Dashboard() {
  // data loaded from API (fallback to mock inside api.js)
  const [data, setData] = useState([])
  const [latest20, setLatest20] = useState([])
  const [last, setLast] = useState(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        // Get last 30 days to ensure we get the most recent value even if it's old
        const rows = await api.getSeries(30)
        // ensure rows is an array
        const safeRows = Array.isArray(rows) ? rows : []
        // expected shape: array with { time, value/co2 }
        // normalize to our internal shape { timestamp, co2 }
        const normalized = safeRows.map(r => {
          const timestamp = r?.time ?? r?.window_end ?? r?.timestamp ?? null
          const co2 = Number(r?.co2 ?? r?.value ?? r?.co2_avg_ppm ?? NaN)
          return { timestamp, co2: Number.isFinite(co2) ? co2 : null }
        }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // Sort newest first
        
        if (!mounted) return
        setData(normalized)
        // Get the most recent value (first after sorting by newest)
        const lastItem = normalized.length ? normalized[0] : null
        setLast(lastItem)
        setLatest20(normalized.slice(0, 20).reverse()) // Reverse to show oldest to newest
      } catch (err) {
        // keep previous state on error
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  // show 5 by default, toggle to show all 20
  const [showAll, setShowAll] = useState(false)
  const displayed = showAll ? latest20 : latest20.slice(0, 5)

  return (
    <div className="max-w-7xl mx-auto p-4">
      <Header lastUpdate={last?.timestamp} />

      {/* Compacted layout to fit in one screen */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        {/* Left: Gauge */}
        <div className="lg:col-span-1">
          <GaugeChart value={last?.co2 ?? 0} />
        </div>
        {/* Right: CO2 Value + Recommendation + 24h chart */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* CO2 current */}
          <div className="card text-center p-6">
            <div className="text-xs text-slate-500 dark:text-slate-300 mb-1">CO2 actual</div>
            <div className="text-4xl font-bold">{last?.co2 ?? '—'}<span className="text-lg"> ppm</span></div>
            <div className="text-xs text-slate-400 mt-2">{formatDate(last?.timestamp)}</div>
          </div>

          {/* Status indicator compact */}
          <div className="card p-4">
            <StatusIndicator co2={last?.co2 ?? 0} />
          </div>

          {/* Recommendation compact */}
          <div>
            <RecommendationCard co2={last?.co2 ?? 0} />
          </div>

          {/* 24h chart - taller to match gauge height */}
          <div className="lg:min-h-[700px]">
            <LineChart data={data} />
          </div>
        </div>
      </div>
    </div>
  )
}
