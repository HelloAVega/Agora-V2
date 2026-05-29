import { useEffect, useMemo, useState } from 'react'
import { ChevronRight, Plus, History } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '../stores/authStore'
import { createChatSession, getChatSessions } from '../services/chatService'
import Checkin from '../components/Checkin'
import SummaryPanel from '../components/SummaryPanel'
import Timeline from '../components/Timeline'

export default function Dashboard({ onOpenSession, onCreateSession }) {
  const token = useAuthStore((s) => s.token)
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  const formatDateTime = (value) => {
    if (!value) return 'Sin chats todavía'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return 'Sin chats todavía'
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const getRelativeTime = (value) => {
    if (!value) return 'Sin chats todavía'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return 'Sin chats todavía'

    const diffMs = Date.now() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays <= 0) return 'Hoy'
    if (diffDays === 1) return 'Hace 1 día'
    if (diffDays < 30) return `Hace ${diffDays} días`

    const diffMonths = Math.floor(diffDays / 30)
    if (diffMonths === 1) return 'Hace 1 mes'
    return `Hace ${diffMonths} meses`
  }

  const stats = useMemo(() => ({
    totalSessions: sessions.length,
    thisMonth: sessions.filter((session) => {
      const createdAt = session.createdAt ? new Date(session.createdAt) : null
      if (!createdAt) return false
      const now = new Date()
      return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear()
    }).length,
    lastChatDate: formatDateTime(sessions[0]?.lastMessageAt || sessions[0]?.updatedAt || sessions[0]?.createdAt),
    lastChatRelative: getRelativeTime(sessions[0]?.lastMessageAt || sessions[0]?.updatedAt || sessions[0]?.createdAt),
    averageMood: sessions.length ? 'Activo' : 'Sin actividad'
  }), [sessions])

  useEffect(() => {
    let mounted = true

    async function loadSessions() {
      if (!token) return
      setLoading(true)
      try {
        const data = await getChatSessions(token)
        if (!mounted) return
        setSessions(data.sessions || [])
      } catch (err) {
        const msg = err?.response?.data?.message || 'No se pudieron cargar las sesiones'
        toast.error(msg)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadSessions()
    return () => {
      mounted = false
    }
  }, [token])

  async function handleCreateSession() {
    if (!token || creating) return
    setCreating(true)
    try {
      const data = onCreateSession ? await onCreateSession() : await createChatSession(token)
      const session = data && data.session ? data.session : null
      if (session && session.id) {
        setSessions((current) => [session, ...current])
        onOpenSession?.(session.id)
      } else {
        // No session persisted yet (ephemeral) — open chat view without session id
        onOpenSession?.()
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'No se pudo crear un nuevo chat'
      toast.error(msg)
    } finally {
      setCreating(false)
    }
  }

  const getMoodColor = (mood) => {
    const colors = {
      'Ansioso': 'bg-[#3b2a12] text-[#f8d18c] border border-[#6b4a1f]',
      'Triste': 'bg-[#17233c] text-[#9dc1ff] border border-[#2f4f7a]',
      'Neutral': 'bg-[#2a193e] text-[#d3c1f0] border border-[#4c2c73]',
      'Feliz': 'bg-[#163028] text-[#8df0c7] border border-[#2d6b57]',
      'Mejorando': 'bg-[#1f2f24] text-[#a8f0c1] border border-[#35664b]'
    }
    return colors[mood] || 'bg-[#2a193e] text-[#d3c1f0] border border-[#4c2c73]'
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="space-y-8">
        {/* Welcome Section removed for cleaner UI */}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="rounded-lg p-6 shadow-xl border border-[#4c2c73] bg-[#221433]/90">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#c9b9e6]">Total de Sesiones</span>
              <span className="text-2xl">💬</span>
            </div>
            <p className="text-3xl font-bold text-[#bd93f9]">{stats.totalSessions}</p>
            <p className="text-xs text-[#a58fcf] mt-2">Desde que empezaste</p>
          </div>

          <div className="rounded-lg p-6 shadow-xl border border-[#4c2c73] bg-[#221433]/90">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#c9b9e6]">Este Mes</span>
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-3xl font-bold text-[#8df0c7]">{stats.thisMonth}</p>
            <p className="text-xs text-[#a58fcf] mt-2">Sesiones completadas</p>
          </div>

          <div className="rounded-lg p-6 shadow-xl border border-[#4c2c73] bg-[#221433]/90">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#c9b9e6]">Último Chat</span>
              <span className="text-2xl">📅</span>
            </div>
            <p className="text-lg font-bold text-[#f8f7ff]">{stats.lastChatDate}</p>
            <p className="text-xs text-[#a58fcf] mt-2">{stats.lastChatRelative}</p>
          </div>

          <div className="rounded-lg p-6 shadow-xl border border-[#4c2c73] bg-[#221433]/90">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#c9b9e6]">Tu Evolución</span>
              <span className="text-2xl">📈</span>
            </div>
            <p className="text-lg font-bold text-[#8df0c7]">{stats.averageMood}</p>
            <p className="text-xs text-[#a58fcf] mt-2">Tendencia positiva</p>
          </div>
        </div>

        {/* Main Action */}
        <div className="mb-12">
          <button onClick={handleCreateSession} className="w-full bg-gradient-to-r from-[#7c3aed] via-[#6d28d9] to-[#4c1d95] text-white py-6 px-8 rounded-xl hover:shadow-lg hover:shadow-[#bd93f9]/20 transition transform hover:scale-105 flex items-center justify-center space-x-3 font-semibold text-lg disabled:opacity-60" disabled={creating}>
            <Plus className="w-6 h-6" />
            <span>{creating ? 'Creando chat...' : 'Crear nuevo chat'}</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
          <div className="space-y-4 mb-6">
            <Checkin onSaved={() => { /* reload insights later if needed */ }} />
            <SummaryPanel />
          </div>

        {/* Recent Sessions */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-[#f8f7ff] flex items-center space-x-2">
              <History className="w-6 h-6 text-[#bd93f9]" />
              <span>Sesiones Recientes</span>
            </h3>
          </div>

          <div className="space-y-4">
            {loading && (
              <div className="rounded-lg bg-[#221433]/90 p-6 shadow-xl border border-[#4c2c73] text-[#c9b9e6]">Cargando sesiones...</div>
            )}

            {!loading && sessions.length === 0 && (
              <div className="rounded-lg bg-[#221433]/90 p-6 shadow-xl border border-[#4c2c73] text-[#c9b9e6]">
                Todavía no hay sesiones. Crea el primer chat para empezar.
              </div>
            )}

            {!loading && sessions.slice(0, 3).map((session) => (
              <div
                key={session.id}
                className="bg-[#221433]/90 rounded-lg p-6 shadow-xl border border-[#4c2c73] hover:border-[#bd93f9]/50 transition cursor-pointer"
                onClick={() => onOpenSession?.(session.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-sm font-semibold text-[#f8f7ff]">
                        {session.createdAt ? new Date(session.createdAt).toLocaleDateString() : 'Sin fecha'} • {session.createdAt ? new Date(session.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${getMoodColor(session.title === 'Nuevo chat' ? 'Neutral' : 'Mejorando')}`}>
                        {session.title === 'Nuevo chat' ? 'Nuevo' : 'Activo'}
                      </span>
                    </div>
                    <p className="text-[#efe8ff] mb-2">{session.preview || session.title}</p>
                    <p className="text-sm text-[#a58fcf]">{session.title}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#8f74b8] flex-shrink-0 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 bg-[#17233c] border border-[#2f4f7a] rounded-lg p-6">
          <h4 className="font-semibold text-[#9dc1ff] mb-2">💡 Recuerda</h4>
          <p className="text-[#d0ddff]">
            Este espacio es completamente anónimo y confidencial. Todo lo que compartas está protegido 
            y supervisado. Si necesitas ayuda inmediata, siempre puedes 
            comunicarte con un profesional de salud mental.
          </p>
        </div>
        <div className="mt-6">
          <Timeline />
        </div>
      </div>
    </div>
  )
}
