import { Home, MessageCircle, BarChart3, Settings } from 'lucide-react'

const menuItems = [
  { id: 'home', label: 'Inicio', icon: Home },
  { id: 'chat', label: 'Chat', icon: MessageCircle },
  { id: 'analytics', label: 'Progreso', icon: BarChart3 },
  { id: 'settings', label: 'Ajustes', icon: Settings },
]

export default function BottomNav({ activeTab, setActiveTab, className = '' }) {
  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] transform-gpu transition-[transform,opacity] duration-300 ease-out ${className}`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      aria-label="Navegación principal"
    >
      <div className="flex items-stretch justify-around max-w-lg mx-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 px-1 min-h-[60px] transition-colors ${
                isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-500'
              }`}
            >
              <span
                className={`flex items-center justify-center w-10 h-7 rounded-full transition-colors ${
                  isActive ? 'bg-indigo-100' : ''
                }`}
              >
                <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
              </span>
              <span className={`text-[11px] leading-tight ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
