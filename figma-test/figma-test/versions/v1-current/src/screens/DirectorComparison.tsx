import { Shield, Target } from 'lucide-react'
import { CardHead, Chip, MetricRow, type Tone } from '../components/ui'

type Region = {
  rank: number
  name: string
  dir: 'North' | 'South'
  dealers: string
  score: string
  trend: string
  trendTone: Tone
  bonus?: string
}

const regions: Region[] = [
  { rank: 1, name: 'Ege', dir: 'South', dealers: '112', score: '7.420', trend: '▲ +2.8%', trendTone: 'green', bonus: '+%6' },
  { rank: 2, name: 'Marmara', dir: 'North', dealers: '108', score: '6.890', trend: '▲ +1.4%', trendTone: 'green', bonus: '+%3' },
  { rank: 3, name: 'İç Anadolu Güney', dir: 'South', dealers: '96', score: '6.640', trend: '— 0.0%', trendTone: 'default', bonus: '+%2' },
  { rank: 4, name: 'Akdeniz', dir: 'South', dealers: '88', score: '6.420', trend: '▼ -0.8%', trendTone: 'red' },
  { rank: 5, name: 'Karadeniz', dir: 'North', dealers: '92', score: '6.180', trend: '▲ +0.6%', trendTone: 'green' },
  { rank: 6, name: 'İç Anadolu Kuzey', dir: 'North', dealers: '78', score: '5.940', trend: '▲ +1.1%', trendTone: 'green' },
  { rank: 7, name: 'Doğu Anadolu', dir: 'North', dealers: '72', score: '5.840', trend: '▼ -1.2%', trendTone: 'red' },
  { rank: 8, name: 'Güneydoğu', dir: 'South', dealers: '64', score: '5.720', trend: '— 0.3%', trendTone: 'default' },
]

export default function DirectorComparison() {
  return (
    <div className="screen">
      <div className="stack">
        <div className="compare-pane">
          <section className="card card__pad compare-side compare-side--north">
            <div className="rowflex">
              <div style={{ fontSize: 36, lineHeight: 1 }}>🧭</div>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>North Turkey</h3>
                <div className="text-sm text-muted">Marmara, Karadeniz, Doğu Anadolu, İç Anadolu (kuzey)</div>
              </div>
            </div>
            <div className="grid-2-eq" style={{ marginTop: 16 }}>
              <div>
                <div className="text-sm text-muted">Ort. Puan</div>
                <div className="compare-big">6.840</div>
                <Chip tone="green">▲ +1.8%</Chip>
              </div>
              <div>
                <div className="text-sm text-muted">Toplam Bayi</div>
                <div className="compare-big">642</div>
                <div className="text-sm text-muted">7 bölge · 38 CSM</div>
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <MetricRow
                icon={<Shield size={16} />}
                iconBg="var(--purple-bg)"
                iconColor="var(--purple)"
                name="Segmentasyon"
                progress={84}
                progressTone="purple"
                value="84.2"
              />
              <MetricRow
                icon={<Target size={16} />}
                iconBg="var(--amber-bg)"
                iconColor="var(--amber)"
                name="Stratejik Ürün"
                progress={80}
                value="80.6"
              />
            </div>
          </section>

          <section className="card card__pad compare-side compare-side--south">
            <div className="rowflex">
              <div style={{ fontSize: 36, lineHeight: 1 }}>🏖️</div>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>South Turkey</h3>
                <div className="text-sm text-muted">Ege, Akdeniz, Güneydoğu, İç Anadolu (güney)</div>
              </div>
            </div>
            <div className="grid-2-eq" style={{ marginTop: 16 }}>
              <div>
                <div className="text-sm text-muted">Ort. Puan</div>
                <div className="compare-big">7.020</div>
                <Chip tone="green">▲ +2.4%</Chip>
              </div>
              <div>
                <div className="text-sm text-muted">Toplam Bayi</div>
                <div className="compare-big">606</div>
                <div className="text-sm text-muted">7 bölge · 36 CSM</div>
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <MetricRow
                icon={<Shield size={16} />}
                iconBg="var(--purple-bg)"
                iconColor="var(--purple)"
                name="Segmentasyon"
                progress={87}
                progressTone="purple"
                value="87.1"
              />
              <MetricRow
                icon={<Target size={16} />}
                iconBg="var(--amber-bg)"
                iconColor="var(--amber)"
                name="Stratejik Ürün"
                progress={84}
                value="84.3"
              />
            </div>
          </section>
        </div>

        <section className="card card__pad">
          <CardHead title="Bölge Sıralaması (14 Bölge)" inlineSub="· Bonus alacak ilk 3" />
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Bölge</th>
                <th>Direktörlük</th>
                <th>Bayi</th>
                <th>Ort. Puan</th>
                <th>Trend</th>
                <th className="num">Bonus</th>
              </tr>
            </thead>
            <tbody>
              {regions.map((r) => {
                const top3 = r.rank <= 3
                return (
                  <tr key={r.name}>
                    <td>{top3 ? <b>{r.rank}</b> : r.rank}</td>
                    <td className={top3 ? 'cell-strong' : undefined}>{r.name}</td>
                    <td>
                      <Chip tone={r.dir === 'North' ? 'blue' : 'amber'}>
                        {r.dir === 'North' ? '🧭 North' : '🏖️ South'}
                      </Chip>
                    </td>
                    <td>{r.dealers}</td>
                    <td>{r.score}</td>
                    <td>
                      <Chip tone={r.trendTone}>{r.trend}</Chip>
                    </td>
                    <td className="num">
                      {r.bonus ? <span className="b">{r.bonus}</span> : <span className="text-muted">—</span>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  )
}
