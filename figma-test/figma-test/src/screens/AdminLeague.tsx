import { Shield, Target, TrendingUp, Zap } from 'lucide-react'
import { CardHead, Chip, FlowSteps, Hint, Switch } from '../components/ui'
import { scoringWeights } from '../gamificationDemo'

export default function AdminLeague() {
  return (
    <div className="screen">
      <div className="stack">
        <section className="card card__pad">
          <CardHead
            title="Aylik Hesaplama Akisi"
            sub="800-900 bayi her ay basinda son 12 aylik uretim puanina gore 5 lige dagitilir."
            right={<Chip tone="green">Temmuz 2026 aktif</Chip>}
          />
          <FlowSteps
            steps={[
              { title: 'Uretim baz puani', desc: 'Son 12 ay, min ay ve exclude kurallari uygulanir.', state: 'done' },
              { title: '5 lige cluster', desc: 'Elmas, Platin, Altin, Gumus, Bronz.', state: 'done' },
              { title: 'Gunluk veri', desc: 'SOL, dealer_score ve aktif urun metrikleri alinir.', state: 'active' },
              { title: 'Normalize et', desc: 'Her ligde metrikler 0-100 araligina cekilir.' },
              { title: 'Rozet/bonus', desc: 'Ilk n, streak ve challenge odulleri uygulanir.' },
              { title: 'ICM final', desc: 'Ay sonunda canli degerler ICM ile karsilastirilir.' },
            ]}
          />
        </section>

        <div className="grid-2">
          <section className="card card__pad">
            <CardHead title="Ana Metrik Agirliklari" right={<button className="btn btn--primary">Onaya Gonder</button>} />
            <div className="weight-row">
              <div className="weight-row__n"><span className="rowflex"><Target size={15} /> Stratejik Urunler</span></div>
              <input type="range" min={0} max={100} defaultValue={scoringWeights.strategic} />
              <div className="weight-row__pct">{scoringWeights.strategic}%</div>
            </div>
            <div className="weight-row">
              <div className="weight-row__n"><span className="rowflex"><Shield size={15} /> Segmentasyon</span></div>
              <input type="range" min={0} max={100} defaultValue={scoringWeights.segmentation} />
              <div className="weight-row__pct">{scoringWeights.segmentation}%</div>
            </div>
            <div className="weight-row">
              <div className="weight-row__n"><span className="rowflex"><Zap size={15} /> HGO</span></div>
              <input type="range" min={0} max={100} defaultValue={0} disabled />
              <div className="weight-row__pct">0%</div>
            </div>
            <div className="weight-row">
              <div className="weight-row__n"><span className="rowflex"><TrendingUp size={15} /> Buyume</span></div>
              <input type="range" min={0} max={100} defaultValue={0} disabled />
              <div className="weight-row__pct">0%</div>
            </div>
            <Hint tone="amber">
              HGO ve Buyume Faz 1'de sayfalarda gorunur, fakat toplam puana etkisi 0. Agirlik degisikligi onaydan sonra tum bayiler icin yeniden hesaplama baslatir.
            </Hint>
          </section>

          <section className="card card__pad">
            <CardHead title="Lig Parametreleri" />
            <div className="form-row">
              <label>Hesaplanacak donem <small>Cluster baz periyodu</small></label>
              <div className="input-row"><input className="input" defaultValue="12" /><span className="text-sm">ay</span></div>
            </div>
            <div className="form-row">
              <label>Minimum aktif ay</label>
              <div className="input-row"><input className="input" defaultValue="3" /><span className="text-sm">ay</span></div>
            </div>
            <div className="form-row">
              <label>Lig yapisi</label>
              <div className="listbox">
                <div className="listbox__grow">
                  <div className="b">Fix 5 lig</div>
                  <div className="text-sm text-muted">Elmas, Platin, Altin, Gumus, Bronz</div>
                </div>
                <Chip tone="blue">Kilitli</Chip>
              </div>
            </div>
            <div className="form-row">
              <label>Exclude bayi listesi</label>
              <Switch on />
            </div>
            <div className="form-row">
              <label>Ay sonu ICM kontrolu</label>
              <Switch on />
            </div>
            <div className="form-row">
              <label>Bolge bonusu</label>
              <div className="rowflex"><Switch locked /><span className="text-sm text-muted">Kaldirildi</span></div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
