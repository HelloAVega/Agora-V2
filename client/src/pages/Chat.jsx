import { useEffect, useRef, useState } from 'react'
import { SendHorizonal, Sparkles, MessagesSquare } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import toast from 'react-hot-toast'
import { useAuthStore } from '../stores/authStore'
import { getChatThread, sendChatMessage } from '../services/chatService'

export default function Chat() {
  const token = useAuthStore((s) => s.token)
  const user = useAuthStore((s) => s.user)
  const [messages, setMessages] = useState([])
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

  useEffect(() => {
    let mounted = true

    async function loadThread() {
      if (!token) return
      setLoadingThread(true)
      try {
        const data = await getChatThread(token)
        if (!mounted) return
        setMessages(data.messages || [])
      } catch (err) {
          if (err?.response?.status === 401) return
        const msg = err?.response?.data?.message || 'No se pudo cargar el chat'
        toast.error(msg)
      } finally {
        if (mounted) setLoadingThread(false)
      }
    }

    loadThread()
    return () => {
      mounted = false
    }
  }, [token])

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
      const data = await sendChatMessage(text, token)
      setMessages((current) =>
        current
          .filter((message) => message.id !== tempUserMessage.id && message.id !== tempAssistantMessage.id)
          .concat([data.userMessage, data.assistantMessage])
      )
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

  return (
    <div className="h-[calc(100vh-5.5rem-env(safe-area-inset-bottom,0px))] min-h-[540px] flex flex-col bg-gradient-to-b from-purple-50 via-white to-indigo-50 rounded-none">
      <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-purple-200 bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 text-white shadow-sm">
        <div className="w-11 h-11 rounded-full bg-white/15 text-white flex items-center justify-center shadow-sm">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Chat con Ágora</h2>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.10),_transparent_38%)]">
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4">
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
                  <div className="rounded-2xl rounded-bl-md border border-gray-200 bg-white px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.2s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.1s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500" />
                      <span className="ml-2 text-xs font-medium text-gray-500">Ágora está escribiendo...</span>
                    </div>
                  </div>
                ) : (
                  <div className={`max-w-[88%] sm:max-w-[72%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${isUser ? 'bg-indigo-600 text-white rounded-br-md' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'}`}>
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

        <form onSubmit={handleSubmit} className="border-t border-gray-200 bg-white/95 backdrop-blur-sm p-3 sm:p-4">
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
  )
}