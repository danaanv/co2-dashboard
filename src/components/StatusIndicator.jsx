import React from 'react'

export default function StatusIndicator({ co2 }) {
  let color = 'bg-green-500'
  let text = 'Óptimo'
  if (co2 > 1600) { color = 'bg-red-600'; text = 'Crítico' }
  else if (co2 > 1200) { color = 'bg-orange-500'; text = 'Ventilar' }
  else if (co2 > 800) { color = 'bg-yellow-400'; text = 'Aceptable' }

  return (
    <div className="flex items-center gap-3">
      <span className={`w-3 h-3 rounded-full ${color}`} />
      <div>
        <div className="text-sm text-slate-600 dark:text-slate-300">Calidad del aire</div>
        <div className="font-semibold">{text} — {co2} ppm</div>
      </div>
    </div>
  )
}
