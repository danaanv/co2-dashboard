import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import MetricCard from '../components/MetricCard'
import LineChart from '../components/LineChart'
import GaugeChart from '../components/GaugeChart'
import StatusIndicator from '../components/StatusIndicator'
import RecommendationCard from '../components/RecommendationCard'
import { latestReadings, latest } from '../utils/mockData'
import api from '../utils/api'

export default function Dashboard() {
  // data loaded from API (fallback to mock inside api.js)
  const [data, setData] = useState([])
  const [latest20, setLatest20] = useState([])
  const [last, setLast] = useState(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const rows = await api.getSeries(2) // 48 hours
        // ensure rows is an array
        const safeRows = Array.isArray(rows) ? rows : []
        // expected shape: array with { time, value/co2 }
        // normalize to our internal shape { timestamp, co2 }
        const normalized = safeRows.map(r => {
          const timestamp = r?.time ?? r?.window_end ?? r?.timestamp ?? null
          const co2 = Number(r?.co2 ?? r?.value ?? r?.co2_avg_ppm ?? NaN)
          return { timestamp, co2: Number.isFinite(co2) ? co2 : null }
        })
        if (!mounted) return
        setData(normalized)
        const lastItem = normalized.length ? normalized[normalized.length - 1] : null
        setLast(lastItem)
        setLatest20(normalized.slice(-20).reverse())
      } catch (err) {
        // keep previous state on error; optionally log
        // console.error('Failed loading series', err)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  // show 5 by default, toggle to show all 20
  const [showAll, setShowAll] = useState(false)
  const displayed = showAll ? latest20 : latest20.slice(0, 5)

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Header lastUpdate={last?.timestamp} />

      {/* Main layout: left main column (CO2 current, quality, 24h chart) and right column with gauge+legend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 items-start">
        <div className="lg:col-span-2 flex flex-col items-center">
          {/* CO2 current - centered */}
          <div className="card w-full max-w-2xl text-center mb-4">
            <div className="text-sm text-slate-500 dark:text-slate-300">CO2 actual</div>
            <div className="text-6xl font-extrabold mt-2">{last?.co2 ?? '—'}<span className="text-2xl font-medium"> ppm</span></div>
            <div className="mt-3 flex justify-center">
              <StatusIndicator co2={last?.co2 ?? 0} />
            </div>
          </div>

          {/* Recommendation card */}
          <div className="w-full max-w-2xl mb-4">
            <RecommendationCard co2={last?.co2 ?? 0} />
          </div>

          {/* 24h line chart below the status */}
          <div className="w-full">
            <LineChart data={data} />
          </div>
        </div>

        {/* Right column: Gauge with legend */}
        <div className="lg:col-span-1 flex justify-center">
          <GaugeChart value={last?.co2 ?? 0} />
        </div>
      </div>
    </div>
  )
}
