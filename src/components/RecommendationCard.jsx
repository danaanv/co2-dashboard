import React from 'react'

function getRecommendation(co2) {
  if (co2 <= 499) {
    return {
      level: 'Excelente',
      color: 'bg-green-100 dark:bg-green-900 border-green-400',
      textColor: 'text-green-800 dark:text-green-200',
      icon: '✓',
      title: 'Calidad del aire óptima',
      actions: [
        'Mantén las ventanas cerradas si lo deseas',
        'Continúa con la rutina normal',
        'Ideal para actividades de concentración'
      ]
    }
  }
  if (co2 <= 699) {
    return {
      level: 'Bueno',
      color: 'bg-blue-100 dark:bg-blue-900 border-blue-400',
      textColor: 'text-blue-800 dark:text-blue-200',
      icon: '★',
      title: 'Calidad del aire aceptable',
      actions: [
        'Abre las ventanas periódicamente',
        'Ventilación moderada recomendada',
        'Ambiente confortable para trabajar'
      ]
    }
  }
  if (co2 <= 999) {
    return {
      level: 'Normal',
      color: 'bg-yellow-100 dark:bg-yellow-900 border-yellow-400',
      textColor: 'text-yellow-800 dark:text-yellow-200',
      icon: '!',
      title: 'Ventilación necesaria',
      actions: [
        'Abre las ventanas para mejorar circulación',
        'Incrementa la renovación de aire',
        'Puede afectar concentración si es prolongado'
      ]
    }
  }
  if (co2 <= 1599) {
    return {
      level: 'Precaución',
      color: 'bg-orange-100 dark:bg-orange-900 border-orange-400',
      textColor: 'text-orange-800 dark:text-orange-200',
      icon: '⚠',
      title: 'Mejora inmediata del aire',
      actions: [
        'Abre las ventanas de inmediato',
        'Aumenta al máximo la ventilación',
        'Puede causar molestias y reducir productividad'
      ]
    }
  }
  return {
    level: 'Crítico',
    color: 'bg-red-100 dark:bg-red-900 border-red-400',
    textColor: 'text-red-800 dark:text-red-200',
    icon: '✕',
    title: 'Ventilar inmediatamente',
    actions: [
      'Abre todas las ventanas y puertas',
      'Activa todos los sistemas de ventilación',
      'Riesgo para la salud - acción urgente requerida'
    ]
  }
}

export default function RecommendationCard({ co2 = 0 }) {
  const rec = getRecommendation(co2)

  return (
    <div className={`card border-l-4 ${rec.color} ${rec.textColor}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 text-2xl font-bold">{rec.icon}</div>
        <div className="flex-1">
          <h4 className="font-semibold mb-1">{rec.title}</h4>
          <p className="text-sm mb-3 opacity-90">Nivel: <span className="font-semibold">{rec.level}</span></p>
          <ul className="text-sm space-y-1">
            {rec.actions.map((action, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1">→</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
