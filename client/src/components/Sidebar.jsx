import { Home, MessageCircle, BarChart3, Settings, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '../stores/authStore'

export default function Sidebar({ activeTab, setActiveTab }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const logout = useAuthStore((s) => s.logout)
  const user = useAuthStore((s) => s.user)

  const menuItems = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'analytics', label: 'Progreso', icon: BarChart3 },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ]

  return (
    <div className={`bg-gradient-to-b from-indigo-900 to-indigo-800 text-white transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} min-h-screen flex flex-col fixed left-0 top-0 z-50`}>
      {/* Logo */}
      <div className="p-6 border-b border-indigo-700">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-indigo-400 rounded-lg flex items-center justify-center font-bold">
              Á
            </div>
            <div>
              <h1 className="text-xl font-bold">Ágora</h1>
              {user && <p className="text-sm text-indigo-200 truncate">{user.name || user.email}</p>}
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="w-10 h-10 bg-indigo-400 rounded-lg flex items-center justify-center font-bold">
            Á
          </div>
        )}
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'hover:bg-indigo-700 text-indigo-100'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          )
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-indigo-700 space-y-2">
        <button onClick={() => logout()} className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-indigo-700 transition text-indigo-100">
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium">Salir</span>}
        </button>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full text-center text-xs text-indigo-300 hover:text-indigo-100 py-2"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>
    </div>
  )
}
