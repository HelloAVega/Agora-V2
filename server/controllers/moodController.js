const MoodEntry = require('../models/moodEntry')
const User = require('../models/user')
const { Op } = require('sequelize')
const ChatSession = require('../models/chatSession')
const ChatMessage = require('../models/chatMessage')
const { generateReply } = require('../services/geminiService')

async function checkin(req, res) {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ message: 'No autorizado' })
    const { mood, score, note } = req.body
    if (!mood) return res.status(400).json({ message: 'Mood es requerido' })
    const entry = await MoodEntry.create({ userId, mood, score: score || null, note: note || null })
    return res.json({ entry })
  } catch (err) {
    console.error('checkin error', err)
    return res.status(500).json({ message: 'Error guardando check-in' })
  }
}

async function getEntries(req, res) {
  try {
    const userId = req.user?.id
    const { limit = 100 } = req.query
    const entries = await MoodEntry.findAll({ where: { userId }, order: [['createdAt', 'DESC']], limit: Number(limit) })
    return res.json({ entries })
  } catch (err) {
    console.error('getEntries error', err)
    return res.status(500).json({ message: 'Error obteniendo entradas' })
  }
}

function summarizeNotes(notes) {
  const text = notes.filter(Boolean).join(' ').toLowerCase()
  const words = text.split(/[^a-záéíóúñ0-9]+/).filter(Boolean)
  const stop = new Set(['y','de','la','el','que','en','los','las','con','para','por','me','mi','se','no','un','una'])
  const freq = {}
  for (const w of words) if (!stop.has(w) && w.length>2) freq[w] = (freq[w]||0)+1
  const items = Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([w,c])=>w)
  return items
}

async function insights(req, res) {
  try {
    const userId = req.user?.id
    const entries = await MoodEntry.findAll({ where: { userId }, order: [['createdAt','DESC']], limit: 200 })
    // Simple stats
    const total = entries.length
    const counts = entries.reduce((acc,e)=>{ acc[e.mood]=(acc[e.mood]||0)+1; return acc }, {})
    const notes = entries.map(e=>e.note).filter(Boolean)
    const common = summarizeNotes(notes)

    // Trend: average score last 7 days vs previous 7 days
    const now = new Date()
    const sevenAgo = new Date(now.getTime() - 7*24*60*60*1000)
    const prevStart = new Date(now.getTime() - 14*24*60*60*1000)
    const recent = entries.filter(e=> new Date(e.createdAt) >= sevenAgo && e.score)
    const prev = entries.filter(e=> new Date(e.createdAt) >= prevStart && new Date(e.createdAt) < sevenAgo && e.score)
    const avg = arr => arr.length ? (arr.reduce((s,i)=>s+(i.score||0),0)/arr.length) : null
    const recentAvg = avg(recent)
    const prevAvg = avg(prev)

    // Simple recommendation rules
    const recommendations = []
    if (recentAvg === null && total === 0) recommendations.push('Haz tu primer check-in diario para comenzar el seguimiento.')
    if (recentAvg !== null && prevAvg !== null && recentAvg < prevAvg) recommendations.push('Parece que has estado peor esta semana; intenta ejercicios de respiración y contacta a alguien de confianza.')
    if ((counts['bad']||0) > (counts['good']||0)) recommendations.push('Considera practicar rutinas cortas de autocuidado y revisar tu plan semanal.')
    if (common.length) recommendations.push('Temas recurrentes: ' + common.join(', '))

    // Mini weekly plan (very simple)
    const weeklyPlan = [
      { day: 'Lunes', goal: 'Respiración 5 minutos' },
      { day: 'Miércoles', goal: 'Caminar 20 minutos' },
      { day: 'Viernes', goal: 'Escribe 5 cosas positivas' }
    ]

    return res.json({ total, counts, recentAvg, prevAvg, common, recommendations, weeklyPlan })
  } catch (err) {
    console.error('insights error', err)
    return res.status(500).json({ message: 'Error generando insights' })
  }
}

async function timeline(req, res) {
  try {
    const userId = req.user?.id
    const entries = await MoodEntry.findAll({ where: { userId }, order: [['createdAt','DESC']], limit: 200 })
    // Group by week (ISO week starting Monday) simple grouping by year-week
    const groups = {}
    for (const e of entries) {
      const d = new Date(e.createdAt)
      const wk = `${d.getFullYear()}-W${Math.ceil(((d - new Date(d.getFullYear(),0,1))/(24*60*60*1000)+d.getDay()+1)/7)}`
      groups[wk] = groups[wk] || []
      groups[wk].push(e)
    }
    const timeline = Object.entries(groups).map(([k,v])=>({ week:k, entries:v }))
    return res.json({ timeline })
  } catch (err) {
    console.error('timeline error', err)
    return res.status(500).json({ message: 'Error obteniendo timeline' })
  }
}

