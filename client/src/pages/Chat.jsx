import { useEffect, useRef, useState } from 'react'
import { SendHorizonal, Sparkles, MessagesSquare } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import toast from 'react-hot-toast'
import { useAuthStore } from '../stores/authStore'
import { createChatSession, getChatSessions, getChatThread, sendChatMessage } from '../services/chatService'

export default function Chat({ sessionId, onSessionChange, onCreateSession, onOpenSession }) {
  const token = useAuthStore((s) => s.token)
  const user = useAuthStore((s) => s.user)
  const [messages, setMessages] = useState([])
  const [sessions, setSessions] = useState([])
  const [currentSession, setCurrentSession] = useState(null)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingThread, setLoadingThread] = useState(true)
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  const resizeTextarea = () => {
    const element = textareaRef.current
    if (!element) return

    element.style.height = 'auto'
    const styles = window.getComputedStyle(element)
    const verticalPadding = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom)
    const lineHeight = parseFloat(styles.lineHeight) || 20
    const maxHeight = lineHeight * 5 + verticalPadding
    const nextHeight = Math.min(element.scrollHeight, maxHeight)

    element.style.height = `${nextHeight}px`
    element.style.overflowY = element.scrollHeight > maxHeight ? 'auto' : 'hidden'
  }

  const markdownComponents = {
    p: ({ children }) => <p className="mb-2 last:mb-0 whitespace-pre-wrap">{children}</p>,
    ul: ({ children }) => <ul className="mb-2 ml-5 list-disc space-y-1 last:mb-0">{children}</ul>,
    ol: ({ children }) => <ol className="mb-2 ml-5 list-decimal space-y-1 last:mb-0">{children}</ol>,
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    blockquote: ({ children }) => (
      <blockquote className="mb-2 border-l-4 border-indigo-200 pl-3 italic text-gray-600 last:mb-0">{children}</blockquote>
    ),
  }

  useEffect(() => {
    let mounted = true

    async function loadConversation() {
      if (!token) return
      setLoadingThread(true)
      try {
        const sessionsData = await getChatSessions(token)
        if (!mounted) return
        const availableSessions = sessionsData.sessions || []
        setSessions(availableSessions)

        let resolvedSessionId = sessionId || availableSessions[0]?.id || null
        if (!resolvedSessionId) {
          const created = await (onCreateSession ? onCreateSession() : createChatSession(token))
          if (!mounted) return
          const createdSession = created && created.session ? created.session : null
          if (createdSession && createdSession.id) {
            resolvedSessionId = createdSession.id
            setSessions((current) => [createdSession, ...current])
            onSessionChange?.(resolvedSessionId)
          } else {
            resolvedSessionId = null
          }
        }

        const thread = await getChatThread(token, resolvedSessionId)
        if (!mounted) return
        setCurrentSession(thread.session || null)
        setMessages(thread.messages || [])
        if (resolvedSessionId && resolvedSessionId !== sessionId) {
          onSessionChange?.(resolvedSessionId)
        }
      } catch (err) {
        if (err?.response?.status === 401) return
        const msg = err?.response?.data?.message || 'No se pudo cargar el chat'
        toast.error(msg)
      } finally {
        if (mounted) setLoadingThread(false)
      }
    }

    loadConversation()
    return () => {
      mounted = false
    }
  }, [token, sessionId, onCreateSession, onSessionChange])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    resizeTextarea()
  }, [input])

  async function handleSubmit(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text || loading) return

    setInput('')
    setLoading(true)
    const tempUserMessage = { id: `temp-${Date.now()}`, role: 'user', content: text }
    const tempAssistantMessage = { id: `typing-${Date.now()}`, role: 'assistant', content: '', typing: true }
    setMessages((current) => [...current, tempUserMessage, tempAssistantMessage])

    try {
      const data = await sendChatMessage(text, token, sessionId)
      if (data?.session?.id && data.session.id !== sessionId) {
        onSessionChange?.(data.session.id)
        setCurrentSession(data.session)
      }
      setMessages((current) =>
        current
          .filter((message) => message.id !== tempUserMessage.id && message.id !== tempAssistantMessage.id)
          .concat([data.userMessage, data.assistantMessage])
      )
      if (data?.session) {
        setCurrentSession(data.session)
      }
      if (data?.session?.title) {
        setSessions((current) => {
          const exists = current.some((item) => item.id === data.session.id)
          if (!exists) return [data.session, ...current]
          return current.map((item) => (item.id === data.session.id ? { ...item, ...data.session } : item))
        })
      }
    } catch (err) {
      setMessages((current) => current.filter((message) => message.id !== tempUserMessage.id && message.id !== tempAssistantMessage.id))
      if (err?.response?.status === 401) return
      const msg = err?.response?.data?.message || 'No se pudo enviar el mensaje'
      toast.error(msg)
      setInput(text)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateNewChat() {
    if (!token || loading) return
    try {
      const data = await (onCreateSession ? onCreateSession() : createChatSession(token))
      const newSession = data && data.session ? data.session : null
      if (newSession && newSession.id) {
        setSessions((current) => [newSession, ...current])
        setCurrentSession(newSession)
        setMessages([])
        onSessionChange?.(newSession.id)
        toast.success('Nuevo chat creado')
      } else {
        // Ephemeral chat: open UI without persisting until first message
        setCurrentSession(null)
        setMessages([])
        onSessionChange?.(null)
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'No se pudo crear un nuevo chat'
      toast.error(msg)
    }
  }

  async function handleSelectSession(nextSessionId) {
    if (!nextSessionId || nextSessionId === sessionId) return
    onSessionChange?.(nextSessionId)
    setLoadingThread(true)
    try {
      const thread = await getChatThread(token, nextSessionId)
      setCurrentSession(thread.session || null)
      setMessages(thread.messages || [])
      if (onOpenSession) onOpenSession(nextSessionId)
    } catch (err) {
      const msg = err?.response?.data?.message || 'No se pudo abrir la sesión'
      toast.error(msg)
    } finally {
      setLoadingThread(false)
    }
  }

  return (
    <div className="h-[calc(100dvh-3.5rem-env(safe-area-inset-bottom,0px))] min-h-0 flex flex-col bg-white overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-purple-200 bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 text-white shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-full bg-white/15 text-white flex items-center justify-center shadow-sm flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-white truncate">{currentSession?.title || 'Chat con Ágora'}</h2>
            <p className="text-xs text-white/90 truncate">{currentSession?.preview || (user?.name ? `Hola ${user.name}` : 'Conversación activa')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={handleCreateNewChat}
            className="rounded-full bg-white/15 px-3 py-2 text-sm font-semibold text-white hover:bg-white/25 transition flex items-center gap-2"
          >
            <span className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4 text-white" />
            </span>
            Crear nuevo chat
          </button>
        </div>
      </div>

      <div className="border-b border-gray-100 bg-white px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-3 mb-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Sesiones recientes</h3>
          <span className="text-xs text-gray-400">{sessions.length} chat{sessions.length === 1 ? '' : 's'}</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {sessions.slice(0, 6).map((session) => (
            <button
              key={session.id}
              type="button"
              onClick={() => handleSelectSession(session.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium border transition ${sessionId === session.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300 hover:text-indigo-700'}`}
            >
              {session.title === 'Nuevo chat' ? 'Chat nuevo' : session.title}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-0 px-3 sm:px-4 pt-3 sm:pt-4 pb-3 sm:pb-4 flex flex-col gap-3">
        <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5 space-y-4 bg-white border border-gray-100">
          {loadingThread && (
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <MessagesSquare className="w-4 h-4" />
              Cargando conversación...
            </div>
          )}

          {!loadingThread && messages.length === 0 && (
            <div className="rounded-2xl border border-dashed border-indigo-200 bg-white p-5 text-gray-700 shadow-sm">
              <p className="font-semibold text-indigo-700 mb-1">Hola {user?.name || 'de nuevo'}</p>
              <p>Escribe tu primer mensaje y la conversación quedará guardada aquí para la próxima vez.</p>
            </div>
          )}

          {messages.map((message) => {
            const isUser = message.role === 'user'
            const isTyping = message.typing
            return (
              <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                {isTyping ? (
                    <div className="rounded-md rounded-bl-md border border-gray-200 bg-white px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.2s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.1s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500" />
                      <span className="ml-2 text-xs font-medium text-gray-500">Ágora está escribiendo...</span>
                    </div>
                  </div>
                ) : (
                    <div className={`max-w-[88%] sm:max-w-[72%] rounded-md px-4 py-3 text-sm leading-relaxed ${isUser ? 'bg-indigo-600 text-white rounded-br-md' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'}`}>
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    ) : (
                      <div className="prose prose-sm max-w-none prose-p:my-0 prose-headings:my-0 prose-ul:my-0 prose-ol:my-0 prose-li:my-0 prose-strong:text-gray-900 prose-p:text-gray-800">
                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        <div className="shrink-0 border-t border-gray-100 bg-white px-3 sm:px-4 py-3 sm:py-3.5">
          <form onSubmit={handleSubmit}>
            <div className="flex items-end gap-3">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onInput={resizeTextarea}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
                placeholder="Escribe aquí tu mensaje..."
                rows={1}
                className="flex-1 min-h-[48px] max-h-[124px] resize-none rounded-2xl border border-gray-300 px-4 py-3 text-sm leading-5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-white font-semibold shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <SendHorizonal className="w-4 h-4" />
                Enviar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
