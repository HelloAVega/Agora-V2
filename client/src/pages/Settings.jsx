import { useAuthStore } from '../stores/authStore'
import { useState, useEffect } from 'react'
import ConfirmModal from '../components/ConfirmModal'
import API from '../services/authService'
import toast from 'react-hot-toast'

export default function Settings() {
  const logout = useAuthStore((s) => s.logout)
  const user = useAuthStore((s) => s.user)
  const [showConfirm, setShowConfirm] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [statusMsg, setStatusMsg] = useState(null)
  const [uploading, setUploading] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const updateUser = useAuthStore((s) => s.updateUser)
  const token = useAuthStore((s) => s.token)

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

  const getAvatarSrc = (avatar) => {
    if (!avatar) return null
    // If it is an absolute URL, normalize it to the current origin when it points
    // to localhost, otherwise keep the original URL.
    if (/^https?:\/\//i.test(avatar)) {
      try {
        const parsed = new URL(avatar)
        if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
          return `${window.location.origin}${parsed.pathname}`
        }
      } catch (e) {}
      return avatar
    }
    const baseUrl = API.defaults?.baseURL || window.location.origin
    return `${baseUrl}${avatar}`
  }

  async function handleUpdateProfile(e) {
    e.preventDefault()
    setStatusMsg(null)
    try {
      const res = await API.put('/api/auth/me', { name, email }, { headers: { Authorization: `Bearer ${token}` } })
      setStatusMsg('Perfil actualizado')
      // update store immediately
      if (res && res.data && res.data.user) updateUser(res.data.user)
      toast.success('Perfil actualizado')
    } catch (err) {
      const msg = err?.response?.data?.message || 'Error actualizando perfil'
      setStatusMsg(msg)
      toast.error(msg)
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault()
    setStatusMsg(null)
    try {
      const res = await API.post('/api/auth/change-password', { currentPassword, newPassword })
      const message = res?.message || res?.data?.message || 'Contraseña actualizada'
      setStatusMsg(message)
      toast.success(message)
      setCurrentPassword('')
      setNewPassword('')
    } catch (err) {
      const msg = err?.response?.data?.message || 'Error al cambiar contraseña'
      setStatusMsg(msg)
      toast.error(msg)
    }
  }

  async function confirmLogout() {
    setShowConfirm(false)
    logout()
  }

  // Autosave: debounce saving name/email when they change
  useEffect(() => {
    if (!token) return
    let mounted = true
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const shouldSave = (name !== (user?.name || '')) || (email !== (user?.email || ''))
    if (!shouldSave) return
    const timer = setTimeout(async () => {
      try {
        if (email && !emailRe.test(email)) {
          toast.error('Email inválido')
          return
        }
        const res = await API.put('/api/auth/me', { name, email }, { headers: { Authorization: `Bearer ${token}` } })
        if (!mounted) return
        if (res && res.data && res.data.user) {
          updateUser(res.data.user)
          toast.success('Perfil guardado')
        }
      } catch (err) {
        const msg = err?.response?.data?.message || 'Error autosave'
        toast.error(msg)
      }
    }, 800)

    return () => {
      mounted = false
      clearTimeout(timer)
    }
  }, [name, email, token])

  async function handleAvatarChange(e) {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const form = new FormData()
      form.append('avatar', file)
      // Let axios set Content-Type with boundary
      const res = await API.post('/api/auth/me/avatar', form, { headers: { Authorization: `Bearer ${token}` } })
      if (res && res.data && res.data.user) {
        updateUser(res.data.user)
        toast.success('Avatar actualizado')
      }
    } catch (err) {
      console.error('Avatar upload error:', err)
      const msg = err?.response?.data?.message || err.message || 'Error subiendo avatar'
      toast.error(msg)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold mb-4">Ajustes</h2>

      <div className="mb-6 flex items-center gap-4">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 ring-2 ring-indigo-100 shadow-sm flex items-center justify-center flex-shrink-0">
          {user?.avatar ? (
            <img src={getAvatarSrc(user.avatar)} alt={user.name || 'Avatar'} className="w-full h-full object-cover object-center" />
          ) : (
            <span className="text-xl text-gray-700">{(user?.name || user?.email || 'U').charAt(0).toUpperCase()}</span>
          )}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-600">Cuenta</h3>
          <p className="text-gray-800 mt-2 font-semibold">{user ? (user.name || user.email) : 'No autenticado'}</p>
          <p className="text-sm text-gray-500">{user ? user.email : ''}</p>
          <div className="mt-2">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              <span className="px-3 py-2 bg-gray-100 rounded text-sm">{uploading ? 'Subiendo...' : 'Cambiar foto'}</span>
            </label>
          </div>
        </div>
      </div>

      <form onSubmit={handleUpdateProfile} className="space-y-4 mb-6">
        <label className="block">
          <span className="text-sm text-gray-600">Nombre</span>
          <input className="w-full p-2 border rounded mt-1" value={name} onChange={(e)=>setName(e.target.value)} />
        </label>
        <label className="block">
          <span className="text-sm text-gray-600">Email</span>
          <input className="w-full p-2 border rounded mt-1" value={email} onChange={(e)=>setEmail(e.target.value)} />
        </label>
        <div className="flex gap-3">
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Guardar perfil</button>
        </div>
      </form>

      <form onSubmit={handleChangePassword} className="space-y-4 mb-6">
        <h3 className="text-sm font-medium text-gray-600">Cambiar contraseña</h3>
        <input type="password" placeholder="Contraseña actual" className="w-full p-2 border rounded" value={currentPassword} onChange={(e)=>setCurrentPassword(e.target.value)} />
        <input type="password" placeholder="Nueva contraseña" className="w-full p-2 border rounded" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} />
        <div className="mt-2 text-sm text-gray-600">
          {getPasswordScore(newPassword).label}
          <div className="w-full bg-gray-200 h-2 rounded mt-1">
            <div
              style={{ width: `${(getPasswordScore(newPassword).score / 4) * 100}%` }}
              className="h-2 rounded bg-gradient-to-r from-emerald-400 to-indigo-600"
            />
          </div>
        </div>
        <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded">Cambiar contraseña</button>
      </form>

      {statusMsg && <div className="text-sm text-indigo-700 mb-4">{statusMsg}</div>}

      <div className="space-y-3">
        <button onClick={()=>setShowConfirm(true)} className="w-full bg-red-600 text-white py-3 rounded hover:bg-red-700 transition font-medium">Cerrar sesión</button>
      </div>

      {showConfirm && (
        <ConfirmModal title="Cerrar sesión" message="¿Estás seguro que deseas cerrar sesión?" onCancel={()=>setShowConfirm(false)} onConfirm={confirmLogout} />
      )}
    </div>
  )
}
