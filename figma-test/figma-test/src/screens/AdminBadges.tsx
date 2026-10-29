import { useState } from 'react'
import { Flame, Info, Radio, Star, Trophy } from 'lucide-react'
import { CardHead, Chip, Hint, SegTabs, Switch } from '../components/ui'
import { productWeights } from '../gamificationDemo'

const ruleRows = [
  ['Stratejik urun rozeti', 'Her aktif urun icin ligde ilk n', 'n=5', 'Sira bonusu + streak'],
  ['Segmentasyon rozeti', 'dealer_score ile lig ici ilk n', 'n=5', 'Sira bonusu + streak'],
  ['HGO rozeti', 'Faz 1 gorunur', 'Agirlik 0', 'Odul pasif'],
  ['Buyume rozeti', 'Faz 1 gorunur', 'Agirlik 0', 'Odul pasif'],
  ['Toplam puan rozeti', 'Gamification toplaminda ilk n', 'n=5', 'Streak gecerli'],
]

export default function AdminBadges() {
  const [topN, setTopN] = useState(5)
  const visibleRanks = Array.from({ length: Math.max(5, topN) }, (_, index) => index + 1)
  const rankBonuses = visibleRanks.map((rank) => ({
    rank: `${rank}. sira`,
    bonus: `+${Math.max(2, 12 - rank * 2)}%`,
    note: rank <= topN ? 'Aktif rozet odulu' : 'n disi pasif',
  }))

  return (
    <div className="screen">
      <div className="stack">
        <section className="card card__pad">
          <CardHead title="Rozet Kural Seti" sub="Rozetler puani suslemez; dogrudan ilgili metrik puanini odullendirir." right={<button className="btn btn--amber">+ Rozet Tanımla</button>} />
          <table className="table">
            <thead>
              <tr>
                <th>Rozet tipi</th>
                <th>Tetikleyici</th>
                <th>Ilk n</th>
                <th>Odul</th>
                <th>Aktif</th>
              </tr>
            </thead>
            <tbody>
              {ruleRows.map((row) => (
                <tr key={row[0]}>
                  <td className="cell-strong"><span className="rowflex"><Trophy size={15} /> {row[0]}</span></td>
                  <td>{row[1]}</td>
                  <td>{row[2] === 'n=5' ? `n=${topN}` : row[2]}</td>
                  <td>{row[3]}</td>
                  <td><Switch on={!row[0].includes('HGO') && !row[0].includes('Buyume')} locked={row[0].includes('HGO') || row[0].includes('Buyume')} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <div className="grid-2">
          <section className="card card__pad">
            <CardHead title="Sira ve Bonus Oranlari" right={<Chip tone="green">Parametrik</Chip>} />
            <div className="form-row">
              <label>Rozet alacak bayi sayisi <small>n degeri</small></label>
              <div className="input-row">
                <input
                  className="input"
                  type="number"
                  min={1}
                  max={10}
                  value={topN}
                  onChange={(event) => setTopN(Math.max(1, Math.min(10, Number(event.target.value) || 1)))}
                />
                <span className="text-sm">sira aktif</span>
              </div>
            </div>
            <div className="grid-3" style={{ marginBottom: 14 }}>
              {visibleRanks.map((rank) => (
                <div key={rank} className={`listbox ${rank <= topN ? 'listbox--green' : ''}`}>
                  <Trophy size={16} color="var(--amber)" />
                  <div>
                    <div className="b">{rank}. sira</div>
                    <div className="text-sm text-muted">{rank <= topN ? 'Aktif rozet bandi' : 'n disi pasif'}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="stack-sm">
              {rankBonuses.map((rule, index) => (
                <div className="weight-row" key={rule.rank}>
                  <div className="weight-row__n"><span className="rowflex"><Star size={15} /> {rule.rank}<small>{rule.note}</small></span></div>
                  <input type="range" min={0} max={30} value={index + 1 <= topN ? Number(rule.bonus.replace(/[^0-9]/g, '')) || 0 : 0} readOnly disabled={index + 1 > topN} />
                  <div className="weight-row__pct">{index + 1 <= topN ? rule.bonus : 'Pasif'}</div>
                </div>
              ))}
              <div className="weight-row">
                <div className="weight-row__n"><span className="rowflex"><Flame size={15} /> Streak<small>Global kural</small></span></div>
                <input type="range" min={0} max={30} value={20} readOnly />
                <div className="weight-row__pct">+20%</div>
              </div>
              <div className="weight-row">
                <div className="weight-row__n"><span className="rowflex"><Trophy size={15} /> Challenge<small>Kazanirsa</small></span></div>
                <input type="range" min={0} max={30} value={8} readOnly />
                <div className="weight-row__pct">+8%</div>
              </div>
            </div>
            <Hint tone="amber" icon={<Info size={16} />}>
              Streak tek global kuraldir: aktifse tum rozetler icin onceki ay da ilk n icinde olan bayiye uygulanir. Urunden urune degismez.
            </Hint>
          </section>

          <section className="card card__pad">
            <CardHead title="Rozet Editoru" right={<Chip tone="amber"><Flame size={12} /> Fiber Yildizi</Chip>} />
            <div className="form-row">
              <label>Rozet adi</label>
              <input className="input" defaultValue="Fiber Yildizi" />
            </div>
            <div className="form-row">
              <label>Ikon</label>
              <div className="rowflex">
                <div className="badge-medal badge-medal--amber" style={{ margin: 0 }}><Radio size={24} /></div>
                <button className="btn btn--ghost">Degistir</button>
              </div>
            </div>
            <div className="form-row">
              <label>Tetikleyici metrik</label>
              <select className="select">
                <option>Fiber</option>
                <option>Smartphone</option>
                <option>Segmentasyon</option>
              </select>
            </div>
            <div className="form-row">
              <label>Lig icinde rozet adedi</label>
              <div className="input-row">
                <input
                  className="input"
                  type="number"
                  min={1}
                  max={10}
                  value={topN}
                  onChange={(event) => setTopN(Math.max(1, Math.min(10, Number(event.target.value) || 1)))}
                />
                <span className="text-sm">bayi</span>
              </div>
            </div>
            <div className="form-row">
              <label>Streak kontrolu</label>
              <Switch on />
            </div>
            <div className="form-row">
              <label>Challenge odulu</label>
              <div className="input-row"><input className="input" defaultValue="8" /><span className="text-sm">%</span></div>
            </div>
          </section>
        </div>

        <section className="card card__pad">
          <CardHead
            title="Bu Ay Aktif Stratejik Urunler"
            sub="Urun aktif/pasif secilir; aktif urun agirliklari toplamda 100'u gecemez. Demo degerleri toplam 100 olacak sekilde dagitildi."
            right={<Chip tone="green">Toplam %100</Chip>}
          />
          <table className="table">
            <thead>
              <tr>
                <th>Urun</th>
                <th>Aktif</th>
                <th>Urun agirligi</th>
                <th>Streak</th>
              </tr>
            </thead>
            <tbody>
              {productWeights.map((product) => (
                <tr key={product.name}>
                  <td className="cell-strong"><span className="rowflex"><Radio size={15} /> {product.name}</span></td>
                  <td><Switch on /></td>
                  <td>
                    <div className="weight-row" style={{ margin: 0 }}>
                      <div className="weight-row__n">{product.name}</div>
                      <input type="range" min={0} max={100} defaultValue={product.weight} />
                      <div className="weight-row__pct">{product.weight}%</div>
                    </div>
                  </td>
                  <td><Chip tone="amber">Global kural</Chip></td>
                </tr>
              ))}
            </tbody>
          </table>
          <Hint tone="blue">
            3 urun aktif edilirse bu 3 urunun toplam agirligi yine %100'e normalize edilir; 6 urun aktifse 6 urun toplam %100'u paylasir.
          </Hint>
        </section>

        <section className="card card__pad">
          <CardHead title="Include / Exclude Bayi" sub="Lig hesabinda min ay, veri kalitesi veya operasyonel istisna icin." />
          <div className="grid-2-eq">
            <div>
              <div className="form-row">
                <label>Bayi sec</label>
                <select className="select"><option>Bayi P-088 - Ege - Platin</option></select>
              </div>
              <div className="form-row">
                <label>Aksiyon</label>
                <SegTabs tabs={['Include', 'Exclude']} />
              </div>
            </div>
            <div>
              <div className="form-row">
                <label>Gecerli ay</label>
                <select className="select"><option>Temmuz 2026</option></select>
              </div>
              <div className="form-row">
                <label>Audit sebebi</label>
                <input className="input" defaultValue="Yeni bayi acilisi nedeniyle min ay istisnasi" />
              </div>
            </div>
          </div>
          <div className="rowflex mt-24" style={{ justifyContent: 'flex-end' }}>
            <button className="btn btn--ghost">Taslak kaydet</button>
            <button className="btn btn--primary">Onaya gonder</button>
          </div>
        </section>
      </div>
    </div>
  )
}
