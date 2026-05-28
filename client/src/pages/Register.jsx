import { useState } from 'react'
import { register } from '../services/authService'
import { useAuthStore } from '../stores/authStore'
import toast from 'react-hot-toast'

export default function Register({ onSwitch }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const setAuth = useAuthStore((s) => s.setAuth)
  const addToast = (m, t='info') => { if (t==='success') toast.success(m); else if (t==='error') toast.error(m); else toast(m) }

  const getPasswordScore = (pwd) => {
    let score = 0
    if (!pwd) return { score, label: 'Muy débil' }
    if (pwd.length >= 8) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^A-Za-z0-9]/.test(pwd)) score++
    const labels = ['Muy débil', 'Débil', 'Aceptable', 'Fuerte', 'Muy fuerte']
    return { score, label: labels[Math.min(score, labels.length - 1)] }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    // Basic validations
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRe.test(email)) return setError('Email inválido')
    if (!password || password.length < 8) return setError('La contraseña debe tener al menos 8 caracteres')

    try {
      const res = await register({ name, email, password })
      // Do NOT log the user in automatically. Show success and send to login view.
      addToast('Registro exitoso. Por favor inicia sesión.', 'success')
      onSwitch('login')
    } catch (err) {
      const parseError = (e) => {
        if (!e) return 'Unknown error'
        if (e.response) {
          const msg = e.response.data?.message || JSON.stringify(e.response.data)
          return `${e.response.status} - ${msg}`
        }
        return e.message || String(e)
      }
      const msg = parseError(err)
      setError(msg)
      addToast(msg, 'error')
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Registro</h2>
      {error && <div className="text-red-600 mb-3">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nombre (opcional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded"
        />
        <div>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded"
          />
          <div className="mt-2 text-sm text-gray-600">
            {getPasswordScore(password).label}
            <div className="w-full bg-gray-200 h-2 rounded mt-1">
              <div
                style={{ width: `${(getPasswordScore(password).score / 4) * 100}%` }}
                className="h-2 rounded bg-gradient-to-r from-emerald-400 to-indigo-600"
              />
            </div>
          </div>
        </div>
        <button className="w-full bg-emerald-600 text-white py-3 rounded">Crear cuenta</button>
      </form>
      <p className="mt-4 text-sm">
        ¿Ya tienes cuenta?{' '}
        <button onClick={() => onSwitch('login')} className="text-indigo-600 underline">
          Inicia sesión
        </button>
      </p>
    </div>
  )
}
