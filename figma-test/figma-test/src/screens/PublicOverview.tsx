import { useState } from 'react'
import { Award, BadgeCheck, Flame, Gem, Medal, Radio, Ribbon, Shield, ShoppingBag, Smartphone, Star, Trophy, Users, Zap } from 'lucide-react'
import { CardHead, Chip, Donut, StatCard } from '../components/ui'
import TurkeyMap from '../components/TurkeyMap'
import {
  leagueHighlights,
  periodScenario,
  productWeights,
  rankMetricOptions,
  regionalMetricSummary,
  scoringWeights,
  topThirtyLeaders,
  type PeriodKey,
} from '../gamificationDemo'

function LeagueIcon({ icon }: { icon: string }) {
  if (icon === 'gem') return <Gem size={15} />
  if (icon === 'star') return <Star size={15} />
  if (icon === 'award') return <Award size={15} />
  if (icon === 'medal') return <Medal size={15} />
  return <Shield size={15} />
}

const championCards = [
  {
    title: 'Total Gamification Sampiyonlari',
    icon: <Trophy size={17} />,
    rows: [
      ['Elmas', 'Bayi-4102', '112.6'],
      ['Platin', 'Bayi-3234', '93.2'],
      ['Altin', 'Bayi-2088', '89.4'],
      ['Gumus', 'Bayi-1190', '78.8'],
      ['Bronz', 'Bayi-7741', '69.1'],
    ],
  },
  {
    title: 'Segmentasyon Sampiyonlari',
    icon: <Shield size={17} />,
    rows: [
      ['Elmas', 'Bayi-7044', '97.4'],
      ['Platin', 'Bayi-2280', '91.2'],
      ['Altin', 'Bayi-5021', '86.7'],
      ['Gumus', 'Bayi-6108', '79.3'],
      ['Bronz', 'Bayi-1198', '71.0'],
    ],
  },
  {
    title: 'Fiber Sampiyonlari',
    icon: <Radio size={17} />,
    rows: [
      ['Elmas', 'Bayi-4102', '124.8'],
      ['Platin', 'Bayi-3234', '121.4'],
      ['Altin', 'Bayi-2088', '107.2'],
      ['Gumus', 'Bayi-1190', '94.6'],
      ['Bronz', 'Bayi-7741', '82.3'],
    ],
  },
  {
    title: 'Superbox Sampiyonlari',
    icon: <Zap size={17} />,
    rows: [
      ['Elmas', 'Bayi-6192', '102.4'],
      ['Platin', 'Bayi-7703', '88.5'],
      ['Altin', 'Bayi-1009', '80.1'],
      ['Gumus', 'Bayi-4472', '73.8'],
      ['Bronz', 'Bayi-5528', '61.6'],
    ],
  },
  {
    title: 'AKG Ciro Sampiyonlari',
    icon: <ShoppingBag size={17} />,
    rows: [
      ['Elmas', 'Bayi-5077', '119.1'],
      ['Platin', 'Bayi-3234', '106.9'],
      ['Altin', 'Bayi-2260', '96.4'],
      ['Gumus', 'Bayi-8820', '84.3'],
      ['Bronz', 'Bayi-4401', '72.5'],
    ],
  },
  {
    title: 'Aksesuar Ciro Sampiyonlari',
    icon: <Ribbon size={17} />,
    rows: [
      ['Elmas', 'Bayi-8821', '98.2'],
      ['Platin', 'Bayi-4470', '84.9'],
      ['Altin', 'Bayi-3651', '79.6'],
      ['Gumus', 'Bayi-9142', '72.3'],
      ['Bronz', 'Bayi-7204', '63.5'],
    ],
  },
  {
    title: 'Rekontratlama Sampiyonlari',
    icon: <BadgeCheck size={17} />,
    rows: [
      ['Elmas', 'Bayi-1702', '104.1'],
      ['Platin', 'Bayi-3390', '83.2'],
      ['Altin', 'Bayi-9088', '80.4'],
      ['Gumus', 'Bayi-6621', '72.6'],
      ['Bronz', 'Bayi-4105', '66.8'],
    ],
  },
  {
    title: 'Smartphone Sampiyonlari',
    icon: <Smartphone size={17} />,
    rows: [
      ['Elmas', 'Bayi-9081', '118.0'],
      ['Platin', 'Bayi-6670', '105.6'],
      ['Altin', 'Bayi-3144', '99.8'],
      ['Gumus', 'Bayi-5210', '88.2'],
      ['Bronz', 'Bayi-1208', '76.9'],
    ],
  },
]

