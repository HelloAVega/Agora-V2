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
      {error && <div className="text-[#ff79c6] mb-3">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nombre (opcional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 rounded border border-[#4c2c73] bg-[#160f22] text-white placeholder:text-[#80699f] outline-none focus:border-[#bd93f9] focus:ring-2 focus:ring-[#bd93f9]/20"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded border border-[#4c2c73] bg-[#160f22] text-white placeholder:text-[#80699f] outline-none focus:border-[#bd93f9] focus:ring-2 focus:ring-[#bd93f9]/20"
        />
        <div>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded border border-[#4c2c73] bg-[#160f22] text-white placeholder:text-[#80699f] outline-none focus:border-[#bd93f9] focus:ring-2 focus:ring-[#bd93f9]/20"
          />
          <div className="mt-2 text-sm text-[#c9b9e6]">
            {getPasswordScore(password).label}
            <div className="w-full bg-[#2a193e] h-2 rounded mt-1 overflow-hidden">
              <div
                style={{ width: `${(getPasswordScore(password).score / 4) * 100}%` }}
                className="h-2 rounded bg-gradient-to-r from-[#ff79c6] via-[#bd93f9] to-[#8b5cf6]"
              />
            </div>
          </div>
        </div>
        <button className="w-full bg-[#7c3aed] text-white py-3 rounded shadow-lg shadow-[#7c3aed]/20 hover:bg-[#8b5cf6] transition">Crear cuenta</button>
      </form>
      <p className="mt-4 text-sm">
        ¿Ya tienes cuenta?{' '}
        <button onClick={() => onSwitch('login')} className="text-[#bd93f9] underline">
          Inicia sesión
        </button>
      </p>
    </div>
  )
}
