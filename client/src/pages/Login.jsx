import { useState } from 'react'
import { login } from '../services/authService'
import { useAuthStore } from '../stores/authStore'
import toast from 'react-hot-toast'

export default function Login({ onSwitch }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const setAuth = useAuthStore((s) => s.setAuth)
  const addToast = (m, t='info') => { if (t==='success') toast.success(m); else if (t==='error') toast.error(m); else toast(m) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!email || !password) return setError('Email y contraseña son requeridos')
    try {
      const res = await login({ email, password })
      setAuth(res.token, res.user)
      addToast('Bienvenido', 'success')
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
      <h2 className="text-2xl font-bold mb-4">Iniciar sesión</h2>
      {error && <div className="text-red-600 mb-3">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border rounded"
        />
        <button className="w-full bg-indigo-600 text-white py-3 rounded">Entrar</button>
      </form>
      <p className="mt-4 text-sm">
        ¿No tienes cuenta?{' '}
        <button onClick={() => onSwitch('register')} className="text-indigo-600 underline">
          Regístrate
        </button>
      </p>
    </div>
  )
}
