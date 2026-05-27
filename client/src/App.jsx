import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <header className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-2">
          Ágora
        </h1>
        <p className="text-lg text-indigo-700">
          Apoyo emocional híbrido - IA + Supervisión Profesional
        </p>
      </header>
    </div>
  )
}

export default App