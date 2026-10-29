import { Target, BarChart3 } from 'lucide-react'
import { CardHead, Hint, StatCard, SegTabs } from '../components/ui'

export default function DealerLeague() {
  return (
    <div className="screen">
      <div className="stack">
        <div className="grid-2-eq">
          <div className="anon-rank">
            <div className="anon-rank__label">SENİN POZİSYONUN · LİG 5</div>
            <div className="anon-rank__rank">
              5.<small>/186 bayi</small>
            </div>
            <div className="anon-rank__meta">
              <div>
                <div className="v">7.250</div>
                <div className="l">Final Puanın</div>
              </div>
              <div>
                <div className="v">−480</div>
                <div className="l">Lidere fark</div>
              </div>
              <div>
                <div className="v">+170</div>
                <div className="l">6. sıraya fark</div>
              </div>
            </div>
          </div>

          <section className="card card__pad">
            <CardHead title="Pozisyon Çubuğu" inlineSub="· 186 bayi içinde nerelisin" />
            <div className="position-bar">
              <div className="position-bar__fill" style={{ width: '97.3%' }} />
              <div className="position-bar__me" style={{ left: '97.3%' }} />
            </div>
            <div className="position-labels">
              <span>186. (en alt)</span>
              <span>1. (lider)</span>
            </div>
            <div style={{ marginTop: 16 }}>
              <Hint tone="brand" icon={<Target size={16} />}>
                Üst %3'tesin. Üst %1'e girmek için <b>+320 puan</b> daha
                gerekiyor. Strateji önerisi: <b>Premium SP rozeti</b> tamamlama (8
                satış).
              </Hint>
            </div>
          </section>
        </div>

        <section className="card card__pad">
          <CardHead
            title="Lig 5 Puan Dağılımı"
            inlineSub="· 186 bayinin puan aralığı (anonim)"
            right={<SegTabs tabs={['Bu ay', '3 ay', 'Trend']} />}
          />
          <div className="distribution">
            <div className="bar" style={{ height: '25%' }} />
            <div className="bar" style={{ height: '45%' }} />
            <div className="bar" style={{ height: '65%' }} />
            <div className="bar" style={{ height: '85%' }} />
            <div className="bar" style={{ height: '95%' }} />
            <div className="bar" style={{ height: '70%' }} />
            <div className="bar is-me" style={{ height: '55%' }} />
            <div className="bar" style={{ height: '30%' }} />
          </div>
          <div className="spread text-sm text-muted" style={{ marginTop: 8 }}>
            <span>5.000</span>
            <span>5.500</span>
            <span>6.000</span>
            <span>6.500</span>
            <span>7.000</span>
            <span>7.500</span>
            <span>8.000</span>
            <span>8.500+</span>
          </div>
          <div style={{ marginTop: 16 }}>
            <Hint tone="brand" icon={<BarChart3 size={16} />}>
              Bayilerin <b>%62'si</b> 6.000-7.500 aralığında. Sen <b>7.250</b> ile
              güçlü orta-üst kümede yer alıyorsun.
            </Hint>
          </div>
        </section>

        <div className="grid-3">
          <StatCard
            label="Bu ayki ilerlemen"
            value={<span style={{ color: 'var(--green)' }}>+8.4%</span>}
            sub="Final puan değişimi"
          />
          <StatCard label="Yıl içi en yüksek" value="3." sub="Mart 2026 · 7.480 puan" />
          <StatCard label="Aktif lig kalan süre" value="8 gün" sub="31 May 23:59'de finalize" />
        </div>
      </div>
    </div>
  )
}
