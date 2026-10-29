import { CardHead, Chip, StatCard, Hint, Avatar, Progress, gradients, type Tone } from '../components/ui'

type ProgressTone = 'purple' | 'blue' | 'green' | 'amber' | undefined

type Row = {
  initials: string
  gradient: string
  name: string
  loc: string
  dealers: string
  score: string
  activity: string
  activityTone: Tone
  perf: number
  perfTone: ProgressTone
  trend: string
  trendTone: Tone
  risk?: boolean
}

const rows: Row[] = [
  { initials: 'SY', gradient: gradients.amberOrange, name: 'Selin Yıldız', loc: 'İst. Anadolu', dealers: '18', score: '7.140', activity: '14/18 (%78)', activityTone: 'green', perf: 78, perfTone: undefined, trend: '▲ +4.2%', trendTone: 'green' },
  { initials: 'AD', gradient: gradients.blueSky, name: 'Ali Demir', loc: 'İst. Avrupa-1', dealers: '22', score: '7.310', activity: '19/22 (%86)', activityTone: 'green', perf: 86, perfTone: 'blue', trend: '▲ +5.8%', trendTone: 'green' },
  { initials: 'MA', gradient: gradients.purplePink, name: 'Murat Aslan', loc: 'İst. Avrupa-2', dealers: '20', score: '6.940', activity: '15/20 (%75)', activityTone: 'default', perf: 69, perfTone: 'purple', trend: '— 0.4%', trendTone: 'default' },
  { initials: 'BŞ', gradient: gradients.greenTeal, name: 'Burcu Şahin', loc: 'Kocaeli', dealers: '16', score: '6.820', activity: '14/16 (%87)', activityTone: 'green', perf: 68, perfTone: 'green', trend: '▲ +2.1%', trendTone: 'green' },
  { initials: 'TE', gradient: gradients.redOrange, name: 'Tolga Erim', loc: 'Bursa', dealers: '18', score: '6.420', activity: '9/18 (%50)', activityTone: 'red', perf: 55, perfTone: undefined, trend: '▼ -2.8%', trendTone: 'red', risk: true },
  { initials: 'AY', gradient: gradients.amberOrange, name: 'Ayşe Yılmaz', loc: 'Tekirdağ', dealers: '14', score: '6.890', activity: '12/14 (%86)', activityTone: 'green', perf: 72, perfTone: undefined, trend: '▲ +1.4%', trendTone: 'green' },
]

export default function RegionalCsms() {
  return (
    <div className="screen">
      <div className="stack">
        <div className="grid-4">
          <StatCard label="CSM Sayım" value="6" sub="Marmara bölgesi" />
          <StatCard label="Toplam Bayi" value="108" sub="CSM'ler aracılığıyla" />
          <StatCard label="Bölge Ort. Puan" value="6.890" sub="2. sırada · +%3 bonus" />
          <StatCard label="CSM Aktiflik" value="94%" sub="Challenge atama oranı" />
        </div>

        <section className="card card__pad">
          <CardHead title="CSM Performans Tablosu" inlineSub="· Sana bağlı 6 CSM" />
          <table className="table">
            <thead>
              <tr>
                <th>CSM</th>
                <th>Bayi</th>
                <th>Ort. Final Puan</th>
                <th>Challenge Aktiflik</th>
                <th>Bayi Performansı</th>
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
                  <td>{r.dealers}</td>
                  <td className="cell-strong">{r.score}</td>
                  <td>
                    <Chip tone={r.activityTone}>{r.activity}</Chip>
                  </td>
                  <td>
                    <span className="miniprogress">
                      <Progress value={r.perf} tone={r.perfTone} />
                    </span>
                  </td>
                  <td>
                    <Chip tone={r.trendTone}>{r.trend}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <Hint tone="amber">
          💡 <b>Aksiyon:</b> Tolga Erim'in (Bursa) challenge atama oranı düşük. Kendisiyle 1-1 görüşme planla.
        </Hint>
      </div>
    </div>
  )
}
