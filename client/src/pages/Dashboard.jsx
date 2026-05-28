import { useState } from 'react'
import { ChevronRight, Plus, History } from 'lucide-react'

export default function Dashboard({ onStartChat }) {
  const [stats] = useState({
    totalSessions: 12,
    thisMonth: 5,
    lastChatDate: '2024-05-24',
    averageMood: 'Mejorando'
  })

  const recentSessions = [
    {
      id: 1,
      date: '2024-05-24',
      time: '14:30',
      duration: '23 min',
      mood: 'Ansioso',
      summary: 'Conversación sobre estrés laboral'
    },
    {
      id: 2,
      date: '2024-05-22',
      time: '10:15',
      duration: '18 min',
      mood: 'Triste',
      summary: 'Apoyo emocional general'
    },
    {
      id: 3,
      date: '2024-05-20',
      time: '19:45',
      duration: '31 min',
      mood: 'Neutral',
      summary: 'Técnicas de relajación'
    }
  ]

  const getMoodColor = (mood) => {
    const colors = {
      'Ansioso': 'bg-yellow-100 text-yellow-800',
      'Triste': 'bg-blue-100 text-blue-800',
      'Neutral': 'bg-gray-100 text-gray-800',
      'Feliz': 'bg-green-100 text-green-800',
      'Mejorando': 'bg-emerald-100 text-emerald-800'
    }
    return colors[mood] || 'bg-indigo-100 text-indigo-800'
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="space-y-8">
        {/* Welcome Section removed for cleaner UI */}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-indigo-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Total de Sesiones</span>
              <span className="text-2xl">💬</span>
            </div>
            <p className="text-3xl font-bold text-indigo-600">{stats.totalSessions}</p>
            <p className="text-xs text-gray-500 mt-2">Desde que empezaste</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-indigo-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Este Mes</span>
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-3xl font-bold text-emerald-600">{stats.thisMonth}</p>
            <p className="text-xs text-gray-500 mt-2">Sesiones completadas</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-indigo-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Último Chat</span>
              <span className="text-2xl">📅</span>
            </div>
            <p className="text-lg font-bold text-gray-900">{stats.lastChatDate}</p>
            <p className="text-xs text-gray-500 mt-2">Hace 2 días</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-indigo-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Tu Evolución</span>
              <span className="text-2xl">📈</span>
            </div>
            <p className="text-lg font-bold text-emerald-600">{stats.averageMood}</p>
            <p className="text-xs text-gray-500 mt-2">Tendencia positiva</p>
          </div>
        </div>

        {/* Main Action */}
        <div className="mb-12">
          <button onClick={onStartChat} className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-6 px-8 rounded-xl hover:shadow-lg transition transform hover:scale-105 flex items-center justify-center space-x-3 font-semibold text-lg">
            <Plus className="w-6 h-6" />
            <span>Iniciar Nueva Sesión de Chat</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Recent Sessions */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <History className="w-6 h-6 text-indigo-600" />
              <span>Sesiones Recientes</span>
            </h3>
            <button className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center space-x-1">
              <span>Ver Todo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {recentSessions.map((session) => (
              <div
                key={session.id}
                className="bg-white rounded-lg p-6 shadow-sm border border-indigo-100 hover:shadow-md hover:border-indigo-200 transition cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {session.date} • {session.time}
                      </span>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${getMoodColor(session.mood)}`}>
                        {session.mood}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{session.summary}</p>
                    <p className="text-sm text-gray-500">Duración: {session.duration}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Recuerda</h4>
          <p className="text-blue-800">
            Este espacio es completamente anónimo y confidencial. Todo lo que compartas está protegido 
            y supervisado por psicólogos profesionales. Si necesitas ayuda inmediata, siempre puedes 
            comunicarte con un profesional de salud mental.
          </p>
        </div>
      </div>
    </div>
  )
}
