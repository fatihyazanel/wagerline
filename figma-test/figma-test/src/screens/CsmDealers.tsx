import { useState } from 'react'
import { BadgeCheck, ChevronDown, Flame, Radio, Shield, Target, Trophy } from 'lucide-react'
import { Avatar, CardHead, Chip, MetricRow, Progress, StatCard, gradients, type Tone } from '../components/ui'
import { csmDealerOptions } from '../gamificationDemo'

type Row = {
  initials: string
  gradient: string
  name: string
  loc: string
  league: string
  leagueTone: Tone
  total: string
  segmentation: string
  strategic: string
  challenge: string
  challengeTone: Tone
  badges: number
  trend: string
  trendTone: Tone
  risk?: boolean
}

const rows: Row[] = [
  { initials: 'MK', gradient: gradients.bluePurple, name: 'Mehmet Kaya', loc: 'Besiktas', league: 'Platin', leagueTone: 'blue', total: '88.7', segmentation: '86.3', strategic: '84.8', challenge: '%60', challengeTone: 'green', badges: 4, trend: '+8.4%', trendTone: 'green' },
  { initials: 'AT', gradient: gradients.amberOrange, name: 'Ayse Tunc', loc: 'Kadikoy', league: 'Elmas', leagueTone: 'amber', total: '94.2', segmentation: '88.4', strategic: '98.1', challenge: '%85', challengeTone: 'green', badges: 6, trend: '+5.1%', trendTone: 'green' },
  { initials: 'EB', gradient: gradients.greenTeal, name: 'Emre Bilgin', loc: 'Uskudar', league: 'Platin', leagueTone: 'blue', total: '83.6', segmentation: '84.4', strategic: '82.5', challenge: '%48', challengeTone: 'default', badges: 5, trend: '+0.3%', trendTone: 'default' },
  { initials: 'CD', gradient: gradients.redOrange, name: 'Can Demir', loc: 'Maltepe', league: 'Gumus', leagueTone: 'default', total: '61.8', segmentation: '72.1', strategic: '55.2', challenge: 'Yok', challengeTone: 'red', badges: 1, trend: '-4.2%', trendTone: 'red', risk: true },
  { initials: 'ZD', gradient: gradients.purplePink, name: 'Zeynep Duran', loc: 'Pendik', league: 'Altin', leagueTone: 'amber', total: '77.4', segmentation: '78.3', strategic: '74.6', challenge: '%72', challengeTone: 'green', badges: 3, trend: '+6.8%', trendTone: 'green' },
  { initials: 'NO', gradient: gradients.blueSky, name: 'Nur Ozkan', loc: 'Kartal', league: 'Platin', leagueTone: 'blue', total: '82.1', segmentation: '82.7', strategic: '79.4', challenge: '%55', challengeTone: 'default', badges: 4, trend: '+2.1%', trendTone: 'green' },
]

