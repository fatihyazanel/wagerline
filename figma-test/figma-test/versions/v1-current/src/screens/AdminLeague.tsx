import { Coins, Gem, Globe, Radio, Shield, Target } from 'lucide-react'
import { CardHead, Chip, FlowSteps, Hint, Switch } from '../components/ui'

export default function AdminLeague() {
  return (
    <div className="screen">
      <div className="stack">
        <section className="card card__pad">
          <CardHead
            title="Aylık Hesaplama Akışı"
            inlineSub="· Mayıs 2026"
            right={<Chip tone="green">3/6 tamamlandı</Chip>}
          />
          <FlowSteps
            steps={[
              { title: 'Veri Girişi', desc: 'SOL → ürün puanları', state: 'done' },
              { title: 'Uygunluk', desc: 'Min. ay kuralı + Include/Exclude', state: 'done' },
              { title: 'Hesaplama', desc: 'Segmentasyon + Stratejik Ürün', state: 'active' },
              { title: 'Bap Yayını', desc: '23 May · Rozet hedefleri' },
              { title: 'Takip', desc: 'Challenge izleme' },
              { title: 'Finalizasyon', desc: '31 May 23:59 · Ödül' },
            ]}
          />
        </section>

        <div className="grid-2">
          <div className="stack">
            <section className="card card__pad">
              <CardHead
                title="Ana Puan Başlık Ağırlıkları"
                inlineSub="· PDF Slide 4: 2 ana başlık"
                right={<button className="btn btn--primary">Onaya Gönder</button>}
              />
              <div className="weight-row">
                <div className="weight-row__n">
                  <span className="rowflex">
                    <Shield size={15} /> Segmentasyon
                  </span>
                </div>
                <input type="range" min={0} max={100} defaultValue={50} />
                <div className="weight-row__pct">50%</div>
              </div>
              <div className="weight-row">
                <div className="weight-row__n">
                  <span className="rowflex">
                    <Target size={15} /> Stratejik Ürünler
                  </span>
                </div>
                <input type="range" min={0} max={100} defaultValue={50} />
                <div className="weight-row__pct">50%</div>
              </div>
              <Hint tone="amber">
                ⚠️ Ağırlıklar değiştirilirse tüm bayi puanları yeniden hesaplanır. AI Product &amp; UX onayı gerekir.
              </Hint>
            </section>
          </div>

          <div className="stack">
            <section className="card card__pad">
              <CardHead title="Lig Ayarları" />
              <div className="form-row">
                <label>Lig dönemi</label>
                <select className="select">
                  <option>Aylık</option>
                  <option>3 Aylık</option>
                </select>
              </div>
              <div className="form-row">
                <label>
                  Min. ay kuralı <small>Eligibility eşiği</small>
                </label>
                <div className="input-row">
                  <input className="input" defaultValue="3" />
                  <span className="text-sm">ay</span>
                </div>
              </div>
              <div className="form-row">
                <label>Lig sayısı</label>
                <div className="input-row">
                  <input className="input" defaultValue="8" />
                  <span className="text-sm">lig</span>
                </div>
              </div>
              <div className="form-row">
                <label>Otomatik finalizasyon</label>
                <Switch on />
              </div>
              <div className="form-row">
                <label>Bayi-bayi karşılaştırma</label>
                <div className="rowflex">
                  <Switch locked />
                  <span className="text-sm text-muted">PDF #4 — Kapalı, değiştirilemez</span>
                </div>
              </div>
            </section>
          </div>
        </div>

        <section className="card card__pad">
          <CardHead
            title="Stratejik Ürün Havuzu"
            inlineSub="· PDF Slide 4: sabit ürün listesi"
            right={<button className="btn btn--amber">+ Yeni Ürün</button>}
          />
          <table className="table">
            <thead>
              <tr>
                <th>Ürün</th>
                <th>Kategori</th>
                <th>Çarpan</th>
                <th>Min. Hedef</th>
                <th>Aktif Bayi</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="cell-strong">
                  <span className="rowflex">
                    <Gem size={15} /> Premium SP
                  </span>
                </td>
                <td>
                  <Chip tone="amber">Premium</Chip>
                </td>
                <td>×1.5</td>
                <td>%20</td>
                <td>186</td>
                <td>
                  <Chip tone="green">Aktif</Chip>
                </td>
              </tr>
              <tr>
                <td className="cell-strong">
                  <span className="rowflex">
                    <Radio size={15} /> 5G Destekli Cihaz
                  </span>
                </td>
                <td>
                  <Chip tone="blue">5G</Chip>
                </td>
                <td>×1.3</td>
                <td>30 adet</td>
                <td>186</td>
                <td>
                  <Chip tone="green">Aktif</Chip>
                </td>
              </tr>
              <tr>
                <td className="cell-strong">
                  <span className="rowflex">
                    <Globe size={15} /> Fiber
                  </span>
                </td>
                <td>
                  <Chip tone="amber">Altyapı</Chip>
                </td>
                <td>×1.2</td>
                <td>%15 pen.</td>
                <td>142</td>
                <td>
                  <Chip tone="green">Aktif</Chip>
                </td>
              </tr>
              <tr>
                <td className="cell-strong">
                  <span className="rowflex">
                    <Coins size={15} /> Yüksek TL Paket
                  </span>
                </td>
                <td>
                  <Chip tone="green">Paket</Chip>
                </td>
                <td>×1.10</td>
                <td>10 adet</td>
                <td>186</td>
                <td>
                  <Chip>Pilot</Chip>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  )
}
