import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getInsights, generateRecommendation } from '../services/insightsService'
import { useAuthStore } from '../stores/authStore'

export default function SummaryPanel() {
  const token = useAuthStore((s) => s.token)
  const [insights, setInsights] = useState(null)
  const [aiRec, setAiRec] = useState(null)
  const [generating, setGenerating] = useState(false)

  useEffect(()=>{ let mounted=true; if (!token) return; getInsights(token).then(d=>{ if (mounted) setInsights(d) }).catch(()=>{}); return ()=>{ mounted=false } },[token])

  if (!insights) return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">Cargando resumen…</div>
  )

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <h4 className="font-semibold mb-2">Resumen automático</h4>
      <p className="text-sm text-gray-600 mb-3">Las recomendaciones que verás a continuación se generan a partir de tu estado de ánimo registrado y de tus interacciones con la plataforma, con el objetivo de proponerte acciones prácticas y realistas.</p>
      <div className="mb-3">
        <button disabled={generating} onClick={async ()=>{
          if (!token) return
          try {
            setGenerating(true)
            setAiRec(null)
            const res = await generateRecommendation(token)
            setAiRec(res.recommendation)
          } catch (err) {
            console.error(err)
          } finally { setGenerating(false) }
        }} className="px-3 py-2 bg-indigo-600 text-white rounded">{generating? 'Generando…':'Generar recomendación con IA'}</button>
      </div>
      {/* Recomendaciones y mini-plan removidos del cuadro principal — se generan con IA si lo solicitas */}
      {aiRec && (
        <div className="mt-4 bg-gray-50 border border-gray-200 p-3 rounded">
          <h5 className="font-semibold mb-2">Recomendación generada</h5>
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiRec}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  )
}
