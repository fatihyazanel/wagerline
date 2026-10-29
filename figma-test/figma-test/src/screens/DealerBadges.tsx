import { useState } from 'react'
import { Calendar, Flame, Lock, Radio, Shield, Smartphone, Star, Trophy } from 'lucide-react'
import { BadgeCard, CardHead, Chip, StatCard } from '../components/ui'
import { badgeHistory, dealerScore } from '../gamificationDemo'

const monthTimeline = ['Agu', 'Eyl', 'Eki', 'Kas', 'Ara', 'Oca', 'Sub', 'Mar', 'Nis', 'May', 'Haz', 'Tem']

const badgeDetails: Record<string, { wins: { month: string; score: number; rank: string; final: number; hot: boolean }[] }> = {
  'Fiber Yildizi': {
    wins: [
      { month: 'Mar', score: 88, rank: '4/180', final: 96.8, hot: false },
      { month: 'Nis', score: 91, rank: '3/178', final: 120.1, hot: true },
      { month: 'Haz', score: 89, rank: '5/180', final: 97.9, hot: false },
      { month: 'Tem', score: 92, rank: '2/176', final: 121.4, hot: true },
    ],
  },
  'Smartphone Avcisi': {
    wins: [
      { month: 'Haz', score: 82, rank: '5/180', final: 90.2, hot: false },
      { month: 'Tem', score: 84, rank: '4/176', final: 99.8, hot: false },
    ],
  },
  'AKG Lideri': {
    wins: [
      { month: 'Nis', score: 77, rank: '5/178', final: 92.4, hot: false },
      { month: 'Haz', score: 80, rank: '5/180', final: 105.6, hot: true },
      { month: 'Tem', score: 81, rank: '5/176', final: 106.9, hot: true },
    ],
  },
  'Segmentasyon Ustasi': {
    wins: [{ month: 'May', score: 83, rank: '5/181', final: 83.0, hot: false }],
  },
}

function badgeIcon(name: string, state: string) {
  if (state === 'locked') return <Lock size={24} />
  if (name.includes('Fiber')) return <Radio size={24} />
  if (name.includes('Smartphone')) return <Smartphone size={24} />
  if (name.includes('Segmentasyon')) return <Shield size={24} />
  return <Trophy size={24} />
}

