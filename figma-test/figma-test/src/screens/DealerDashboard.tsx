import { useState } from 'react'
import { ArrowDown, ArrowUp, Award, BadgeCheck, Flame, Radio, Shield, ShoppingBag, Smartphone, Target, Zap } from 'lucide-react'
import { CardHead, Chip, Progress } from '../components/ui'
import {
  activeProducts,
  challengeSuggestions,
  dealerScore,
  icmDiffs,
  leagueBaseStats,
  rankMetricOptions,
  rankingBoards,
  scoreContributions,
  scoringWeights,
  strategicContributionTotal,
  strategicProductScores,
  type RankMetricKey,
} from '../gamificationDemo'

const productIcon: Record<string, JSX.Element> = {
  Fiber: <Radio size={18} />,
  Smartphone: <Smartphone size={18} />,
  Superbox: <Zap size={18} />,
  'AKG Ciro': <ShoppingBag size={18} />,
  'Aksesuar Ciro': <Award size={18} />,
  Rekontratlama: <Shield size={18} />,
}

const metricFacts: Record<RankMetricKey, { icon: JSX.Element; unit: string; mine: string; label: string }> = {
  total: { icon: <TrophyIcon />, unit: 'puan', mine: '88.7', label: 'Total Gamification' },
  strategic: { icon: <Target size={15} />, unit: 'puan', mine: '84.8', label: 'Stratejik Urun' },
  segmentation: { icon: <Shield size={15} />, unit: 'puan', mine: '86.3', label: 'Segmentasyon' },
  fiber: { icon: <Radio size={15} />, unit: 'adet', mine: '42 adet', label: 'Fiber' },
  superbox: { icon: <Zap size={15} />, unit: 'adet', mine: '18 adet', label: 'Superbox' },
  akg: { icon: <ShoppingBag size={15} />, unit: 'TL', mine: '1.42M TL', label: 'AKG Ciro' },
  accessory: { icon: <Award size={15} />, unit: 'TL', mine: '285K TL', label: 'Aksesuar Ciro' },
  recontract: { icon: <Shield size={15} />, unit: 'adet', mine: '118 adet', label: 'Rekontratlama' },
  smartphone: { icon: <Smartphone size={15} />, unit: 'adet', mine: '31 adet', label: 'Smartphone' },
}

function TrophyIcon() {
  return <BadgeCheck size={15} />
}

type BoardRow = {
  rank: number
  dealer: string
  region: string
  score: number
  diff: string
}

function buildMaskedBoardRows(rows: BoardRow[], unit: string): BoardRow[] {
  const me = rows.find((row) => row.dealer === 'Sen')
  if (!me || me.rank <= 5) return rows

  const topRows = Array.from({ length: 5 }, (_, index) => ({
    rank: index + 1,
    dealer: `Bayi Top-${index + 1}`,
    region: ['Ege', 'Marmara', 'Akdeniz', 'Karadeniz', 'Ic Anadolu'][index],
    score: Number(Math.max(me.score + (5 - index) * (unit === 'puan' ? 2.4 : 3.8), me.score + 1).toFixed(1)),
    diff: `+${Number((5 - index) * 2.1).toFixed(1)}`,
  }))

  const nearAbove = [3, 2, 1]
    .map((step) => ({
      rank: me.rank - step,
      dealer: `Bayi Yak-${step}`,
      region: ['Marmara', 'Ege', 'Guney Marmara'][step - 1],
      score: Number((me.score + step * 0.9).toFixed(1)),
      diff: `+${Number(step * 0.9).toFixed(1)}`,
    }))
    .filter((row) => row.rank > 5)
  const nearBelow = [1, 2, 3].map((step) => ({
    rank: me.rank + step,
    dealer: `Bayi Alt-${step}`,
    region: ['Ic Anadolu', 'Akdeniz', 'Karadeniz'][step - 1],
    score: Number((me.score - step * 0.8).toFixed(1)),
    diff: `-${Number(step * 0.8).toFixed(1)}`,
  }))

  return [...topRows, ...nearAbove, me, ...nearBelow]
}

