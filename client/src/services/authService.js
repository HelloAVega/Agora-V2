import axios from 'axios'

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001' })

export const register = (data) => API.post('/api/auth/register', data).then((r) => r.data)
export const login = (data) => API.post('/api/auth/login', data).then((r) => r.data)
export const me = (token) =>
  API.get('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.data)

export const updateProfile = (data, token) => API.put('/api/auth/me', data, { headers: { Authorization: `Bearer ${token}` } }).then((r)=>r.data)
export const changePassword = (data, token) => API.post('/api/auth/change-password', data, { headers: { Authorization: `Bearer ${token}` } }).then((r)=>r.data)

export default API
