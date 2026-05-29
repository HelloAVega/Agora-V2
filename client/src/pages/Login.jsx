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
      {error && <div className="text-[#ff79c6] mb-3">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded border border-[#4c2c73] bg-[#160f22] text-white placeholder:text-[#80699f] outline-none focus:border-[#bd93f9] focus:ring-2 focus:ring-[#bd93f9]/20"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded border border-[#4c2c73] bg-[#160f22] text-white placeholder:text-[#80699f] outline-none focus:border-[#bd93f9] focus:ring-2 focus:ring-[#bd93f9]/20"
        />
        <button className="w-full bg-[#7c3aed] text-white py-3 rounded shadow-lg shadow-[#7c3aed]/20 hover:bg-[#8b5cf6] transition">Entrar</button>
      </form>
      <p className="mt-4 text-sm">
        ¿No tienes cuenta?{' '}
        <button onClick={() => onSwitch('register')} className="text-[#bd93f9] underline">
          Regístrate
        </button>
      </p>
    </div>
  )
}
