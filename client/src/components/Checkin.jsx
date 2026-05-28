import { useState } from 'react'
import toast from 'react-hot-toast'
import { postCheckin } from '../services/insightsService'
import { useAuthStore } from '../stores/authStore'

export default function Checkin({ onSaved }) {
  const token = useAuthStore((s) => s.token)
  const [mood, setMood] = useState('neutral')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSave(e) {
    e.preventDefault()
    if (!token) return toast.error('No autorizado')
    setSaving(true)
    try {
      await postCheckin(token, { mood, note })
      toast.success('Check-in guardado')
      setNote('')
      onSaved && onSaved()
    } catch (err) {
      toast.error('No se pudo guardar')
    } finally { setSaving(false) }
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <h4 className="font-semibold mb-2">Registro rápido</h4>
      <p className="text-sm text-gray-600 mb-3">¿Cómo te sientes ahora? Selecciona y escribe una nota corta.</p>
      <div className="flex items-center gap-3 mb-3">
        <button onClick={() => setMood('good')} className={`px-3 py-2 rounded ${mood==='good'?'bg-emerald-100':'bg-gray-100'}`}>🙂 Bien</button>
        <button onClick={() => setMood('neutral')} className={`px-3 py-2 rounded ${mood==='neutral'?'bg-yellow-100':'bg-gray-100'}`}>😐 Regular</button>
        <button onClick={() => setMood('bad')} className={`px-3 py-2 rounded ${mood==='bad'?'bg-red-100':'bg-gray-100'}`}>☹️ Mal</button>
      </div>
      <form onSubmit={handleSave} className="space-y-2">
        <textarea value={note} onChange={(e)=>setNote(e.target.value)} placeholder="Añade una nota (opcional)" className="w-full p-2 border rounded h-20" />
        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="px-4 py-2 bg-indigo-600 text-white rounded">Guardar</button>
        </div>
      </form>
    </div>
  )
}
