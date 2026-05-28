import API from './authService'

export const getChatThread = (token) =>
  API.get('/api/chat/thread', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.data)

export const sendChatMessage = (message, token) =>
  API.post('/api/chat/message', { message }, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.data)