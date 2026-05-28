const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta'
const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-flash-latest'

function getGeminiApiKey() {
  return process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || ''
}

function buildSystemInstruction() {
  return {
    parts: [
      {
        text: 'Eres Ágora, un asistente conversacional en español. Responde con tono cálido, claro y útil. Mantén las respuestas breves salvo que el usuario pida más detalle. No afirmes ser un profesional médico; si detectas riesgo grave o autolesión, recomienda buscar ayuda inmediata.',
      },
    ],
  }
}

async function generateReply(history) {
  const apiKey = getGeminiApiKey()
  if (!apiKey) {
    const error = new Error('Configura GEMINI_API_KEY en Heroku Config Vars o en el entorno del servidor')
    error.statusCode = 500
    throw error
  }

  const url = `${GEMINI_API_BASE}/models/${DEFAULT_MODEL}:generateContent`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      systemInstruction: buildSystemInstruction(),
      contents: history.map((message) => ({
        role: message.role,
        parts: [{ text: message.content }],
      })),
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 512,
      },
    }),
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(payload?.error?.message || 'Error llamando a Gemini')
    error.statusCode = response.status
    throw error
  }

  const text = payload?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim()
  if (!text) {
    const error = new Error('Gemini no devolvió una respuesta válida')
    error.statusCode = 502
    throw error
  }

  return { text, model: DEFAULT_MODEL }
}

module.exports = { generateReply, DEFAULT_MODEL }