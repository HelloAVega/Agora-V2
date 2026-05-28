const sequelize = require('../config/database')
const ChatSession = require('../models/chatSession')
const ChatMessage = require('../models/chatMessage')
const { generateReply, DEFAULT_MODEL } = require('../services/geminiService')

const HISTORY_LIMIT = 20

async function getOrCreateSession(userId) {
  const [session] = await ChatSession.findOrCreate({
    where: { userId },
    defaults: { userId, title: 'Chat con Ágora' },
  })

  return session
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
    const session = await getOrCreateSession(req.user.id)
    const messages = await ChatMessage.findAll({
      where: { chatSessionId: session.id },
      order: [['createdAt', 'ASC']],
      limit: 200,
    })

    return res.json({
      session: { id: session.id, title: session.title },
      messages: messages.map(mapMessage),
    })
  } catch (err) {
    console.error('GetThread error', err)
    return res.status(500).json({ message: 'Server error' })
  }
}

async function sendMessage(req, res) {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' })

  const { message } = req.body
  if (!message || !message.trim()) {
    return res.status(400).json({ message: 'Message required' })
  }

  try {
    const session = await getOrCreateSession(req.user.id)

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

      return { userMessage, assistantMessage }
    })

    return res.status(201).json({
      session: { id: session.id, title: session.title },
      userMessage: mapMessage(result.userMessage),
      assistantMessage: mapMessage(result.assistantMessage),
    })
  } catch (err) {
    console.error('SendMessage error', err)
    return res.status(err.statusCode || 500).json({ message: err.message || 'Server error' })
  }
}

module.exports = { getThread, sendMessage }