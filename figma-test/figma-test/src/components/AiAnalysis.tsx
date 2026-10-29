import { Sparkles, ArrowRight } from 'lucide-react'
import { aiText } from '../data'

export default function AiAnalysis() {
  return (
    <section className="card ai">
      <div className="ai__title">
        <Sparkles size={18} color="#ec4899" />
        AI ANALİZİ
      </div>

      <p className="ai__text">{aiText}</p>
      <p className="ai__text">{aiText}</p>

      <hr className="card__sep" />
      <div className="card__foot">
        <a className="linkbtn" href="#">
          Daha fazla içgörü Ver
          <ArrowRight size={14} />
        </a>
      </div>
    </section>
  )
}
