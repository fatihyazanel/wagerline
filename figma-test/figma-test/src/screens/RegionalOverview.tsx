import { useState } from 'react'
import { Award, Flame, Radio, Shield, Target, Users } from 'lucide-react'
import { CardHead, Chip, MetricRow, Progress, StatCard } from '../components/ui'

const regions = [
  { name: 'Marmara', dealers: 108, total: 84.7, strategic: 86.1, segmentation: 82.4, challenge: '74/108', topProduct: 'Smartphone' },
  { name: 'Ege', dealers: 112, total: 86.9, strategic: 88.2, segmentation: 84.1, challenge: '79/112', topProduct: 'Fiber' },
  { name: 'Akdeniz', dealers: 88, total: 78.2, strategic: 76.8, segmentation: 81.3, challenge: '58/88', topProduct: 'Superbox' },
  { name: 'Karadeniz', dealers: 92, total: 74.5, strategic: 72.2, segmentation: 79.5, challenge: '46/92', topProduct: 'Rekontratlama' },
]

const leagueRows = [
  ['Elmas', 14, 92.4],
  ['Platin', 31, 84.8],
  ['Altin', 28, 77.2],
  ['Gumus', 22, 69.6],
  ['Bronz', 13, 61.8],
]

export default function RegionalOverview() {
  const [selectedRegion, setSelectedRegion] = useState(regions[0].name)
  const region = regions.find((item) => item.name === selectedRegion) ?? regions[0]

  return (
    <div className="screen">
      <div className="stack">
        <section className="card card__pad">
          <CardHead title="Bolgesel Ozet" sub="Executive secilen bolgedeki bayi lig dagilimini, stratejik urun ortalamasini ve segmentasyon performansini gorur." right={<Chip tone="blue">{region.name}</Chip>} />
          <div className="selector-row selector-row--badges mt-24">
            {regions.map((item) => (
              <button key={item.name} className={`selector-pill ${item.name === selectedRegion ? 'is-active' : ''}`} onClick={() => setSelectedRegion(item.name)}>
                {item.name}
              </button>
            ))}
          </div>
        </section>

        <div className="grid-4">
          <StatCard label="Bayi" value={region.dealers} sub={`${region.name} bolgesi`} />
          <StatCard label="Ort. Gamification" value={region.total} sub="100'luk skala" pill="+2.1" pillTone="green" />
          <StatCard label="Challenge Katilim" value={region.challenge} sub="katilan / toplam bayi" />
          <StatCard label="En cok challenge" value={region.topProduct} sub="Secili bolgede" pill="Urun" pillTone="amber" />
        </div>

        <div className="grid-2">
          <section className="card card__pad">
            <CardHead title="Bayi Lig Dagilimi" inlineSub={`- ${region.name} - ${region.dealers} bayi`} />
            <table className="table">
              <thead>
                <tr>
                  <th>Lig</th>
                  <th>Bayi</th>
                  <th>Ort. Puan</th>
                  <th>Oran</th>
                </tr>
              </thead>
              <tbody>
                {leagueRows.map(([league, count, avg]) => (
                  <tr key={league as string}>
                    <td className="cell-strong"><span className="rowflex"><Award size={15} color="var(--amber)" /> {league}</span></td>
                    <td>{count}</td>
                    <td>{avg}</td>
                    <td>
                      <span className="rowflex">
                        <span className="miniprogress"><Progress value={Number(count) / region.dealers * 100} tone={league === 'Elmas' ? 'amber' : league === 'Platin' ? 'blue' : 'green'} /></span>
                        <span className="text-sm">%{Math.round(Number(count) / region.dealers * 100)}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="card card__pad">
            <CardHead title="Bolge Puan Ortalamalari" inlineSub="- secili bolge" />
            <MetricRow icon={<Target size={18} />} iconBg="var(--amber-bg)" iconColor="var(--amber)" name="Stratejik Urun Ort." sub="Aktif 6 urun agirlikli ortalama" progress={region.strategic} progressTone="amber" value={region.strategic} />
            <MetricRow icon={<Shield size={18} />} iconBg="var(--blue-bg)" iconColor="var(--blue)" name="Segmentasyon Ort." sub="Lig ici dealer_score normalize" progress={region.segmentation} progressTone="blue" value={region.segmentation} />
            <MetricRow icon={<Radio size={18} />} iconBg="var(--green-bg)" iconColor="var(--green)" name="En guclu urun" sub="Challenge ve rozet yogunluguna gore" value={region.topProduct} box />
          </section>
        </div>

        <section className="card card__pad">
          <CardHead title="Bolge Sinyalleri" sub="Secili bolge icin aksiyon sinyalleri." />
          <div className="grid-3">
            <div className="listbox listbox--green"><Users size={18} color="var(--green)" /><div><div className="b">Aktif bayi yogunlugu</div><div className="text-sm text-muted">{region.dealers} bayi ile takipte</div></div></div>
            <div className="listbox listbox--amber"><Flame size={18} color="var(--amber)" /><div><div className="b">Streak firsati</div><div className="text-sm text-muted">Fiber ve AKG Ciro rozetlerinde yukselis var</div></div></div>
            <div className="listbox listbox--blue"><Target size={18} color="var(--blue)" /><div><div className="b">Challenge odagi</div><div className="text-sm text-muted">{region.topProduct} urununde eslesme yogun</div></div></div>
          </div>
        </section>
      </div>
    </div>
  )
}
