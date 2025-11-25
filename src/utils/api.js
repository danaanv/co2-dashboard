import mock from './mockData'

const API_BASE = typeof window !== 'undefined' ? '' : 'http://localhost:4000'

export async function getReadings(limit = 20) {
  try {
    const res = await fetch(`${API_BASE}/api/readings?limit=${limit}`)
    if (!res.ok) throw new Error('API error')
    const data = await res.json()
    return data
  } catch (err) {
    // fallback: return empty array (no mock data)
    return []
  }
}

export async function getSeries(days = 7, from, to) {
  try {
    const now = new Date()
    const fromDate = from ? new Date(from) : new Date(now.getTime() - days * 24 * 3600 * 1000)
    const toDate = to ? new Date(to) : now
    const res = await fetch(`${API_BASE}/api/series?from=${encodeURIComponent(fromDate.toISOString())}&to=${encodeURIComponent(toDate.toISOString())}`)
    if (!res.ok) throw new Error('API error')
    const data = await res.json()
    return data
  } catch (err) {
    // fallback: return empty array (no mock data)
    return []
  }
}

export async function getEvents(threshold = 1000) {
  try {
    const res = await fetch(`${API_BASE}/api/events?threshold=${threshold}`)
    if (!res.ok) throw new Error('API error')
    const data = await res.json()
    return data.events || []
  } catch (err) {
    // fallback: return empty array (no mock data)
    return []
  }
}

export default { getReadings, getSeries, getEvents }
