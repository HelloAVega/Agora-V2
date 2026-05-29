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
    <div className="max-w-4xl mx-auto bg-[#221433]/90 rounded-xl p-6 sm:p-8 shadow-xl border border-[#4c2c73] text-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Ajustes</h2>
        <div className="text-sm text-[#c9b9e6]">Gestiona tu cuenta y preferencias</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: avatar + account summary */}
        <div className="space-y-4">
          <div className="flex flex-col items-center bg-[#160f22] rounded-lg p-4 border border-[#4c2c73]">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-[#2a193e] ring-2 ring-[#4c2c73] shadow-sm flex items-center justify-center mb-3">
              {user?.avatar ? (
                <img src={getAvatarSrc(user.avatar)} alt={user.name || 'Avatar'} className="w-full h-full object-cover object-center" />
              ) : (
                <span className="text-3xl text-[#f8f7ff]">{(user?.name || user?.email || 'U').charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="text-center">
              <div className="text-sm text-[#c9b9e6]">Cuenta</div>
              <div className="font-semibold text-[#f8f7ff] mt-1">{user ? (user.name || user.email) : 'No autenticado'}</div>
              <div className="text-xs text-[#a58fcf]">{user ? user.email : ''}</div>
            </div>
            <label className="mt-3">
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-2 bg-[#221433] border border-[#4c2c73] rounded cursor-pointer text-sm text-[#e8ddff] hover:border-[#bd93f9] transition">
                {uploading ? 'Subiendo...' : 'Cambiar foto'}
              </div>
            </label>
          </div>

          <div className="bg-[#160f22] rounded-lg p-4 border border-[#4c2c73]">
            <h4 className="text-sm font-medium text-[#d8caf5] mb-2">Seguridad</h4>
            <button onClick={()=>setShowConfirm(true)} className="w-full bg-[#6d28d9] text-white py-2 rounded hover:bg-[#7c3aed] transition">Cerrar sesión</button>
          </div>
        </div>

        {/* Middle: profile form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#160f22] rounded-lg p-6 border border-[#4c2c73]">
            <h3 className="text-lg font-semibold mb-3">Perfil</h3>
            <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div>
                <label className="block text-sm text-[#c9b9e6]">Nombre</label>
                <input className="w-full p-2 border border-[#4c2c73] rounded mt-1 bg-[#221433] text-white outline-none focus:border-[#bd93f9] focus:ring-2 focus:ring-[#bd93f9]/20" value={name} onChange={(e)=>setName(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-[#c9b9e6]">Email</label>
                <input className="w-full p-2 border border-[#4c2c73] rounded mt-1 bg-[#221433] text-white outline-none focus:border-[#bd93f9] focus:ring-2 focus:ring-[#bd93f9]/20" value={email} onChange={(e)=>setEmail(e.target.value)} />
              </div>
              <div className="md:col-span-2 flex items-center gap-3">
                <button type="submit" className="bg-[#7c3aed] text-white px-4 py-2 rounded shadow-lg shadow-[#7c3aed]/20 hover:bg-[#8b5cf6] transition">Guardar perfil</button>
                {statusMsg && <div className="text-sm text-[#bd93f9]">{statusMsg}</div>}
              </div>
            </form>
          </div>

          <div className="bg-[#160f22] rounded-lg p-6 border border-[#4c2c73]">
            <h3 className="text-lg font-semibold mb-3">Cambiar contraseña</h3>
            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="block text-sm text-[#c9b9e6]">Contraseña actual</label>
                <input type="password" placeholder="Contraseña actual" className="w-full p-2 border border-[#4c2c73] rounded mt-1 bg-[#221433] text-white placeholder:text-[#80699f] outline-none focus:border-[#bd93f9] focus:ring-2 focus:ring-[#bd93f9]/20" value={currentPassword} onChange={(e)=>setCurrentPassword(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-[#c9b9e6]">Nueva contraseña</label>
                <input type="password" placeholder="Nueva contraseña" className="w-full p-2 border border-[#4c2c73] rounded mt-1 bg-[#221433] text-white placeholder:text-[#80699f] outline-none focus:border-[#bd93f9] focus:ring-2 focus:ring-[#bd93f9]/20" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} />
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-sm text-[#c9b9e6]">{getPasswordScore(newPassword).label}</div>
                  <div className="w-1/2 bg-[#2a193e] h-2 rounded overflow-hidden">
                    <div style={{ width: `${(getPasswordScore(newPassword).score / 4) * 100}%` }} className="h-2 rounded bg-gradient-to-r from-[#ff79c6] via-[#bd93f9] to-[#8b5cf6]" />
                  </div>
                </div>
              </div>
              <div>
                <button type="submit" className="bg-[#7c3aed] text-white px-4 py-2 rounded shadow-lg shadow-[#7c3aed]/20 hover:bg-[#8b5cf6] transition">Cambiar contraseña</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {showConfirm && (
        <ConfirmModal title="Cerrar sesión" message="¿Estás seguro que deseas cerrar sesión?" onCancel={()=>setShowConfirm(false)} onConfirm={confirmLogout} />
      )}
    </div>
  )
}
