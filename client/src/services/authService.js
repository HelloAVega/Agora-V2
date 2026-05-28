import axios from 'axios'

// Use VITE_API_URL when provided (Docker dev). Otherwise use relative paths so
// the app works when frontend and backend are served from the same origin (Heroku).
const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || '' })

export const register = (data) => API.post('/api/auth/register', data).then((r) => r.data)
export const login = (data) => API.post('/api/auth/login', data).then((r) => r.data)
export const me = (token) =>
  API.get('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.data)

export const updateProfile = (data, token) => API.put('/api/auth/me', data, { headers: { Authorization: `Bearer ${token}` } }).then((r)=>r.data)
export const changePassword = (data, token) => API.post('/api/auth/change-password', data, { headers: { Authorization: `Bearer ${token}` } }).then((r)=>r.data)

export default API
