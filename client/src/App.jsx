import { useState, useEffect } from 'react'
import './App.css'
import BottomNav from './components/BottomNav'
import Chat from './pages/Chat'
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
  const token = useAuthStore((s) => s.token)
  const [authView, setAuthView] = useState('login')
  const user = useAuthStore((s) => s.user)
  const setAuth = useAuthStore((s) => s.setAuth)
  const logout = useAuthStore((s) => s.logout)

  useEffect(() => {
    let mounted = true
    async function fetchMe() {
      if (token && !user) {
        try {
          const res = await meRequest(token)
          if (mounted && res && res.user) setAuth(token, res.user)
        } catch (e) {
          if (e?.response?.status === 401) {
            logout()
          }
        }
      }
    }
    fetchMe()
    return () => {
      mounted = false
    }
  }, [token, logout, setAuth, user])

  // If not authenticated, render auth screens in their own full-screen layout
  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-full max-w-md p-6">
          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-md border border-gray-200">
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
        <main className={activeTab === 'chat' ? 'h-full' : 'p-4 sm:p-6'}>
          {activeTab === 'home' && <Dashboard onStartChat={() => setActiveTab('chat')} />}
          {activeTab === 'chat' && <Chat />}
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
