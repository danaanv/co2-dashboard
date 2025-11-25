require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 4000

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
})

// health
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
})

// GET /api/readings?limit=20
app.get('/api/readings', async (req, res) => {
  const limit = Math.min(1000, parseInt(req.query.limit || '20'))
  try {
    const q = `SELECT window_end AS time, co2_avg_ppm AS co2 FROM co2_window_stats ORDER BY window_end DESC LIMIT $1`
    const r = await pool.query(q, [limit])
    // return ordered ascending (oldest first) for convenience in charts
    const rows = r.rows.reverse()
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/series?from=&to=
app.get('/api/series', async (req, res) => {
  try {
    const from = req.query.from ? new Date(req.query.from) : new Date(Date.now() - 24 * 3600 * 1000)
    const to = req.query.to ? new Date(req.query.to) : new Date()
    const q = `SELECT window_end AS time, dev_eui as metric, co2_avg_ppm AS value, co2_min_ppm, co2_max_ppm FROM co2_window_stats WHERE window_end BETWEEN $1 AND $2 ORDER BY time`;
    const r = await pool.query(q, [from.toISOString(), to.toISOString()])
    res.json(r.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// compute events in server
function computeEvents(data, threshold = 1000) {
  const events = []
  let current = null
  for (let i = 0; i < data.length; i++) {
    const d = data[i]
    const ts = d.time || d.timestamp || d.window_end
    const co2 = Number(d.co2 ?? d.value ?? d.co2_avg_ppm)
    if (co2 > threshold) {
      if (!current) {
        current = { start: ts, end: ts, maxValue: co2 }
      } else {
        current.end = ts
        if (co2 > current.maxValue) current.maxValue = co2
      }
    } else {
      if (current) {
        const start = new Date(current.start)
        const end = new Date(current.end)
        const durationMinutes = Math.round((end - start) / 60000) || 0
        events.push({ start: current.start, end: current.end, durationMinutes, maxValue: current.maxValue })
        current = null
      }
    }
  }
  if (current) {
    const start = new Date(current.start)
    const end = new Date(current.end)
    const durationMinutes = Math.round((end - start) / 60000) || 0
    events.push({ start: current.start, end: current.end, durationMinutes, maxValue: current.maxValue })
  }
  return events
}

// GET /api/events?threshold=1000
app.get('/api/events', async (req, res) => {
  const threshold = parseInt(req.query.threshold || '1000')
  try {
    // fetch last 24h by default
    const from = new Date(Date.now() - 24 * 3600 * 1000)
    const to = new Date()
    const q = `SELECT window_end AS time, co2_avg_ppm AS co2 FROM co2_window_stats WHERE window_end BETWEEN $1 AND $2 ORDER BY window_end ASC`;
    const r = await pool.query(q, [from.toISOString(), to.toISOString()])
    const events = computeEvents(r.rows, threshold)
    res.json({ events })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
