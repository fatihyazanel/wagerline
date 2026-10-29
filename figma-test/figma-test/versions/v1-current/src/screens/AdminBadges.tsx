import { Flame, Gem, Globe, Info, Radio, Rocket, Sprout, Star, Trophy } from 'lucide-react'
import { CardHead, Chip, Hint, SegTabs, Switch } from '../components/ui'

export default function AdminBadges() {
  return (
    <div className="screen">
      <div className="stack">
        <section className="card card__pad">
          <CardHead
            title="Rozet Kuralları"
            inlineSub="· Final puana çarpan olarak uygulanır"
            right={<button className="btn btn--amber">+ Rozet Tanımla</button>}
          />
          <table className="table">
            <thead>
              <tr>
                <th>Rozet</th>
                <th>Tetikleyici</th>
                <th>Eşik</th>
                <th>Çarpan</th>
                <th>Ay Çarpanı</th>
                <th>Aktif</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="cell-strong">
                  <span className="rowflex">
                    <Trophy size={15} /> Segmentasyon Üstü
                  </span>
                </td>
                <td>Segmentasyon</td>
                <td>Kulvarda +%30</td>
                <td>×1.10</td>
                <td>×1.0</td>
                <td>
                  <Switch on />
                </td>
              </tr>
              <tr>
                <td className="cell-strong">
                  <span className="rowflex">
                    <Radio size={15} /> 5G Öncüsü
                  </span>
                </td>
                <td>Stratejik Ürün</td>
                <td>Aylık 50+ 5G</td>
                <td>×1.08</td>
                <td>×1.0</td>
                <td>
                  <Switch on />
                </td>
              </tr>
              <tr>
                <td className="cell-strong">
                  <span className="rowflex">
                    <Globe size={15} /> Fiber Ustası
                  </span>
                </td>
                <td>Stratejik Ürün</td>
                <td>Fiber penetrasyon %15+</td>
                <td>×1.05</td>
                <td>×1.0</td>
                <td>
                  <Switch on />
                </td>
              </tr>
              <tr>
                <td className="cell-strong">
                  <span className="rowflex">
                    <Sprout size={15} /> Yükselen Bayi
                  </span>
                </td>
                <td>Segmentasyon</td>
                <td>Kulvar yukarı</td>
                <td>×1.03</td>
                <td>×1.0</td>
                <td>
                  <Switch on />
                </td>
              </tr>
              <tr>
                <td className="cell-strong">
                  <span className="rowflex">
                    <Gem size={15} /> Premium SP
                  </span>
                </td>
                <td>Stratejik Ürün</td>
                <td>SP oranı %20+</td>
                <td>×1.07</td>
                <td>×1.2</td>
                <td>
                  <Switch on />
                </td>
              </tr>
              <tr>
                <td className="cell-strong">
                  <span className="rowflex">
                    <Rocket size={15} /> Hızlı Yükselen
                  </span>
                </td>
                <td>Segmentasyon</td>
                <td>2 kulvar atla</td>
                <td>×1.12</td>
                <td>×1.0</td>
                <td>
                  <Switch on />
                </td>
              </tr>
              <tr>
                <td className="cell-strong">
                  <span className="rowflex">
                    <Star size={15} /> Komuta Rozeti
                  </span>
                </td>
                <td>Lig sıralaması</td>
                <td>3 ay üst üste Top 10</td>
                <td>×1.15</td>
                <td>×1.0</td>
                <td>
                  <Switch on />
                </td>
              </tr>
              <tr>
                <td className="cell-strong">
                  <span className="rowflex">
                    <Flame size={15} /> Streak Avcısı
                  </span>
                </td>
                <td>Aktivite</td>
                <td>30 gün streak</td>
                <td>×1.05</td>
                <td>×1.0</td>
                <td>
                  <Switch />
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <div className="grid-2">
          <div className="stack">
            <section className="card card__pad">
              <CardHead title="Rozet Tanım Editörü" right={<Chip tone="purple">💎 Premium SP</Chip>} />
              <div className="form-row">
                <label>Rozet adı</label>
                <input className="input" defaultValue="Premium SP" />
              </div>
              <div className="form-row">
                <label>İkon</label>
                <div className="rowflex">
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: 'linear-gradient(135deg, var(--purple), #a78bfa)',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <Gem size={22} color="#fff" />
                  </div>
                  <button className="btn btn--ghost">Değiştir</button>
                </div>
              </div>
              <div className="form-row">
                <label>Tetikleyici metrik</label>
                <select className="select">
                  <option>Stratejik Ürün</option>
                  <option>Segmentasyon</option>
                </select>
              </div>
              <div className="form-row">
                <label>Eşik koşulu</label>
                <div className="input-row">
                  <span className="text-sm">≥</span>
                  <input className="input" defaultValue="20" />
                  <span className="text-sm">% Premium SP oranı</span>
                </div>
              </div>
              <div className="form-row">
                <label>Çarpan</label>
                <div className="input-row">
                  <span className="text-sm">×</span>
                  <input className="input" defaultValue="1.07" />
                </div>
              </div>
              <div className="form-row">
                <label>
                  Ay çarpanı <small>Bu ay özel bonus</small>
                </label>
                <div className="input-row">
                  <span className="text-sm">×</span>
                  <input className="input" defaultValue="1.20" />
                </div>
              </div>
              <div className="rowflex mt-24" style={{ justifyContent: 'flex-end' }}>
                <button className="btn btn--ghost">İptal</button>
                <button className="btn btn--primary">Kaydet</button>
              </div>
            </section>
          </div>

          <div className="stack">
            <section className="card card__pad">
              <CardHead title="Include / Exclude Bayi" inlineSub="· Manuel müdahale" />
              <div className="form-row">
                <label>Bayi seç</label>
                <select className="select">
                  <option>Ahmet Yıldız · İzmir · Ege</option>
                </select>
              </div>
              <div className="form-row">
                <label>Aksiyon</label>
                <SegTabs tabs={['Include', 'Exclude']} />
              </div>
              <div className="form-row">
                <label>
                  Sebep <small>Audit log için</small>
                </label>
                <textarea
                  className="textarea"
                  rows={3}
                  defaultValue="Mağaza taşınması sebebiyle Nisan'da veri eksik, operasyon devam ediyor."
                />
              </div>
              <div className="form-row">
                <label>Geçerlilik</label>
                <div className="input-row">
                  <select className="select">
                    <option>Mayıs 2026</option>
                  </select>
                  <span className="text-sm">→</span>
                  <select className="select">
                    <option>Tek ay</option>
                  </select>
                </div>
              </div>
              <Hint tone="blue" icon={<Info size={16} />}>
                Bu işlem <b>AI Product &amp; UX onayı</b> gerektirir ve audit loga işlenir.
              </Hint>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
