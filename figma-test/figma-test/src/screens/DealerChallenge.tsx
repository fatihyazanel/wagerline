import { Check, Clock, Minus, Target, Trophy, X } from 'lucide-react'
import { CardHead, Chip, FlowSteps } from '../components/ui'
import { challengeSuggestions } from '../gamificationDemo'

export default function DealerChallenge() {
  const selectedSuggestion = challengeSuggestions[0]

  return (
    <div className="screen">
      <div className="stack">
        <section className="card card__pad">
          <CardHead
            title="Bayi-Bayi Challenge Akisi"
            sub="Her bayi ayda yalnizca 1 challenge'a katilabilir. Challenge sadece aktif stratejik urunlerde ve sistemin onerdigi bayilere acilir."
            right={<Chip tone="amber">Son basvuru: ayin 12. gunu</Chip>}
          />
          <FlowSteps
            steps={[
              { title: 'Aktif urun secilir', desc: 'Fiber, Smartphone, Superbox gibi adminin actigi urunlerden biri.', state: 'done' },
              { title: 'Sistem rakip onerir', desc: 'Ayni lig, benzer tempo, makul puan mesafesi.', state: 'done' },
              { title: 'Bayi teklif yollar', desc: 'Karsi bayi kabul ederse challenge baslar.', state: 'done' },
              { title: 'Ay sonu karsilastirma', desc: 'Ilgili rozet metriğinde daha iyi skor kazanan olur.', state: 'active' },
              { title: 'Bonus uygulanir', desc: 'Kazanan bayinin ilgili rozet puanina admin orani eklenir.' },
              { title: 'Audit kaydi', desc: 'Teklif, kabul, sonuc ve bonus iz kaydina duser.' },
            ]}
          />
        </section>

        <div className="grid-2">
          <section className="card card__pad">
            <CardHead title="Aktif Challenge" right={<Chip tone="green">Kabul edildi</Chip>} />
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
                <div className="duel-vs">Bayi **** - Guney Marmara-Bursa - +%8 bonus</div>
              </div>
              <div className="duel-score">
                <div className="duel-score__name">Rakip</div>
                <div className="duel-score__value">29</div>
                <div className="duel-score__sub">Smartphone</div>
              </div>
            </div>
            <div className="grid-3 mt-24">
              <div className="listbox">
                <Trophy size={18} color="var(--amber)" />
                <div>
                  <div className="b">Bayi-3234</div>
                  <div className="text-sm text-muted">31 adet</div>
                </div>
              </div>
              <div className="listbox">
                <Target size={18} color="var(--blue)" />
                <div>
                  <div className="b">Bayi ****</div>
                  <div className="text-sm text-muted">29 adet</div>
                </div>
              </div>
              <div className="listbox">
                <Clock size={18} color="var(--green)" />
                <div>
                  <div className="b">7 gun</div>
                  <div className="text-sm text-muted">kalan sure</div>
                </div>
              </div>
            </div>
          </section>

          <section className="card card__pad">
            <CardHead title="Sistem Onerileri" right={<Chip tone="green">Aktif oneride secili</Chip>} />
            <div className="stack-sm">
              {challengeSuggestions.map((item, index) => (
                <div className={`listbox ${index === 0 ? 'listbox--green' : ''}`} key={`${item.dealer}-${item.product}`}>
                  <span className="avatar-sm" style={{ background: index === 0 ? 'var(--green)' : 'var(--blue)' }}>
                    {index + 1}
                  </span>
                  <div className="listbox__grow">
                    <div className="b">{item.dealer} - {item.region}-{item.city}</div>
                    <div className="text-sm text-muted">{item.product} - {item.reason}</div>
                  </div>
                  <button className={`btn btn--sm ${index === 0 ? 'btn--primary' : 'btn--ghost'}`}>
                    {index === 0 ? 'Secili' : 'Sec'}
                  </button>
                </div>
              ))}
              <div className="hint hint--blue">
                Aktif challenge onerisi: {selectedSuggestion.dealer} - {selectedSuggestion.region}-{selectedSuggestion.city}; bayi kodu maskeli, bolge ve sehir acik.
              </div>
            </div>
          </section>
        </div>

        <section className="card card__pad">
          <CardHead title="Challenge Gecmisi" inlineSub="- rozet bazli bonuslar" />
          <table className="table">
            <thead>
              <tr>
                <th>Ay</th>
                <th>Urun/Rozet</th>
                <th>Rakip</th>
                <th>Sonuc</th>
                <th className="num">Ben</th>
                <th className="num">Rakip</th>
                <th className="num">Bonus</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Haziran</td>
                <td>Fiber Yildizi</td>
                <td>Bayi **** - Ege-Izmir</td>
                <td><Chip tone="green"><Check size={12} /> Win</Chip></td>
                <td className="num">42 adet</td>
                <td className="num">39 adet</td>
                <td className="num">+%8</td>
              </tr>
              <tr>
                <td>Mayis</td>
                <td>Superbox</td>
                <td>Bayi **** - Akdeniz-Antalya</td>
                <td><Chip tone="red"><X size={12} /> Lose</Chip></td>
                <td className="num">18 adet</td>
                <td className="num">21 adet</td>
                <td className="num">0</td>
              </tr>
              <tr>
                <td>Nisan</td>
                <td>AKG Lideri</td>
                <td>Bayi **** - Guney Marmara-Bursa</td>
                <td><Chip tone="amber"><Minus size={12} /> Draw</Chip></td>
                <td className="num">1.4M TL</td>
                <td className="num">1.4M TL</td>
                <td className="num">0</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  )
}