export default function DealerDashboard() {
  const [board, setBoard] = useState<RankMetricKey>('total')
  const topN = 5
  const selectedFact = metricFacts[board]
  const boardRows = buildMaskedBoardRows(rankingBoards[board], selectedFact.unit)
  const selectedProduct = strategicProductScores.find((p) => p.name === selectedFact.label)

  return (
    <div className="screen">
      <div className="stack">
        <div className="hero">
          <div className="hero__row">
            <div className="hero__score">
              <div className="hero__score-label">SALES CHAMPIONS LEAGUE</div>
              <div className="hero__score-val">{dealerScore.total}</div>
              <div className="hero__score-sub">Temmuz 2026 - {dealerScore.league}</div>
            </div>
            <div className="hero__meta">
              <div>
                <div className="hero__meta-lbl">Total Lig Siram</div>
                <div className="hero__meta-v">{dealerScore.rank}.<small>/{dealerScore.totalDealers}</small></div>
                <div className="delta-up">Genel gamification</div>
              </div>
              <div>
                <div className="hero__meta-lbl">Stratejik Urun</div>
                <div className="hero__meta-v">{dealerScore.strategic}<small>/100+</small></div>
                <div className="delta-up">%{scoringWeights.strategic} agirlik</div>
              </div>
              <div>
                <div className="hero__meta-lbl">Segmentasyon</div>
                <div className="hero__meta-v">{dealerScore.segmentation}<small>/100</small></div>
                <div className="delta-up">Kendi liginde</div>
              </div>
              <div>
                <div className="hero__meta-lbl">Bonuslar</div>
                <div className="hero__meta-v">+13.4</div>
                <div className="delta-up">rozet + streak + challenge</div>
              </div>
            </div>
            <div className="streak-pill"><Flame size={16} /> Fiber streak aktif</div>
          </div>
        </div>

        <div className="game-strip">
          <div className="game-tile">
            <div className="game-tile__label">Aktif urun</div>
            <div className="game-tile__value">{activeProducts.length}</div>
            <div className="game-tile__sub">Bu ay admin secimi</div>
          </div>
          <div className="game-tile">
            <div className="game-tile__label">Challenge gucu</div>
            <div className="game-tile__value">31 - 29</div>
            <div className="game-tile__sub">Smartphone adetleri</div>
          </div>
          <div className="game-tile">
            <div className="game-tile__label">Lig baz puani</div>
            <div className="game-tile__value">{leagueBaseStats.mine}</div>
            <div className="game-tile__sub">Min {leagueBaseStats.min} - Ort {leagueBaseStats.avg} - Max {leagueBaseStats.max}</div>
          </div>
        </div>

        <section className="card card__pad">
          <CardHead title="Masked Lig Panosu" sub="Ilk 5 maskeli; bayi ilk 5 disindeyse kendi satirinin 3 ustu ve 3 alti da gorunur. Adet/ciro farki ile rozete uzaklik okunur." right={<Chip tone="amber">{selectedFact.label}</Chip>} />
          <div className="board-tabs board-tabs--hero" style={{ marginTop: 14 }}>
            {rankMetricOptions.map((option) => (
              <button
                key={option.key}
                className={`board-tab ${board === option.key ? 'is-active' : ''}`}
                onClick={() => setBoard(option.key)}
              >
                {metricFacts[option.key].icon}
                {option.label}
              </button>
            ))}
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Sira</th>
                <th>Bayi</th>
                <th>Bolge</th>
                <th className="num">{selectedFact.unit === 'TL' ? 'Ciro' : selectedFact.unit === 'adet' ? 'Adet' : 'Deger'}</th>
                <th className="num">Puan</th>
                <th className="num">Fark</th>
              </tr>
            </thead>
            <tbody>
              {boardRows.map((r) => {
                const bandClass = r.rank <= topN ? 'rank-row--top' : r.rank <= topN + 3 ? 'rank-row--near' : 'rank-row--far'
                const meDelta = r.dealer === 'Sen' ? (r.rank <= 5 ? -2 : r.rank >= 9 ? 3 : -1) : 0
                return (
                  <tr key={`${board}-${r.rank}-${r.dealer}`} className={`${bandClass} ${r.dealer === 'Sen' ? 'rank-row--me' : ''}`}>
                    <td className="b">{r.rank}</td>
                    <td>
                      {r.dealer === 'Sen' ? 'Bayi-3234' : '****'}
                      {r.dealer === 'Sen' && (
                        <span className={`rank-delta ${meDelta < 0 ? 'rank-delta--up' : 'rank-delta--down'}`} style={{ marginLeft: 8 }}>
                          {meDelta < 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                          onceki aya gore {Math.abs(meDelta)} sira
                        </span>
                      )}
                    </td>
                    <td>{r.region}</td>
                    <td className="num">{r.dealer === 'Sen' ? selectedFact.mine : selectedFact.unit === 'TL' ? `${(Number(r.score) * 12.5).toFixed(0)}K TL` : selectedFact.unit === 'adet' ? Math.max(1, Math.round(Number(r.score) / 2)) : r.score}</td>
                    <td className="num">{r.score}</td>
                    <td className="num">{r.diff}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </section>

        <div className="dealer-main-grid">
          <div className="stack">
            <section className="card card__pad">
              <CardHead title="Puan nasil olustu?" sub={`Secili: ${selectedFact.label}. Ayni puan motoru pano ve urun kartlarini besler.`} right={<Chip tone="blue">{selectedFact.mine}</Chip>} />
              <div className="score-ladder">
                {(selectedProduct
                  ? [
                      {
                        metric: selectedProduct.name,
                        raw: selectedProduct.normalized,
                        afterBonus: selectedProduct.final,
                        weight: selectedProduct.weight,
                        contribution: selectedProduct.contribution,
                      },
                      ...scoreContributions.filter((item) => item.metric !== 'Stratejik Urunler'),
                    ]
                  : scoreContributions
                ).map((item) => (
                  <div className="score-ladder__row" key={item.metric}>
                    <div>
                      <div className="score-ladder__name">{item.metric}</div>
                      <div className="score-ladder__meta">
                        Ham {item.raw} {'->'} bonuslu {item.afterBonus} - agirlik %{item.weight}
                      </div>
                    </div>
                    <Progress value={Math.min(item.afterBonus, 100)} tone={item.metric === 'Stratejik Urunler' ? 'amber' : 'blue'} />
                    <div className="score-ladder__value">{item.contribution}</div>
                  </div>
                ))}
              </div>
              <div className="bonus-chipline">
                <Chip tone="amber"><BadgeCheck size={12} /> Rozet +%10</Chip>
                <Chip tone="red"><Flame size={12} /> Ates +%20</Chip>
                <Chip tone="green"><Target size={12} /> Challenge +%8</Chip>
              </div>
            </section>

            <section className="card card__pad">
              <CardHead
                title="Aktif Stratejik Urunler"
                sub="Her urun: normalize puan + admin rozet/ates/challenge bonuslari. Katki puanlari toplanir ve stratejik urun skorunu olusturur."
                right={<Chip tone="amber">Toplam: {strategicContributionTotal}</Chip>}
              />
              <div className="compact-products mt-24">
                {strategicProductScores.map((p) => {
                  const isBadge = p.rank <= topN
                  const isWeak = p.rank > 8
                  const badgeFactor = 1 + p.badgeBonus / 100
                  const streakFactor = 1 + p.streakBonus / 100
                  const challengeFactor = 1 + p.challengeBonus / 100
                  return (
                    <div key={p.name} className={`product-score-card ${isBadge ? 'is-badge' : ''} ${isWeak ? 'is-weak' : ''}`}>
                      <div className="product-score-card__badges">
                        {p.badgeBonus > 0 && <span className="mini-badge mini-badge--award" title="Rozet var"><BadgeCheck size={13} /></span>}
                        {p.streakBonus > 0 && <span className="mini-badge mini-badge--fire" title="Ates var"><Flame size={13} /></span>}
                        {p.challengeBonus > 0 && <span className="mini-badge mini-badge--target" title="Challenge bonusu"><Target size={13} /></span>}
                      </div>
                      <div className="product-score-card__top">
                        <span className="rowflex">
                          <span className="metric-icon" style={{ width: 34, height: 34, background: isBadge ? 'var(--amber-bg)' : 'var(--chip-bg)', color: isBadge ? 'var(--amber)' : 'var(--muted)' }}>
                            {productIcon[p.name] ?? <Award size={18} />}
                          </span>
                          <span>
                            <span className="product-score-card__name">{p.name}</span>
                            <small className="text-muted" style={{ display: 'block' }}>Lig sira: {p.rank}. / ilk {topN}</small>
                          </span>
                        </span>
                        <Chip tone={isBadge ? 'green' : isWeak ? 'red' : 'amber'}>{isBadge ? 'Rozet' : isWeak ? 'Zayif' : 'Yakinda'}</Chip>
                      </div>
                      <div className="product-score-card__score">{p.final}</div>
                      <Progress value={Math.min(p.final, 100)} tone={isBadge ? 'amber' : isWeak ? undefined : 'blue'} />
                      <div className="product-score-card__formula">
                        {p.normalized} x {badgeFactor.toFixed(2)} x {streakFactor.toFixed(2)} x {challengeFactor.toFixed(2)} = {p.final}
                      </div>
                      <div className="product-score-card__foot">
                        <span>%{p.weight} agirlik {'->'} {p.contribution}</span>
                        <span className={p.monthlyChange.startsWith('+') ? 'trend-up' : 'trend-down'}>{p.monthlyChange} vs onceki ay</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          </div>

          <div className="stack">
            <section className="card card__pad">
              <CardHead title="Aktif Challenge Arenasi" right={<Chip tone="green">1/1 hak kullanildi</Chip>} />
              <div className="power-duel">
                <div className="duel-score">
                  <div className="duel-score__name">Bayi-3234</div>
                  <div className="duel-score__value">31</div>
                  <div className="duel-score__sub">Smartphone</div>
                </div>
                <div>
                  <div className="duel-bar">
                    <span className="duel-bar__me" style={{ width: '52%' }} />
                    <span className="duel-bar__rival" style={{ width: '48%' }} />
                  </div>
                  <div className="duel-vs">VS - +%8 ROZET BONUSU</div>
                </div>
                <div className="duel-score">
                  <div className="duel-score__name">****</div>
                  <div className="duel-score__value">29</div>
                  <div className="duel-score__sub">Smartphone</div>
                </div>
              </div>
              <div className="stack-sm mt-24">
                {challengeSuggestions.map((c) => (
                  <div className="listbox" key={c.dealer}>
                    <Target size={18} color="var(--blue)" />
                    <div className="listbox__grow">
                      <div className="b">**** - {c.product}</div>
                      <div className="text-sm text-muted">{c.reason}</div>
                    </div>
                    <Chip tone="amber">{c.reward}</Chip>
                  </div>
                ))}
              </div>
            </section>

            <section className="card card__pad">
              <CardHead title="Canli Veri / ICM Farki" sub="Ay sonunda canli degerler ICM kosullariyla karsilastirilir." />
              {icmDiffs.map((row) => (
                <div className="listbox" key={row.metric}>
                  <div className="listbox__grow">
                    <div className="b">{row.metric}</div>
                    <div className="text-sm text-muted">Canli {row.live} - ICM {row.icm} - {row.reason}</div>
                  </div>
                  <Chip tone={row.diff === '0' ? 'green' : 'red'}>{row.diff}</Chip>
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