module.exports = { checkin, getEntries, insights, timeline, generateRecommendation }

async function generateRecommendation(req, res) {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ message: 'No autorizado' })

    // Fetch the 4 most recent sessions and up to the first 4 messages of each (to save tokens)
    const sessions = await ChatSession.findAll({ where: { userId }, order: [['createdAt','DESC']], limit: 4 })
    const sessionSummaries = []
    for (const s of sessions) {
      const messages = await ChatMessage.findAll({ where: { chatSessionId: s.id }, order: [['createdAt','ASC']], limit: 4 })
      const preview = messages.length ? messages.map(m => `${m.role === 'user' ? 'Tú' : 'Ágora'}: ${m.content}`).join('\n') : 'Sin mensajes todavía'
      sessionSummaries.push({
        createdAt: s.createdAt,
        title: s.title,
        messages: messages.map(m => ({ role: m.role, content: m.content, createdAt: m.createdAt })),
        preview,
      })
    }

    // Fetch timeline (mood entries) but limit to last 4 weeks to reduce tokens
    const now = new Date()
    const fourWeeksAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000)
    const entries = await MoodEntry.findAll({ where: { userId, createdAt: { [Op.gte]: fourWeeksAgo } }, order: [['createdAt','DESC']], limit: 200 })
    const groups = {}
    for (const e of entries) {
      const d = new Date(e.createdAt)
      const wk = `${d.getFullYear()}-W${Math.ceil(((d - new Date(d.getFullYear(),0,1))/(24*60*60*1000)+d.getDay()+1)/7)}`
      groups[wk] = groups[wk] || []
      groups[wk].push(e)
    }

    // Build prompt content with explicit output format and example to improve quality
    let prompt = 'A continuación tienes contexto del usuario: sesiones recientes y su línea de tiempo emocional (últimas 4 semanas).\n\n'
    prompt += 'POR FAVOR: genera un **Resumen automático** en **Markdown** con exactamente estas secciones:\n'
    prompt += '- Un encabezado "#### Resumen automático" con la línea "Entradas totales: N"\n'
    prompt += '- Una subsección "**Recomendaciones:**" con 1–3 ítems accionables y concretos (lista con `-`).\n'
    prompt += '- Una subsección "**Mini-plan semanal:**" con 3 actividades para Lunes/Miércoles/Viernes (cada ítem en la forma `- Día: Acción`).\n'
    prompt += 'Sé empático, directo y prioriza acciones prácticas que no requieran recursos externos. Responde sólo en Markdown, sin metadatos ni explicaciones adicionales.\n\n'
    prompt += 'Ejemplo de salida esperada:\n\n'
    prompt += '#### Resumen automático\n'
    prompt += 'Entradas totales: 3\n\n'
    prompt += '**Recomendaciones:**\n'
    prompt += '- Considera practicar rutinas cortas de autocuidado y revisar tu plan semanal.\n\n'
    prompt += '**Mini-plan semanal:**\n'
    prompt += '- Lunes: Respiración 5 minutos\n'
    prompt += '- Miércoles: Caminar 20 minutos\n'
    prompt += '- Viernes: Escribe 5 cosas positivas\n\n'
    prompt += 'Ahora genera la salida usando el contexto siguiente:\n\n'
    prompt += '### Sesiones Recientes\n\n'
    for (const s of sessionSummaries) {
      const date = new Date(s.createdAt).toLocaleString('es-ES')
      prompt += `${date} — ${s.title}\n`
      // include up to first 4 messages for context
      if (s.messages && s.messages.length) {
        for (const m of s.messages) {
          const who = m.role === 'user' ? 'Tú' : 'Ágora'
          prompt += `${who}: ${m.content}\n`
        }
      } else {
        prompt += 'Sin mensajes todavía\n'
      }
      prompt += '\n'
    }

    prompt += '#### Línea de tiempo emocional (últimas 4 semanas)\n\n'
    for (const [wk, arr] of Object.entries(groups)) {
      prompt += `${wk}\n`
      for (const e of arr.slice(0,5)) {
        prompt += `${e.mood}${e.note?` — ${e.note}`:''}\n`
      }
      prompt += '\n'
    }

    // Call Gemini
    const history = [{ role: 'user', content: prompt }]
    const reply = await generateReply(history)
    return res.json({ recommendation: reply.text })
  } catch (err) {
    console.error('generateRecommendation error', err)
    return res.status(err.statusCode || 500).json({ message: err.message || 'Error generando recomendación' })
  }
}
