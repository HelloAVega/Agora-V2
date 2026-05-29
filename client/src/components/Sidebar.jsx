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
    <div className={`bg-gradient-to-b from-[#26153a] via-[#1f1230] to-[#140d20] text-white transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} min-h-screen flex flex-col fixed left-0 top-0 z-50 border-r border-[#4c2c73]/70 shadow-[0_0_40px_rgba(0,0,0,0.35)]`}>
      {/* Logo */}
      <div className="p-6 border-b border-[#4c2c73]">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-[#bd93f9] text-[#140d20] rounded-lg flex items-center justify-center font-bold shadow-lg shadow-[#bd93f9]/20">
              Á
            </div>
            <div>
              <h1 className="text-xl font-bold">Ágora</h1>
              {user && <p className="text-sm text-[#d9caf4] truncate">{user.name || user.email}</p>}
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="w-10 h-10 bg-[#bd93f9] text-[#140d20] rounded-lg flex items-center justify-center font-bold shadow-lg shadow-[#bd93f9]/20">
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
                  ? 'bg-[#5b3a8b] text-white shadow-lg shadow-[#bd93f9]/10'
                  : 'hover:bg-white/8 text-[#e8ddff]'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          )
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-[#4c2c73] space-y-2">
        <button onClick={() => logout()} className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/8 transition text-[#e8ddff]">
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium">Salir</span>}
        </button>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full text-center text-xs text-[#c9b9e6] hover:text-white py-2"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>
    </div>
  )
}
