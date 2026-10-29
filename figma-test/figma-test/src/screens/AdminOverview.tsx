import { CardHead, Chip, Donut, SegTabs, StatCard } from '../components/ui'

export default function AdminOverview() {
  return (
    <div className="screen">
      <div className="stack">
        <div className="grid-4">
          <StatCard label="Toplam Bayi" pill="+%4" value="1.248" sub="Aktif lig katılımı" />
          <StatCard label="Eligible" pill="Min. ay ✓" value="186" sub="Lig 5 · 32 bayi yeni" />
          <StatCard label="Ortalama Final" value="6.890" sub="▲ +2.3% vs Nisan" />
          <StatCard label="Rozet Sahipliği" pill="-%2" pillTone="red" value="243" sub="8 farklı rozet" />
        </div>

        <div className="grid-2">
          <section className="card card__pad">
            <CardHead
              title="Lig Performans Trendi"
              inlineSub="· Tüm bayiler"
              right={<SegTabs tabs={['Aylık', '3 ay', 'Yıllık']} />}
            />
            <svg className="chart-svg" viewBox="0 0 600 200">
              <defs>
                <linearGradient id="ao-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,150 L100,120 L200,135 L300,90 L400,100 L500,60 L600,75 L600,200 L0,200 Z" fill="url(#ao-area)" />
              <path
                d="M0,150 L100,120 L200,135 L300,90 L400,100 L500,60 L600,75"
                stroke="var(--brand)"
                strokeWidth="3"
                fill="none"
              />
              <path
                d="M0,175 L100,165 L200,140 L300,150 L400,120 L500,130 L600,110"
                stroke="var(--purple)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="4 4"
              />
              <g fill="var(--muted)" fontSize="10" fontFamily="Inter">
                <text x="0" y="195">Oca</text>
                <text x="100" y="195">Şub</text>
                <text x="200" y="195">Mar</text>
                <text x="300" y="195">Nis</text>
                <text x="400" y="195">May</text>
                <text x="500" y="195">Haz</text>
                <text x="580" y="195">Tmz</text>
              </g>
            </svg>
            <div className="chart-legend">
              <div className="chart-legend__row">
                <span className="chart-legend__dot" style={{ background: 'var(--brand)' }} />
                Ort. Final Puan
              </div>
              <div className="chart-legend__row">
                <span className="chart-legend__dot" style={{ background: 'var(--purple)' }} />
                Ort. Segmentasyon
              </div>
            </div>
          </section>

          <section className="card card__pad">
            <CardHead title="Final Puan Kırılımı" inlineSub="· Sistemwide ortalama" />
            <Donut
              centerValue="6.890"
              centerLabel="Ort. Final"
              segments={[
                { pct: 50, color: 'var(--purple)', label: 'Segmentasyon (50%)', value: '3.420' },
                { pct: 50, color: 'var(--amber)', label: 'Stratejik Ürün (50%)', value: '3.295' },
                { pct: 0, color: 'var(--green)', label: 'Rozet bonusu', value: '+%18 ort.' },
                { pct: 0, color: 'var(--bronz)', label: 'Challenge + Bölge', value: '+175 ort.' },
              ]}
            />
          </section>
        </div>

        <section className="card card__pad">
          <CardHead
            title="Ay Sonu Finalizasyon Önizleme"
            right={<button className="btn btn--primary">Finalize</button>}
          />
          <div className="stack-sm">
            <div className="listbox">
              <div className="rowflex grow">
                <Chip tone="amber">🥇 Lig 5 Şampiyonu</Chip>
                <span className="grow b">Anonim — 7.730 puan</span>
                <span>+1.500 puan ödül</span>
              </div>
            </div>
            <div className="listbox">
              <div className="rowflex grow">
                <Chip tone="green">🌐 Bölge 1</Chip>
                <span className="grow b">Ege · 112 bayi</span>
                <span>+%6 bonus</span>
              </div>
            </div>
            <div className="listbox">
              <div className="rowflex grow">
                <Chip tone="blue">🎯 Challenge Hedef</Chip>
                <span className="grow b">115 başarılı tamamlama</span>
                <span>Ort. +250 puan</span>
              </div>
            </div>
            <div className="listbox listbox--amber">
              <div className="rowflex grow">
                <Chip tone="amber">⚡ Streak Lideri</Chip>
                <span className="grow b">Anonim · 14 gün streak</span>
                <span>×1.10 çarpan</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
