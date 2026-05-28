import API from './authService'

export const getChatSessions = (token) =>
  API.get('/api/chat/sessions', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.data)

export const createChatSession = (token) =>
  API.post('/api/chat/sessions', {}, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.data)

export const getChatThread = (token, sessionId) =>
  API.get('/api/chat/thread', {
    params: sessionId ? { sessionId } : undefined,
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.data)

export const sendChatMessage = (message, token, sessionId) =>
  API.post('/api/chat/message', { message, sessionId }, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.data)