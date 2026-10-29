import { useState } from 'react'
import { BarChart3, Building2, Package, Trophy } from 'lucide-react'
import { CardHead, Chip, Progress, StatCard } from '../components/ui'
import { firmDealerRows } from '../gamificationDemo'

const formatValue = (value: number, unit: string) =>
  unit === 'TL' ? value.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }) : `${value} adet`

export default function FirmDealers() {
  const [selectedId, setSelectedId] = useState(firmDealerRows[0].id)
  const selected = firmDealerRows.find((dealer) => dealer.id === selectedId) ?? firmDealerRows[0]
  const firmAvg = Math.round((firmDealerRows.reduce((sum, dealer) => sum + dealer.total, 0) / firmDealerRows.length) * 10) / 10

  return (
    <div className="screen">
      <div className="stack">
        <div className="game-strip">
          <StatCard label="Firma bayi sayisi" value={firmDealerRows.length} sub="Ayni firmaya bagli aktif bayi" />
          <StatCard label="Ort. gamification" value={firmAvg} sub="100'luk firma ortalamasi" pill="Firma" pillTone="blue" />
          <StatCard label="En guclu bayi" value={firmDealerRows[1].code} sub="Elmas ligde 96.8 puan" pill="Lider" pillTone="amber" />
        </div>

        <div className="grid-2">
          <section className="card card__pad">
            <CardHead title="Bayilerim" sub="Firma rolu, bir firmaya bagli tum bayileri ve performans siralamasini gorur." />
            <div className="stack-sm">
              {firmDealerRows.map((dealer, index) => (
                <button
                  key={dealer.id}
                  className={`listbox listbox--button ${dealer.id === selected.id ? 'listbox--blue' : ''}`}
                  onClick={() => setSelectedId(dealer.id)}
                >
                  <span className="avatar-sm" style={{ background: index < 2 ? 'var(--amber)' : 'var(--blue)' }}>
                    {index + 1}
                  </span>
                  <div className="listbox__grow">
                    <div className="b">{dealer.code}</div>
                    <div className="text-sm text-muted">{dealer.region} - {dealer.city} - {dealer.league} Lig</div>
                  </div>
                  <div className="mini-score">
                    <b>{dealer.total}</b>
                    <small>Total</small>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="card card__pad">
            <CardHead
              title={`${selected.code} Detay`}
              sub={`${selected.region} - ${selected.city}`}
              right={<Chip tone="amber">{selected.league} Lig</Chip>}
            />
            <div className="grid-3">
              <div className="game-tile">
                <div className="game-tile__label">Gamification</div>
                <div className="game-tile__value">{selected.total}</div>
                <div className="game-tile__sub">{selected.rank} lig sirasi</div>
              </div>
              <div className="game-tile">
                <div className="game-tile__label">Stratejik urun</div>
                <div className="game-tile__value">{selected.strategic}</div>
                <div className="game-tile__sub">Alt urun katkilari</div>
              </div>
              <div className="game-tile">
                <div className="game-tile__label">Segmentasyon</div>
                <div className="game-tile__value">{selected.segmentation}</div>
                <div className="game-tile__sub">Lig ici normalize</div>
              </div>
            </div>

            <div className="stack-sm mt-24">
              {selected.products.map((product) => (
                <div className="listbox" key={product.name}>
                  <Package size={18} color="var(--blue)" />
                  <div className="listbox__grow">
                    <div className="spread">
                      <b>{product.name}</b>
                      <span className="text-sm text-muted">{product.rank}</span>
                    </div>
                    <Progress value={Math.min(product.score, 100)} tone={product.score >= 90 ? 'amber' : product.score >= 70 ? 'blue' : 'purple'} />
                  </div>
                  <div className="mini-score">
                    <b>{product.score}</b>
                    <small>{formatValue(product.value, product.unit)}</small>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="card card__pad">
          <CardHead title="Firma Ici Sinyaller" sub="Firma sahibinin hizli okuyacagi aksiyon alanlari." />
          <div className="grid-3">
            <div className="listbox listbox--green">
              <Trophy size={18} color="var(--green)" />
              <div><div className="b">En yuksek potansiyel</div><div className="text-sm text-muted">Bayi-7810 rekontratlamada ilk 7'de</div></div>
            </div>
            <div className="listbox listbox--amber">
              <BarChart3 size={18} color="var(--amber)" />
              <div><div className="b">Riskli urun</div><div className="text-sm text-muted">Bayi-9055 Fiber puani 49.8</div></div>
            </div>
            <div className="listbox listbox--blue">
              <Building2 size={18} color="var(--blue)" />
              <div><div className="b">Bolge farki</div><div className="text-sm text-muted">Ege bayisi totalde firma lideri</div></div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
