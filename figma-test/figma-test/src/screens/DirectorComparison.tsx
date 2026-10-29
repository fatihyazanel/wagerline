import { Award, Flame, Shield, Target, Trophy, Users } from 'lucide-react'
import { CardHead, Chip, MetricRow, type Tone } from '../components/ui'

type Region = {
  rank: number
  name: string
  group: 'North' | 'South'
  dealers: number
  avg: number
  strategic: number
  segmentation: number
  badges: number
  streakDealers: number
  challengeJoin: string
  trend: string
  trendTone: Tone
}

const regions: Region[] = [
  { rank: 1, name: 'Ege', group: 'South', dealers: 112, avg: 86.9, strategic: 88.2, segmentation: 84.1, badges: 42, streakDealers: 18, challengeJoin: '79/112', trend: '+2.8%', trendTone: 'green' },
  { rank: 2, name: 'Marmara', group: 'North', dealers: 108, avg: 84.7, strategic: 86.1, segmentation: 82.4, badges: 39, streakDealers: 16, challengeJoin: '74/108', trend: '+1.4%', trendTone: 'green' },
  { rank: 3, name: 'Ic Anadolu', group: 'South', dealers: 96, avg: 81.4, strategic: 84.3, segmentation: 78.9, badges: 31, streakDealers: 12, challengeJoin: '51/96', trend: '+1.1%', trendTone: 'green' },
  { rank: 4, name: 'Akdeniz', group: 'South', dealers: 88, avg: 78.2, strategic: 76.8, segmentation: 81.3, badges: 27, streakDealers: 8, challengeJoin: '58/88', trend: '-0.8%', trendTone: 'red' },
  { rank: 5, name: 'Karadeniz', group: 'North', dealers: 92, avg: 74.5, strategic: 72.2, segmentation: 79.5, badges: 24, streakDealers: 7, challengeJoin: '46/92', trend: '+0.6%', trendTone: 'green' },
  { rank: 6, name: 'Dogu Anadolu', group: 'North', dealers: 72, avg: 69.8, strategic: 67.1, segmentation: 74.3, badges: 18, streakDealers: 4, challengeJoin: '31/72', trend: '-1.2%', trendTone: 'red' },
]

const groupSummary = {
  North: { avg: 76.3, dealers: 272, badges: 81, streak: 27, challenge: '151/272', strategic: 75.1, segmentation: 78.7 },
  South: { avg: 82.2, dealers: 296, badges: 100, streak: 38, challenge: '188/296', strategic: 83.1, segmentation: 81.4 },
}

export default function DirectorComparison() {
  return (
    <div className="screen">
      <div className="stack">
        <div className="compare-pane">
          {(['North', 'South'] as const).map((group) => {
            const summary = groupSummary[group]
            return (
              <section key={group} className={`card card__pad compare-side ${group === 'North' ? 'compare-side--north' : 'compare-side--south'}`}>
                <div className="rowflex">
                  <Trophy size={32} color={group === 'North' ? 'var(--blue)' : 'var(--amber)'} />
                  <div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>{group} Turkey</h3>
                    <div className="text-sm text-muted">Executive bolge grubu ozeti</div>
                  </div>
                </div>
                <div className="grid-2-eq" style={{ marginTop: 16 }}>
                  <div>
                    <div className="text-sm text-muted">Ort. Puan</div>
                    <div className="compare-big">{summary.avg}</div>
                    <Chip tone={group === 'South' ? 'green' : 'blue'}>{summary.challenge} challenge</Chip>
                  </div>
                  <div>
                    <div className="text-sm text-muted">Toplam Bayi</div>
                    <div className="compare-big">{summary.dealers}</div>
                    <div className="text-sm text-muted">{summary.badges} rozet kazanimi - {summary.streak} atesli bayi</div>
                  </div>
                </div>
                <div style={{ marginTop: 16 }}>
                  <MetricRow icon={<Target size={16} />} iconBg="var(--amber-bg)" iconColor="var(--amber)" name="Stratejik Urun" progress={summary.strategic} progressTone="amber" value={summary.strategic} />
                  <MetricRow icon={<Shield size={16} />} iconBg="var(--blue-bg)" iconColor="var(--blue)" name="Segmentasyon" progress={summary.segmentation} progressTone="blue" value={summary.segmentation} />
                </div>
              </section>
            )
          })}
        </div>

        <section className="card card__pad">
          <CardHead title="Bolge Bazli North / South Karsilastirmasi" sub="Her bolgenin ortalama puani, bu ayki rozet kazanimi, atesli bayi sayisi ve challenge katilim orani." />
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Bolge</th>
                <th>Grup</th>
                <th>Bayi</th>
                <th>Ort. Puan</th>
                <th>Bu Ay Rozet</th>
                <th>Atesli Bayi</th>
                <th>Challenge</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {regions.map((region) => (
                <tr key={region.name}>
                  <td className="b">{region.rank}</td>
                  <td className="cell-strong">{region.name}</td>
                  <td><Chip tone={region.group === 'North' ? 'blue' : 'amber'}>{region.group}</Chip></td>
                  <td><span className="rowflex"><Users size={13} /> {region.dealers}</span></td>
                  <td className="b">{region.avg}</td>
                  <td><span className="rowflex"><Award size={13} color="var(--amber)" /> {region.badges}</span></td>
                  <td><span className="rowflex"><Flame size={13} color="var(--red)" /> {region.streakDealers}</span></td>
                  <td>{region.challengeJoin}</td>
                  <td><Chip tone={region.trendTone}>{region.trend}</Chip></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  )
}
