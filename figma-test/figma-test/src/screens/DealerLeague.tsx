import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, BarChart3, Trophy } from 'lucide-react'
import { CardHead, Chip, Hint, StatCard } from '../components/ui'
import { rankMetricOptions, rankingBoards, type RankMetricKey } from '../gamificationDemo'

const barsByMetric: Record<RankMetricKey, number[]> = {
  total: [18, 34, 52, 78, 96, 82, 64, 44],
  strategic: [24, 42, 74, 90, 76, 62, 46, 31],
  segmentation: [14, 28, 58, 86, 94, 72, 48, 26],
  fiber: [12, 24, 46, 70, 92, 88, 54, 30],
  superbox: [20, 36, 64, 84, 70, 50, 42, 28],
  akg: [16, 26, 44, 68, 86, 74, 52, 34],
  accessory: [28, 48, 76, 82, 58, 36, 25, 18],
  recontract: [22, 38, 56, 78, 84, 60, 42, 24],
  smartphone: [18, 34, 64, 88, 80, 58, 40, 22],
}

const countsByMetric: Record<RankMetricKey, number[]> = {
  total: [9, 18, 31, 44, 39, 22, 10, 3],
  strategic: [12, 24, 38, 41, 33, 18, 8, 2],
  segmentation: [7, 14, 29, 46, 43, 26, 9, 2],
  fiber: [18, 27, 35, 39, 31, 18, 6, 2],
  superbox: [22, 34, 46, 38, 23, 10, 3, 0],
  akg: [14, 24, 40, 42, 32, 17, 6, 1],
  accessory: [31, 44, 49, 28, 15, 7, 2, 0],
  recontract: [19, 31, 45, 39, 25, 12, 4, 1],
  smartphone: [11, 22, 42, 44, 34, 16, 6, 1],
}

export default function DealerLeague() {
  const [metric, setMetric] = useState<RankMetricKey>('total')
  const rows = rankingBoards[metric]
  const me = rows.find((row) => row.dealer === 'Sen') ?? rows[0]
  const label = rankMetricOptions.find((option) => option.key === metric)?.label ?? 'Total'
  const percentile = useMemo(() => Math.max(1, Math.round((me.rank / 176) * 100)), [me.rank])
  const topN = 5

  return (
    <div className="screen">
      <div className="stack">
        <section className="card card__pad">
          <CardHead title="Lig Pozisyonu" sub="Total gamification, stratejik urun, segmentasyon ve tum aktif rozetler icin ayni lig icindeki sirani secerek gor." />
          <div className="selector-row" style={{ marginTop: 14 }}>
            {rankMetricOptions.map((option) => (
              <button
                key={option.key}
                className={`selector-pill ${metric === option.key ? 'is-active' : ''}`}
                onClick={() => setMetric(option.key)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>

        <div className="grid-2-eq">
          <div className="anon-rank">
            <div className="anon-rank__label">{label.toUpperCase()} SIRAM</div>
            <div className="anon-rank__rank">{me.rank}<small>/176 bayi</small></div>
            <div className="anon-rank__meta">
              <div><div className="v">{me.score}</div><div className="l">Puanim</div></div>
              <div><div className="v">Top %{percentile}</div><div className="l">Lig dilimi</div></div>
              <div><div className="v">{rows[0].score}</div><div className="l">Pano lideri</div></div>
            </div>
          </div>

          <section className="card card__pad">
            <CardHead title="Pozisyon Cubugu" inlineSub={`- ${label}`} />
            <div className="position-bar">
              <div className="position-bar__fill" style={{ width: `${100 - percentile}%` }} />
              <div className="position-bar__me" style={{ left: `${100 - percentile}%` }} />
            </div>
            <div className="position-labels">
              <span>176. sira</span>
              <span>1. sira</span>
            </div>
            <div style={{ marginTop: 16 }}>
              <Hint tone="blue" icon={<Trophy size={16} />}>
                Bu ekran oneride bulunmaz; sadece secilen metrikte lig icindeki gercek yerini ve yakin rakipleri gosterir.
              </Hint>
            </div>
          </section>
        </div>

        <section className="card card__pad">
          <CardHead title="Platin Lig Puan Dagilimi" inlineSub={`- ${label}`} right={<Chip tone="amber">Secime gore guncellenir</Chip>} />
          <div className="distribution">
            {barsByMetric[metric].map((height, index) => (
              <div key={index} className={`bar ${index === 4 ? 'is-me' : ''}`} style={{ height: `${height}%` }}>
                <span className="bar-count">{countsByMetric[metric][index]}</span>
              </div>
            ))}
          </div>
          <div className="spread text-sm text-muted" style={{ marginTop: 8 }}>
            <span>0-50</span><span>50-60</span><span>60-70</span><span>70-80</span><span>80-90</span><span>90-100</span><span>100-110</span><span>110+</span>
          </div>
          <div style={{ marginTop: 16 }}>
            <Hint tone="brand" icon={<BarChart3 size={16} />}>
              {label} dagilimi sadece kendi ligin icin hesaplandi. 100 uzeri degerler rozet, ates ve challenge bonuslari nedeniyle olusabilir.
            </Hint>
          </div>
        </section>

        <section className="card card__pad">
          <CardHead title="Yakin Rakipler" sub="Ust ve alt bant maskeli; isimler acilmaz." />
          <table className="table">
            <thead>
              <tr><th>Sira</th><th>Bayi</th><th>Bolge</th><th className="num">Puan</th><th className="num">Fark</th></tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const bandClass = row.rank <= topN ? 'rank-row--top' : row.rank <= topN + 3 ? 'rank-row--near' : 'rank-row--far'
                const meDelta = row.dealer === 'Sen' ? (row.rank <= 5 ? -2 : row.rank >= 9 ? 3 : -1) : 0
                return (
                <tr key={`${metric}-${row.rank}-${row.dealer}`} className={`${bandClass} ${row.dealer === 'Sen' ? 'rank-row--me' : ''}`}>
                  <td className="b">{row.rank}</td>
                  <td>
                    {row.dealer === 'Sen' ? 'Bayi-3234' : '****'}
                    {row.dealer === 'Sen' && (
                      <span className={`rank-delta ${meDelta < 0 ? 'rank-delta--up' : 'rank-delta--down'}`} style={{ marginLeft: 8 }}>
                        {meDelta < 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                        onceki ay {Math.abs(meDelta)} sira
                      </span>
                    )}
                  </td>
                  <td>{row.region}</td>
                  <td className="num">{row.score}</td>
                  <td className="num">{row.diff}</td>
                </tr>
                )
              })}
            </tbody>
          </table>
        </section>

        <div className="grid-3">
          <StatCard label="Total siram" value="4." sub="Gamification toplam puani" />
          <StatCard label="Stratejik urun siram" value="9." sub="Urun bonuslari dahil" />
          <StatCard label="Segmentasyon siram" value="5." sub="Kendi ligimde dealer_score" />
        </div>
      </div>
    </div>
  )
}
