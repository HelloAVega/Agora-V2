import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'
import './App.css'
import BottomNav from './components/BottomNav'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import Settings from './pages/Settings'
import { useAuthStore } from './stores/authStore'
import { me as meRequest } from './services/authService'
import { Toaster } from 'react-hot-toast'

// Page titles removed to keep header minimal

function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('agora_theme') || 'light'
    } catch (e) {
      return 'light'
    }
  })
function ThemeApplier({ theme }) {
  useEffect(() => {
    try {
      document.documentElement.classList.toggle('dark', theme === 'dark')
    } catch (e) {}
  }, [theme])
  return null
}
  const token = useAuthStore((s) => s.token)
  const [authView, setAuthView] = useState('login')
  const user = useAuthStore((s) => s.user)
  const setAuth = useAuthStore((s) => s.setAuth)

  useEffect(() => {
    let mounted = true
    async function fetchMe() {
      if (token && !user) {
        try {
          const res = await meRequest(token)
          if (mounted && res && res.user) setAuth(token, res.user)
        } catch (e) {
          // token invalid or request failed - ignore
        }
      }
    }
    fetchMe()
    return () => {
      mounted = false
    }
  }, [token])

  // If not authenticated, render auth screens in their own full-screen layout
  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-full max-w-md p-6">
          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold">Iniciar sesión</h1>
            </div>

            {authView === 'login' && <Login onSwitch={setAuthView} />}
            {authView === 'register' && <Register onSwitch={setAuthView} />}
          </div>
          <div className="mt-4 text-center text-sm text-gray-500">© Ágora</div>
        </div>
        <Toaster position="top-right" />
      </div>
    )
  }

  // Authenticated app layout
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content — padding inferior para la barra fija */}
      <div className="flex-1 pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))]">
        <header className="px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-100"
              aria-label="Abrir perfil"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name || 'Perfil'} className="w-full h-full object-cover" />
              ) : (
                <span>{(user?.name || user?.email || 'U').charAt(0).toUpperCase()}</span>
              )}
            </button>
            <div className="hidden sm:block">
              <div className="text-sm font-medium text-gray-900">{user?.name || user?.email}</div>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() => {
                const next = theme === 'light' ? 'dark' : 'light'
                setTheme(next)
                try { localStorage.setItem('agora_theme', next) } catch (e) {}
              }}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-100"
              aria-label="Alternar tema"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Apply theme to <html> */}
        <ThemeApplier theme={theme} />

        <main className="p-4 sm:p-6">
          {activeTab === 'home' && <Dashboard />}
          {activeTab === 'chat' && null}
          {activeTab === 'analytics' && (
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-200">
              <p className="text-gray-600">Analytics dashboard - Coming soon</p>
            </div>
          )}
          {activeTab === 'settings' && <Settings />}
        </main>
      </div>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      <Toaster position="top-right" />
    </div>
  )
}

export default App
