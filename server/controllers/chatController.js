const sequelize = require('../config/database')
const { Op } = require('sequelize')
const ChatSession = require('../models/chatSession')
const ChatMessage = require('../models/chatMessage')
const { generateReply, DEFAULT_MODEL } = require('../services/geminiService')

const HISTORY_LIMIT = 20

function cleanText(text) {
  return String(text || '').replace(/\s+/g, ' ').trim()
}

function buildSessionTitleFromMessage(message) {
  const text = cleanText(message)
  if (!text) return 'Nuevo chat'

  const normalized = text
    .replace(/^[¿¡\s]+/, '')
    .replace(/[¿?!.]+$/g, '')
    .replace(/^(quiero hablar de|necesito ayuda con|ayuda con|hablar de|sobre)\s+/i, '')

  const words = normalized.split(' ').filter(Boolean).slice(0, 6)
  if (!words.length) return 'Nuevo chat'

  const snippet = words.join(' ')
  return `Chat sobre ${snippet.charAt(0).toUpperCase()}${snippet.slice(1)}`.slice(0, 48)
}

function buildPreviewFromMessage(message, role = 'assistant') {
  const text = cleanText(message)
  if (!text) return 'Sin mensajes todavía'
  const prefix = role === 'user' ? 'Tú: ' : 'Ágora: '
  return `${prefix}${text}`.slice(0, 88)
}

function serializeSession(session, preview = '') {
  return {
    id: session.id,
    userId: session.userId,
    title: session.title,
    preview,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
    lastMessageAt: session.lastMessageAt,
  }
}

async function getOrCreateSession(userId, sessionId = null) {
  if (sessionId) {
    const selected = await ChatSession.findOne({ where: { id: sessionId, userId } })
    if (selected) return selected
  }

  // Return the most recent session only if it has at least one message (lastMessageAt set)
  const latest = await ChatSession.findOne({
    where: { userId, lastMessageAt: { [require('sequelize').Op.ne]: null } },
    order: [['lastMessageAt', 'DESC'], ['updatedAt', 'DESC'], ['createdAt', 'DESC']],
  })

  if (latest) return latest

  // Do not auto-create an empty session here; caller can create a session when saving first message.
  return null
}

function mapMessage(message) {
  return {
    id: message.id,
    role: message.role,
    content: message.content,
    model: message.model,
    createdAt: message.createdAt,
  }
}

async function getThread(req, res) {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' })

  try {
    const session = await getOrCreateSession(req.user.id, req.query.sessionId || null)
    if (!session) {
      return res.json({ session: null, messages: [] })
    }

    const messages = await ChatMessage.findAll({
      where: { chatSessionId: session.id },
      order: [['createdAt', 'ASC']],
      limit: 200,
    })

    return res.json({ session: serializeSession(session), messages: messages.map(mapMessage) })
  } catch (err) {
    console.error('GetThread error', err)
    return res.status(500).json({ message: 'Server error' })
  }
}

async function getSessions(req, res) {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' })

  try {
    const sessions = await ChatSession.findAll({
      where: { userId: req.user.id },
      order: [['lastMessageAt', 'DESC'], ['updatedAt', 'DESC'], ['createdAt', 'DESC']],
    })

    const sessionsWithPreview = await Promise.all(sessions.map(async (session) => {
      const lastMessage = await ChatMessage.findOne({
        where: { chatSessionId: session.id },
        order: [['createdAt', 'DESC']],
      })

        const preview = lastMessage
          ? buildPreviewFromMessage(lastMessage.content, lastMessage.role)
          : 'Sin mensajes todavía'

      return serializeSession(session, preview)
    }))

    return res.json({ sessions: sessionsWithPreview })
  } catch (err) {
    console.error('GetSessions error', err)
    return res.status(500).json({ message: 'Server error' })
  }
}

async function createSession(req, res) {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' })

  try {
    // Do not persist an empty session. Return null to indicate a new ephemeral session on client.
    return res.status(200).json({ session: null })
  } catch (err) {
    console.error('CreateSession error', err)
    return res.status(500).json({ message: 'Server error' })
  }
}

async function sendMessage(req, res) {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' })

  const { message, sessionId } = req.body
  if (!message || !message.trim()) {
    return res.status(400).json({ message: 'Message required' })
  }

  try {
    let session = await getOrCreateSession(req.user.id, sessionId || null)
    // If no session exists (no previous messages), create a new one now to attach the incoming messages
    if (!session) {
      session = await ChatSession.create({ userId: req.user.id, title: 'Nuevo chat', lastMessageAt: null })
    }

    const recentMessages = await ChatMessage.findAll({
      where: { chatSessionId: session.id },
      order: [['createdAt', 'DESC']],
      limit: HISTORY_LIMIT,
    })

    const history = recentMessages
      .reverse()
      .map((item) => ({ role: item.role === 'assistant' ? 'model' : 'user', content: item.content }))
    history.push({ role: 'user', content: message.trim() })

    const reply = await generateReply(history)

    const result = await sequelize.transaction(async (transaction) => {
      const nextTitle = session.title === 'Nuevo chat'
        ? buildSessionTitleFromMessage(message)
        : session.title

      const userMessage = await ChatMessage.create({
        chatSessionId: session.id,
        role: 'user',
        content: message.trim(),
      }, { transaction })

      const assistantMessage = await ChatMessage.create({
        chatSessionId: session.id,
        role: 'assistant',
        content: reply.text,
        model: reply.model || DEFAULT_MODEL,
      }, { transaction })

      await session.update({
        title: nextTitle,
        lastMessageAt: new Date(),
      }, { transaction })

      return { userMessage, assistantMessage, session }
    })

    return res.status(201).json({
      session: serializeSession(result.session),
      userMessage: mapMessage(result.userMessage),
      assistantMessage: mapMessage(result.assistantMessage),
    })
  } catch (err) {
    console.error('SendMessage error', err)
    return res.status(err.statusCode || 500).json({ message: err.message || 'Server error' })
  }
}

module.exports = { getThread, getSessions, createSession, sendMessage }