import React from 'react'
import { ResponsiveContainer, LineChart as ReLineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts'

function formatTime(ts) {
  const d = new Date(ts)
  return d.getHours() + ':00'
}

export default function LineChart({ data }) {
  const chartData = data.map(d => ({
    time: formatTime(d.timestamp),
    CO2: d.co2,
    Temp: parseFloat(d.temp),
    Hum: d.hum
  }))

  return (
    <div className="card h-64">
      <h3 className="mb-2 font-semibold">Últimas 24 horas</h3>
      <ResponsiveContainer width="100%" height="85%">
        <ReLineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" minTickGap={20} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="CO2" stroke="#0ea5a4" dot={false} />
          <Line type="monotone" dataKey="Temp" stroke="#ef4444" dot={false} />
          <Line type="monotone" dataKey="Hum" stroke="#3b82f6" dot={false} />
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  )
}