export default function CsmDealers() {
  const [selectedId, setSelectedId] = useState(csmDealerOptions[0].id)
  const selectedDealer = csmDealerOptions.find((dealer) => dealer.id === selectedId) ?? csmDealerOptions[0]

  return (
    <div className="screen">
      <div className="stack">
        <div className="grid-4">
          <StatCard label="Bayilerim" value="18" sub="Istanbul Anadolu" />
          <StatCard label="Ort. Gamification" value="79.6" sub="+2.8% vs onceki ay" />
          <StatCard label="Aktif Challenge" value={<>14<small>/18</small></>} sub="4 bayi henuz secmedi" />
          <StatCard label="Risk Altinda" pill="!" pillTone="red" value="3" sub="Dusuk stratejik urun" />
        </div>

        <section className="card card__pad">
          <CardHead title="Bayilerim - Performans Listesi" sub="Final puan 100'luk total gamification skalasinda gosterilir." right={<button className="btn btn--ghost">CSV</button>} />
          <table className="table">
            <thead>
              <tr>
                <th>Bayi</th>
                <th>Lig</th>
                <th>Gamification</th>
                <th>Segmentasyon</th>
                <th>Stratejik</th>
                <th>Challenge</th>
                <th>Rozet</th>
                <th>Trend</th>
                <th>Detay</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => {
                const detailId = csmDealerOptions[index % csmDealerOptions.length].id
                return (
                <tr key={row.name} className={row.risk ? 'is-risk' : undefined}>
                  <td>
                    <div className="avatar-cell">
                      <Avatar initials={row.initials} gradient={row.gradient} />
                      <div><div className="b">{row.name}</div><small>{row.loc}</small></div>
                    </div>
                  </td>
                  <td><Chip tone={row.leagueTone}>{row.league}</Chip></td>
                  <td>
                    <span className="rowflex">
                      <span className="miniprogress"><Progress value={Number(row.total)} tone={Number(row.total) > 85 ? 'green' : Number(row.total) < 70 ? undefined : 'blue'} /></span>
                      <b>{row.total}</b>
                    </span>
                  </td>
                  <td>{row.segmentation}</td>
                  <td>{row.strategic}</td>
                  <td><Chip tone={row.challengeTone}>{row.challenge}</Chip></td>
                  <td><span className="rowflex" style={{ gap: 4 }}>{row.badges}<Trophy size={13} color="var(--amber)" /></span></td>
                  <td><Chip tone={row.trendTone}>{row.trend}</Chip></td>
                  <td>
                    <button className="btn btn--ghost btn--sm" onClick={() => setSelectedId(detailId)}>
                      Detay <ChevronDown size={13} />
                    </button>
                  </td>
                </tr>
                )
              })}
            </tbody>
          </table>
        </section>

        <section className="card card__pad">
          <CardHead
            title={`Bayi Detay - ${selectedDealer.name}`}
            sub="Bayilerim listesinden secilen bayi icin puan kirilimi ve alt urun lig siralari."
            right={<Chip tone="blue">{selectedDealer.league} Lig</Chip>}
          />
          <div className="detail-hero detail-hero--compact">
            <span className="avatar-sm detail-hero__av">{selectedDealer.initials}</span>
            <div className="grow">
              <div className="detail-hero__eyebrow">BAYI DETAY - MARMARA</div>
              <div className="detail-hero__name">{selectedDealer.name} - {selectedDealer.location}</div>
              <div className="detail-hero__sub">Bayi kodu: B-2847 - CSM bagi: 16 ay - Min. ay kurali: OK</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="detail-hero__score-label">GAMIFICATION</div>
              <div className="detail-hero__score">{selectedDealer.total}</div>
              <div className="detail-hero__sub">{selectedDealer.rank}</div>
            </div>
          </div>
          <div className="grid-2 mt-24">
            <div>
              <MetricRow
                icon={<Target size={18} />}
                iconBg="var(--amber-bg)"
                iconColor="var(--amber)"
                name="Stratejik Urunler"
                sub="Urun agirliklari + rozet + streak + challenge"
                progress={selectedDealer.strategic}
                progressTone="amber"
                value={selectedDealer.strategic}
                valueSub="%70 ana agirlik"
              />
              <MetricRow
                icon={<Shield size={18} />}
                iconBg="var(--blue-bg)"
                iconColor="var(--blue)"
                name="Segmentasyon"
                sub="Kendi liginde dealer_score sirasi"
                progress={selectedDealer.segmentation}
                progressTone="blue"
                value={selectedDealer.segmentation}
                valueSub="%30 ana agirlik"
              />
              <MetricRow
                icon={<BadgeCheck size={18} />}
                iconBg="var(--green-bg)"
                iconColor="var(--green)"
                name="Bonus Etkisi"
                sub="Rozet + streak + challenge toplam etkisi"
                value={selectedDealer.total > 85 ? '+13.4' : selectedDealer.total > 70 ? '+6.2' : '+1.8'}
                valueSub="puan"
                box
              />
            </div>
            <div className="stack-sm">
              {selectedDealer.products.map((product) => (
                <div className={`product-score-card ${product.score >= 100 ? 'is-badge' : product.score < 60 ? 'is-weak' : ''}`} key={product.name}>
                  <div className="product-score-card__top">
                    <span className="rowflex"><Radio size={18} color="var(--amber)" /><span className="product-score-card__name">{product.name}</span></span>
                    <Chip tone={product.score >= 100 ? 'green' : product.score < 60 ? 'red' : 'amber'}>{product.rank}</Chip>
                  </div>
                  <div className="product-score-card__score">{product.score}</div>
                  <Progress value={Math.min(product.score, 100)} tone={product.score >= 100 ? 'amber' : product.score < 60 ? undefined : 'blue'} />
                  <div className="product-score-card__foot">
                    <span>Onceki ay: {product.previous}</span>
                    <span className={product.rank < product.previous ? 'trend-up' : 'trend-down'}>{product.rank < product.previous ? 'Yukselis' : 'Dususte'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid-3 mt-24">
            <div className="listbox"><Trophy size={18} color="var(--amber)" /><div><div className="b">En iyi ay</div><div className="text-sm text-muted">Haziran - {Math.min(selectedDealer.total + 4.6, 100).toFixed(1)}</div></div></div>
            <div className="listbox"><Flame size={18} color="var(--red)" /><div><div className="b">Streak</div><div className="text-sm text-muted">{selectedDealer.total > 80 ? 'Aktif' : 'Pasif'} - ilk n kontrolu</div></div></div>
            <div className="listbox"><Target size={18} color="var(--green)" /><div><div className="b">Challenge</div><div className="text-sm text-muted">{selectedDealer.total > 80 ? 'Kazanma ihtimali yuksek' : 'Takip gerekli'}</div></div></div>
          </div>
        </section>
      </div>
    </div>
  )
}