export default function DealerBadges() {
  const [selected, setSelected] = useState(badgeHistory[0].name)
  const active = badgeHistory.find((badge) => badge.name === selected) ?? badgeHistory[0]
  const detail = badgeDetails[active.name] ?? { wins: [] }
  const selectedWin = detail.wins[detail.wins.length - 1]

  return (
    <div className="screen">
      <div className="stack">
        <div className="game-strip">
          <StatCard label="Aktif rozet" value={<>{dealerScore.activeBadges}<small>/ 10</small></>} sub="Bu ay puana etki eden" />
          <StatCard label="Toplam bonus" value="+13.4" sub="Rozet + streak + challenge" pill="Puan" pillTone="amber" />
          <StatCard label="En yakin rozet" value="Superbox" sub="Ilk 5 icin +8.2 puan" pill="Yakinda" pillTone="blue" />
        </div>

        <section className="card card__pad">
          <CardHead title="Rozet Koleksiyonum" sub="Karta tiklayinca detay paneli guncellenir; kac defa aldigin ve hangi aylarda aldigin gorunur." />
          <div className="badge-grid">
            {badgeHistory.map((badge) => (
              <button key={badge.name} onClick={() => setSelected(badge.name)} style={{ padding: 0, textAlign: 'inherit' }}>
                <BadgeCard
                  icon={badgeIcon(badge.name, badge.state)}
                  medal={badge.state === 'locked' ? 'bronz' : badge.state === 'near' ? 'blue' : 'amber'}
                  name={badge.name}
                  desc={`${badge.count} kez - ${badge.months}`}
                  mult={`${badge.count > 0 ? `x${badge.count}` : badge.currentRank}${hotCountFor(badge.name) ? ` - ${hotCountFor(badge.name)} ates` : ''}`}
                  locked={badge.state === 'locked'}
                />
              </button>
            ))}
          </div>
        </section>

        <div className="grid-2">
          <section className="card card__pad">
            <CardHead title={`Rozet Gecmis Detayi: ${active.name}`} sub="Mevcut ay ana sayfada; burada secili rozetin gecmis alis aylarini ve o andaki puani okuruz." right={<Chip tone={active.state === 'won' ? 'green' : 'amber'}>{active.count} kazanim</Chip>} />
            {detail.wins.length ? (
              <table className="table mt-24">
                <thead>
                  <tr>
                    <th>Ay</th>
                    <th>O ayki sira</th>
                    <th>Normalize puan</th>
                    <th>Final puan</th>
                    <th>Ates</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.wins.map((win) => (
                    <tr key={`${active.name}-${win.month}`} className={win.hot ? 'rank-row--top' : undefined}>
                      <td className="b">{win.month}</td>
                      <td>{win.rank}</td>
                      <td>{win.score}</td>
                      <td className="b">{win.final}</td>
                      <td>
                        <Chip tone={win.hot ? 'red' : 'default'}>
                          {win.hot ? <><Flame size={12} /> Ates var</> : 'Ates yok'}
                        </Chip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="listbox mt-24">
                <Trophy size={18} color="var(--muted)" />
                <div>
                  <div className="b">Gecmis kazanim yok</div>
                  <div className="text-sm text-muted">Bu rozet icin henuz kazanilmis ay bulunmuyor.</div>
                </div>
              </div>
            )}
          </section>

          <section className="card card__pad">
            <CardHead title="Rozet Zaman Cizgisi" sub="Kazanilan aylar ve puana yansima mantigi." />
            <div className="stack-sm">
              <div className="badge-timeline">
                {monthTimeline.map((month) => {
                  const win = detail.wins.find((item) => item.month === month)
                  return (
                    <button
                      key={month}
                      className={`badge-timeline__month${win ? ' is-won' : ''}${win?.hot ? ' is-hot' : ''}`}
                      title={win ? `${month}: ${win.final} puan - ${win.rank}` : `${month}: rozet yok`}
                    >
                      <span>{month}</span>
                      {win?.hot ? <Flame size={14} /> : win ? <i className="won-dot" /> : <i />}
                    </button>
                  )
                })}
              </div>
              <div className="listbox">
                <Calendar size={18} color="var(--blue)" />
                <div className="listbox__grow">
                  <div className="b">Alis zamanlari</div>
                  <div className="text-sm text-muted">{active.months}</div>
                </div>
                <Chip tone="blue">{active.count} kez</Chip>
              </div>
              <div className="listbox">
                <Star size={18} color="var(--amber)" />
                <div className="listbox__grow">
                  <div className="b">Son alindigi zamandaki puan</div>
                  <div className="text-sm text-muted">{selectedWin ? `${selectedWin.month} ayinda ${selectedWin.rank} sira; normalize ${selectedWin.score}` : 'Bu rozet henuz alinmadi.'}</div>
                </div>
                <b>{selectedWin ? selectedWin.final : active.normalized}</b>
              </div>
              <div className="listbox listbox--amber">
                <Flame size={18} color="var(--amber)" />
                <div className="listbox__grow">
                  <div className="b">Streak kontrolu</div>
                  <div className="text-sm text-muted">Onceki ay da ilk n icindeyse ates bonusu uygulanir.</div>
                </div>
                <Chip tone={selectedWin?.hot ? 'red' : 'default'}>
                  {selectedWin?.hot ? 'Ates aldi' : 'Ates yok'}
                </Chip>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function hotCountFor(name: string) {
  return (badgeDetails[name]?.wins ?? []).filter((win) => win.hot).length
}
