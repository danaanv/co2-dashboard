import React from 'react'
import Header from '../components/Header'
import MetricCard from '../components/MetricCard'
import LineChart from '../components/LineChart'
import GaugeChart from '../components/GaugeChart'
import StatusIndicator from '../components/StatusIndicator'
import { generateMultiSensorData, latestReadings, latest } from '../utils/mockData'

export default function Dashboard() {
  // generar datos para varios sensores (simulación)
  const multis = generateMultiSensorData(3, 24)
  const sensorIds = Object.keys(multis)
  const mainSensor = sensorIds[0]
  const data = multis[mainSensor]
  const latest20 = latestReadings(data, 20)
  const last = latest(data)

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Header lastUpdate={last?.timestamp} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <MetricCard label={`CO2 (${mainSensor})`} value={last.co2} unit="ppm" type="co2" />
        <MetricCard label={`Temperatura (${mainSensor})`} value={last.temp} unit="°C" type="temp" />
        <MetricCard label={`Humedad (${mainSensor})`} value={last.hum} unit="%" type="hum" />
      </div>

      <div className="mb-6">
        <h3 className="mb-2 font-semibold">Sensores</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {sensorIds.map(id => {
            const sLast = latest(multis[id])
            return (
              <div key={id} className="card">
                <div className="text-sm text-slate-500">{id}</div>
                <div className="mt-1 text-lg font-semibold">{sLast.co2} ppm</div>
                <div className="text-sm text-slate-500">{sLast.temp}°C • {sLast.hum}%</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2">
          <LineChart data={data} />
        </div>
        <div className="space-y-4">
          <GaugeChart value={last.co2} />
          <div className="card">
            <StatusIndicator co2={last.co2} />
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-3">Histórico (últimas 20 lecturas)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-600 text-sm">
                <th className="p-2">Timestamp</th>
                <th className="p-2">CO2 (ppm)</th>
                <th className="p-2">Temp (°C)</th>
                <th className="p-2">Humedad (%)</th>
              </tr>
            </thead>
            <tbody>
              {latest20.map((r, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2 text-sm">{new Date(r.timestamp).toLocaleString()}</td>
                  <td className="p-2 font-medium">{r.co2}</td>
                  <td className="p-2">{r.temp}</td>
                  <td className="p-2">{r.hum}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
