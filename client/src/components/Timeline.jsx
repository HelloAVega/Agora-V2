import { useEffect, useState } from 'react'
import { getTimeline } from '../services/insightsService'
import { useAuthStore } from '../stores/authStore'

export default function Timeline() {
  const token = useAuthStore((s) => s.token)
  const [timeline, setTimeline] = useState([])

  useEffect(()=>{ let mounted=true; if (!token) return; getTimeline(token).then(d=>{ if (mounted) setTimeline(d.timeline || []) }).catch(()=>{}); return ()=>{ mounted=false } },[token])

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <h4 className="font-semibold mb-2">Línea de tiempo emocional</h4>
      {timeline.length===0 && <p className="text-sm text-gray-600">Aún sin datos en la línea de tiempo.</p>}
      {timeline.map((week)=> (
        <div key={week.week} className="mb-3">
          <div className="text-xs text-gray-500 mb-1">{week.week}</div>
          <div className="grid gap-2">
            {week.entries.slice(0,5).map(e=> (
              <div key={e.id} className="flex items-start gap-3">
                <div className="text-sm font-medium">{e.mood}</div>
                <div className="text-sm text-gray-600">{e.note || ''}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
