import axios from 'axios'

const api = (token) => axios.create({ baseURL: import.meta.env.VITE_API_URL || '', headers: { Authorization: `Bearer ${token}` } })

export async function postCheckin(token, payload) {
  const a = api(token)
  const res = await a.post('/api/mood/checkin', payload)
  return res.data
}

export async function getEntries(token) {
  const a = api(token)
  const res = await a.get('/api/mood/entries')
  return res.data
}

export async function getInsights(token) {
  const a = api(token)
  const res = await a.get('/api/mood/insights')
  return res.data
}

export async function getTimeline(token) {
  const a = api(token)
  const res = await a.get('/api/mood/timeline')
  return res.data
}

export async function generateRecommendation(token) {
  const a = api(token)
  const res = await a.post('/api/mood/generate')
  return res.data
}
