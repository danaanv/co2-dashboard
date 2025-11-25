import React from 'react'
import { ResponsiveContainer, LineChart as ReLineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts'

function formatTime(ts) {
  const d = new Date(ts)
  return d.getHours() + ':00'
}

export default function LineChart({ data }) {
  const chartData = data.map(d => ({
    time: formatTime(d.timestamp),
    CO2: d.co2
  }))

  return (
    <div className="card h-48">
      <h3 className="text-sm font-semibold mb-2">Últimas 24 horas</h3>
      <ResponsiveContainer width="100%" height="85%">
        <ReLineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" minTickGap={20} tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line type="monotone" dataKey="CO2" stroke="#0ea5a4" dot={false} isAnimationActive={false} />
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  )
}
