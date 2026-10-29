import { Trophy } from 'lucide-react'
import { CardHead, Chip, StatCard, Avatar, SegTabs, gradients, type Tone } from '../components/ui'

type Row = {
  initials: string
  gradient: string
  name: string
  loc: string
  lig: string
  ligTone: Tone
  final: string
  seg: string
  strat: string
  challenge: string
  challengeTone: Tone
  rozet: number
  rozetTrophy: boolean
  trend: string
  trendTone: Tone
  risk?: boolean
}

const rows: Row[] = [
  { initials: 'MK', gradient: gradients.bluePurple, name: 'Mehmet Kaya', loc: 'Beşiktaş', lig: 'Lig 5', ligTone: 'default', final: '7.250', seg: '85.6', strat: '82.4', challenge: '%60', challengeTone: 'green', rozet: 4, rozetTrophy: true, trend: '▲ +8.4%', trendTone: 'green' },
  { initials: 'AT', gradient: gradients.amberOrange, name: 'Ayşe Tunç', loc: 'Kadıköy', lig: 'Lig 3', ligTone: 'amber', final: '7.730', seg: '92.1', strat: '88.7', challenge: '%85', challengeTone: 'green', rozet: 6, rozetTrophy: true, trend: '▲ +5.1%', trendTone: 'green' },
  { initials: 'EB', gradient: gradients.greenTeal, name: 'Emre Bilgin', loc: 'Üsküdar', lig: 'Lig 4', ligTone: 'default', final: '7.610', seg: '88.4', strat: '85.2', challenge: '%48', challengeTone: 'default', rozet: 5, rozetTrophy: true, trend: '— 0.3%', trendTone: 'default' },
  { initials: 'CD', gradient: gradients.redOrange, name: 'Can Demir', loc: 'Maltepe', lig: 'Lig 6', ligTone: 'default', final: '5.840', seg: '62.3', strat: '58.1', challenge: 'Yok', challengeTone: 'red', rozet: 1, rozetTrophy: false, trend: '▼ -4.2%', trendTone: 'red', risk: true },
  { initials: 'ZD', gradient: gradients.purplePink, name: 'Zeynep Duran', loc: 'Pendik', lig: 'Lig 5', ligTone: 'default', final: '6.940', seg: '78.3', strat: '74.6', challenge: '%72', challengeTone: 'green', rozet: 3, rozetTrophy: true, trend: '▲ +6.8%', trendTone: 'green' },
  { initials: 'NÖ', gradient: gradients.blueSky, name: 'Nur Özkan', loc: 'Kartal', lig: 'Lig 5', ligTone: 'default', final: '7.180', seg: '82.7', strat: '79.4', challenge: '%55', challengeTone: 'default', rozet: 4, rozetTrophy: true, trend: '▲ +2.1%', trendTone: 'green' },
  { initials: 'HG', gradient: gradients.amberOrange, name: 'Hakan Güler', loc: 'Tuzla', lig: 'Lig 5', ligTone: 'default', final: '7.020', seg: '80.1', strat: '76.8', challenge: '%70', challengeTone: 'green', rozet: 3, rozetTrophy: true, trend: '— 0.5%', trendTone: 'default' },
]

export default function CsmDealers() {
  return (
    <div className="screen">
      <div className="stack">
        <div className="grid-4">
          <StatCard label="Bayilerim" value="18" sub="Marmara · İstanbul Anadolu" />
          <StatCard label="Ort. Final Puan" value="7.140" sub="▲ +2.8% vs Nisan" />
          <StatCard label="Aktif Challenge" value={<>14<small>/18</small></>} sub="4 bayi henüz seçmedi" />
          <StatCard label="Risk Altında" pill="!" pillTone="red" value="3" sub="Min. ay kuralı eşiğinde" />
        </div>

        <section className="card card__pad">
          <CardHead
            title="Bayilerim — Performans Listesi"
            inlineSub="· Mayıs 2026"
            right={
              <>
                <SegTabs tabs={['Hepsi', 'Risk altında', 'Top performer']} />
                <button className="btn btn--ghost">CSV</button>
              </>
            }
          />
          <table className="table">
            <thead>
              <tr>
                <th>Bayi</th>
                <th>Lig</th>
                <th>Final Puan</th>
                <th>Segmentasyon</th>
                <th>Stratejik</th>
                <th>Challenge</th>
                <th>Rozet</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.name} className={r.risk ? 'is-risk' : undefined}>
                  <td>
                    <div className="avatar-cell">
                      <Avatar initials={r.initials} gradient={r.gradient} />
                      <div>
                        <div className="b">{r.name}</div>
                        <small>{r.loc}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Chip tone={r.ligTone}>{r.lig}</Chip>
                  </td>
                  <td className="cell-strong">{r.final}</td>
                  <td>{r.seg}</td>
                  <td>{r.strat}</td>
                  <td>
                    <Chip tone={r.challengeTone}>{r.challenge}</Chip>
                  </td>
                  <td>
                    <span className="rowflex" style={{ gap: 4 }}>
                      {r.rozet}
                      {r.rozetTrophy && <Trophy size={13} color="var(--amber)" />}
                    </span>
                  </td>
                  <td>
                    <Chip tone={r.trendTone}>{r.trend}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-sm text-muted" style={{ marginTop: 16 }}>
            11 bayi daha · Tüm bayileri görmek için filtreyi kullan
          </p>
        </section>
      </div>
    </div>
  )
}
