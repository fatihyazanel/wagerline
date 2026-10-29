import { BarChart3, Layers, Star, TrendingUp } from 'lucide-react'
import { kpis, type Kpi } from '../data'

const iconFor = (name: Kpi['icon']) => {
  switch (name) {
    case 'chart':
      return <BarChart3 size={18} />
    case 'layers':
      return <Layers size={18} />
    case 'star':
      return <Star size={18} />
  }
}

function KpiCard({ kpi }: { kpi: Kpi }) {
  return (
    <article className="card kpi">
      <div className="kpi__blob" style={{ background: kpi.accent }} />
      <div className="kpi__icon" style={{ background: `${kpi.accent}14`, color: kpi.accent }}>
        {iconFor(kpi.icon)}
      </div>

      <div className="kpi__title">{kpi.title}</div>
      <p className="kpi__formula">{kpi.formula}</p>

      <div className="kpi__valuerow">
        <span className="kpi__value">{kpi.value}</span>
        <span className="kpi__max">/100</span>
        <span className="kpi__delta">
          <TrendingUp size={13} />
          {kpi.delta}
        </span>
      </div>
      <p className="kpi__since">Önceki aya göre</p>

      <hr className="kpi__divider" />

      <div className="kpi__foot">
        <span className="kpi__foot-label">{kpi.footLabel}</span>
        <span className="kpi__foot-value">{kpi.footValue}</span>
      </div>
    </article>
  )
}

export default function KpiCards() {
  return (
    <section className="kpi-grid">
      {kpis.map((kpi) => (
        <KpiCard key={kpi.title} kpi={kpi} />
      ))}
    </section>
  )
}
