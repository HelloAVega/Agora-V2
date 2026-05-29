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
    <div className="bg-[#221433]/90 rounded-lg p-4 shadow-xl border border-[#4c2c73]">
      <h4 className="font-semibold mb-2">Registro rápido</h4>
      <p className="text-sm text-[#c9b9e6] mb-3">¿Cómo te sientes ahora? Selecciona y escribe una nota corta.</p>
      <div className="flex items-center gap-3 mb-3">
        <button onClick={() => setMood('good')} className={`px-3 py-2 rounded border ${mood==='good'?'bg-[#163028] text-[#8df0c7] border-[#2d6b57]':'bg-[#160f22] text-[#c9b9e6] border-[#4c2c73]'}`}>🙂 Bien</button>
        <button onClick={() => setMood('neutral')} className={`px-3 py-2 rounded border ${mood==='neutral'?'bg-[#2a193e] text-[#d3c1f0] border-[#4c2c73]':'bg-[#160f22] text-[#c9b9e6] border-[#4c2c73]'}`}>😐 Regular</button>
        <button onClick={() => setMood('bad')} className={`px-3 py-2 rounded border ${mood==='bad'?'bg-[#3b2a12] text-[#f8d18c] border-[#6b4a1f]':'bg-[#160f22] text-[#c9b9e6] border-[#4c2c73]'}`}>☹️ Mal</button>
      </div>
      <form onSubmit={handleSave} className="space-y-2">
        <textarea value={note} onChange={(e)=>setNote(e.target.value)} placeholder="Añade una nota (opcional)" className="w-full p-2 border border-[#4c2c73] rounded h-20 bg-[#160f22] text-white placeholder:text-[#80699f] outline-none focus:border-[#bd93f9] focus:ring-2 focus:ring-[#bd93f9]/20" />
        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="px-4 py-2 bg-[#7c3aed] text-white rounded shadow-lg shadow-[#7c3aed]/20 hover:bg-[#8b5cf6] transition">Guardar</button>
        </div>
      </form>
    </div>
  )
}