export default function PublicOverview() {
  const [metric, setMetric] = useState(rankMetricOptions[0].key)
  const [period, setPeriod] = useState<PeriodKey>('current')
  const metricLabel = rankMetricOptions.find((item) => item.key === metric)?.label ?? 'Total'
  const regionRows = regionalMetricSummary[metric as keyof typeof regionalMetricSummary] ?? regionalMetricSummary.total
  const scenario = periodScenario[period]
  const shiftedLeagues = leagueHighlights.map((_, index, arr) => arr[(index + scenario.leaderShift) % arr.length])
  const donutSegments =
    metric === 'strategic'
      ? productWeights.map((p, index) => ({
          pct: p.weight,
          color: ['var(--amber)', 'var(--blue)', 'var(--green)', 'var(--bronz)', 'var(--purple)', 'var(--red)'][index],
          label: p.name,
          value: `%${p.weight}`,
        }))
      : metric === 'segmentation'
        ? [{ pct: 100, color: 'var(--blue)', label: 'Lig ici dealer_score sirasi', value: '100%' }]
        : [
            { pct: 70, color: 'var(--amber)', label: 'Stratejik urun', value: '70%' },
            { pct: 30, color: 'var(--blue)', label: 'Segmentasyon', value: '30%' },
            { pct: 0, color: 'var(--chip-bg)', label: 'HGO + Buyume', value: '0%' },
          ]

  return (
    <div className="screen">
      <div className="stack">
        <section className="card card__pad">
          <CardHead
            title="SALES CHAMPIONS LEAGUE - Turkiye Ozeti"
            sub="Genel sayfa tum roller icin: lig dagilimi, rozet liderleri, bolge haritasi ve tarih/rozet filtreleri."
            right={
              <div className="selector-row">
                {Object.entries(periodScenario).map(([key, value]) => (
                  <button
                    key={key}
                    className={`selector-pill ${period === key ? 'is-active' : ''}`}
                    onClick={() => setPeriod(key as PeriodKey)}
                  >
                    {value.label}
                  </button>
                ))}
              </div>
            }
          />
          <div className="selector-row selector-row--badges" style={{ marginTop: 14 }}>
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

        <div className="grid-4">
          <StatCard label="Ekosistem ort." value={period === 'current' ? '82.4' : period === 'previous' ? '79.8' : '81.6'} sub={`${scenario.activeDealers} aktif bayi`} pill={period === 'previous' ? '-1.1' : '+4.2'} />
          <StatCard label="Stratejik urun" value={`${scoringWeights.strategic}%`} sub="Total agirlik" pill="Admin" pillTone="amber" />
          <StatCard label="Segmentasyon" value={`${scoringWeights.segmentation}%`} sub="Kendi liginde dealer_score" pill="Lig ici" pillTone="blue" />
          <StatCard label="HGO / Buyume" value="0%" sub="Faz 1 gorunur, etkisiz" pill="Pasif" pillTone="red" />
        </div>

        <div className="grid-2">
          <section className="card card__pad">
            <CardHead title="Bolgesel Ozet" sub="Secili rozet/metrik ve tarih filtresine gore bolge skorlari renklendi." right={<Chip tone="blue">{metricLabel}</Chip>} />
            <TurkeyMap />
            <table className="table">
              <thead>
                <tr>
                  <th>Bolge</th>
                  <th>Gamification</th>
                  <th>Stratejik</th>
                  <th>Segmentasyon</th>
                  <th>Challenge</th>
                  <th>En cok urun</th>
                </tr>
              </thead>
              <tbody>
                {regionRows.map((row, index) => (
                  <tr key={row.region} className={index === 0 ? 'region-metric-row region-metric-row--hot' : index === 1 ? 'region-metric-row region-metric-row--warm' : 'region-metric-row region-metric-row--cool'}>
                    <td className="b">{row.region}</td>
                    <td>{(row.gamification + scenario.leaderShift * 0.7).toFixed(1)}</td>
                    <td>{(row.strategic + scenario.leaderShift * 0.9).toFixed(1)}</td>
                    <td>{(row.segmentation + scenario.leaderShift * 0.5).toFixed(1)}</td>
                    <td>{row.challengeWins + scenario.leaderShift * 3}/{row.challengeJoins + scenario.leaderShift * 5}</td>
                    <td><Chip tone="amber">{row.topChallengeProduct}</Chip></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <section className="card card__pad fit-card">
            <CardHead title="Puan Agirliklari" sub={metric === 'strategic' ? 'Stratejik urun secilince %70 blokun icindeki urun agirliklari gorunur.' : metric === 'segmentation' ? 'Segmentasyon secilince hesap %100 lig ici dealer_score sirasi olarak anlatilir.' : 'Total secilince ana metrik agirliklari gorunur.'} right={<Chip tone="amber">Admin parametrik</Chip>} />
            <Donut
              centerValue="100"
              centerLabel={metric === 'strategic' ? 'urun' : metric === 'segmentation' ? 'lig' : 'total'}
              segments={donutSegments}
            />
            <div className="hint hint--blue mt-24">
              <BadgeCheck size={16} />
              <div>Segmentasyon kendi kulvarindaki gelisim degil, kendi ligindeki dealer_score siralamasi ve normalize puanidir.</div>
            </div>
          </section>
        </div>

        <section className="card card__pad">
          <CardHead title="Rozet Sampiyonlari" sub="Aktif tum rozetler icin 5 ligin birincisi. Hover ile kart canlanir, liderler ve lig rozetleri one cikar." right={<Chip tone="green">{championCards.length} aktif rozet</Chip>} />
          <div className="champion-grid">
            {championCards.map((card, cardIndex) => (
              <div className="champion-card" key={card.title}>
                <div className="champion-card__head">
                  <div className="champion-card__title"><span className="champion-card__medal">{card.icon}</span>{card.title}</div>
                  <Chip tone={cardIndex < 2 ? 'blue' : 'amber'}>5 lig</Chip>
                </div>
                <div className="champion-list">
                  {card.rows.map((row, rowIndex) => (
                    <div className={`champion-row ${rowIndex === 0 ? 'is-leader' : ''}`} key={`${card.title}-${row[0]}`}>
                      <Chip tone={row[0] === 'Elmas' ? 'amber' : row[0] === 'Platin' ? 'blue' : 'default'}>{row[0]}</Chip>
                      <b>{row[1]}</b>
                      <span className="champion-score">{row[2]}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid-2">
          <section className="card card__pad">
            <CardHead title="Lig Sampiyonlari" sub={`Secili metrik: ${metricLabel}. Rozet esitliginde total gamification puaniyla siralanir.`} />
            <div className="league-champion-list">
              {shiftedLeagues.map((row, index) => (
                <div className={`league-champion-card league-champion-card--${row.league.toLowerCase()}`} key={row.league}>
                  <div className="league-champion-card__rank">#{index + 1}</div>
                  <div className="league-champion-card__main">
                    <span className="league-icon"><LeagueIcon icon={row.icon} /></span>
                    <div>
                      <div className="league-champion-card__league">{row.league} Lig</div>
                      <div className="text-sm text-muted">Lider: {row.topBadgeDealer} - {row.region}</div>
                    </div>
                  </div>
                  <div className="league-champion-card__stats">
                    <div><b>{(row.avg + (period === 'previous' ? -1.8 : period === 'ytd' ? 0.9 : 0)).toFixed(1)}</b><small>Lig ort.</small></div>
                    <div><b>{(row.topScore + index * 0.7).toFixed(1)}</b><small>Total</small></div>
                    <div><b>{Math.min(6, row.badges + scenario.leaderShift)}</b><small>Rozet</small></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="card card__pad">
            <CardHead title="En Cok Rozet Alan 30 Bayi" sub="Sayfayi kaplamadan scroll ile en cok rozet alan 30 bayi gorulur." />
            <div className="top30-box">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Bayi</th>
                  <th>Lig</th>
                  <th>Bolge</th>
                  <th>Rozet</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {topThirtyLeaders.map((row) => (
                  <tr key={row.rank}>
                    <td className="b">{row.rank}</td>
                    <td>{row.dealer}</td>
                    <td><Chip tone={row.league === 'Elmas' ? 'amber' : row.league === 'Platin' ? 'blue' : 'default'}>{row.league}</Chip></td>
                    <td>{row.region}</td>
                    <td>{Math.max(3, Math.min(6, row.badges - scenario.leaderShift))}</td>
                    <td className="b">{(row.total - scenario.leaderShift * 0.6).toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </section>
        </div>

        <section className="card card__pad">
          <CardHead title="Ekosistem Nabzi" sub="Bolgesel ozetle birlikte okunacak hizli sinyaller." right={<Chip tone="green">Canli demo</Chip>} />
          <div className="grid-3">
            <div className="listbox"><Users size={18} color="var(--blue)" /><div><div className="b">{scenario.activeDealers} bayi</div><div className="text-sm text-muted">5 ligde aktif</div></div></div>
            <div className="listbox"><BadgeCheck size={18} color="var(--amber)" /><div><div className="b">{scenario.hottestChallengeProduct}</div><div className="text-sm text-muted">En cok challenge alan urun</div></div></div>
            <div className="listbox"><Flame size={18} color="var(--green)" /><div><div className="b">{scenario.fastestProduct} {scenario.fastestChange}</div><div className="text-sm text-muted">Gecen aya gore en yuksek artis</div></div></div>
          </div>
        </section>
      </div>
    </div>
  )
}
