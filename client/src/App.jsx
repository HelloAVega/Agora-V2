import { useState } from 'react'
import './App.css'
import BottomNav from './components/BottomNav'
import Dashboard from './pages/Dashboard'

const pageTitles = {
  home: 'Panel de Control',
  chat: 'Chat con Ágora',
  analytics: 'Tu Progreso',
  settings: 'Configuración',
}

function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [language, setLanguage] = useState('es')

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content — padding inferior para la barra fija */}
      <div className="flex-1 pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))]">
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex justify-between items-center sticky top-0 z-40">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate pr-2">
            {pageTitles[activeTab]}
          </h1>
          <button
            type="button"
            onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
            className="flex-shrink-0 px-3 py-2 rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition text-sm font-medium"
          >
            {language === 'es' ? 'EN' : 'ES'}
          </button>
        </header>

        <main className="p-4 sm:p-6">
          {activeTab === 'home' && <Dashboard />}
          {activeTab === 'chat' && (
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-200">
              <p className="text-gray-600">Chat interface - Coming soon</p>
            </div>
          )}
          {activeTab === 'analytics' && (
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-200">
              <p className="text-gray-600">Analytics dashboard - Coming soon</p>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-200">
              <p className="text-gray-600">Settings page - Coming soon</p>
            </div>
          )}
        </main>
      </div>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  )
}

export default App
