import { useState } from 'react'
import { BadgeCheck, Flame, Radio, Shield, Target, Trophy } from 'lucide-react'
import { CardHead, Chip, MetricRow, Progress } from '../components/ui'
import { csmDealerOptions } from '../gamificationDemo'

export default function CsmDealerDetail() {
  const [dealerId, setDealerId] = useState(csmDealerOptions[0].id)
  const dealer = csmDealerOptions.find((item) => item.id === dealerId) ?? csmDealerOptions[0]

  return (
    <div className="screen">
      <div className="stack">
        <section className="card card__pad">
          <CardHead title="Bayi Sec" sub="Demo icin 3 bayi arasinda gecis yap; puan kirilimi ve urun lig siralari degisir." />
          <div className="selector-row" style={{ marginTop: 14 }}>
            {csmDealerOptions.map((item) => (
              <button key={item.id} className={`selector-pill ${dealerId === item.id ? 'is-active' : ''}`} onClick={() => setDealerId(item.id)}>
                {item.name} - {item.league}
              </button>
            ))}
          </div>
        </section>

        <div className="detail-hero">
          <span className="avatar-sm detail-hero__av">{dealer.initials}</span>
          <div className="grow">
            <div className="detail-hero__eyebrow">BAYI DETAY - {dealer.league.toUpperCase()} - MARMARA</div>
            <div className="detail-hero__name">{dealer.name} - {dealer.location}</div>
            <div className="detail-hero__sub">Bayi kodu: B-2847 - CSM bagi: 16 ay - Min. ay kurali: OK</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="detail-hero__score-label">GAMIFICATION</div>
            <div className="detail-hero__score">{dealer.total}</div>
            <div className="detail-hero__sub">{dealer.rank} - {dealer.league}</div>
          </div>
        </div>

        <div className="grid-2">
          <section className="card card__pad">
            <CardHead title="Gamification Puan Kirilimi" sub="Alt kalemler ve bonuslar 100'luk total puana yansir." />
            <MetricRow
              icon={<Target size={18} />}
              iconBg="var(--amber-bg)"
              iconColor="var(--amber)"
              name="Stratejik Urunler"
              sub="Urun agirliklari + rozet + streak + challenge"
              progress={dealer.strategic}
              progressTone="amber"
              value={dealer.strategic}
              valueSub="%70 ana agirlik"
            />
            <MetricRow
              icon={<Shield size={18} />}
              iconBg="var(--blue-bg)"
              iconColor="var(--blue)"
              name="Segmentasyon"
              sub="Kendi liginde dealer_score sirasi"
              progress={dealer.segmentation}
              progressTone="blue"
              value={dealer.segmentation}
              valueSub="%30 ana agirlik"
            />
            <MetricRow
              icon={<BadgeCheck size={18} />}
              iconBg="var(--green-bg)"
              iconColor="var(--green)"
              name="Rozet / Streak / Challenge"
              sub="Admin rozet +%10, streak +%20, challenge +%8"
              value={dealer.total > 85 ? '+13.4' : dealer.total > 70 ? '+6.2' : '+1.8'}
              valueSub="bonus etkisi"
              box
            />
          </section>

          <section className="card card__pad">
            <CardHead title="Urun Bazli Lig Sirasi" sub="Secili bayinin gecmise gore urun siralari." />
            <div className="stack-sm">
              {dealer.products.map((product) => (
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
          </section>
        </div>

        <section className="card card__pad">
          <CardHead title="Gecmis Akis" sub="Son 6 ay gamification ve secili urun sirasi hikayesi." right={<Chip tone="blue">Urun secilebilir demo</Chip>} />
          <div className="grid-3">
            <div className="listbox"><Trophy size={18} color="var(--amber)" /><div><div className="b">En iyi ay</div><div className="text-sm text-muted">Haziran - {Math.min(dealer.total + 4.6, 100).toFixed(1)}</div></div></div>
            <div className="listbox"><Flame size={18} color="var(--red)" /><div><div className="b">Streak</div><div className="text-sm text-muted">{dealer.total > 80 ? 'Aktif' : 'Pasif'} - ilk n kontrolu</div></div></div>
            <div className="listbox"><Target size={18} color="var(--green)" /><div><div className="b">Challenge</div><div className="text-sm text-muted">{dealer.total > 80 ? 'Kazanma ihtimali yuksek' : 'Takip gerekli'}</div></div></div>
          </div>
        </section>
      </div>
    </div>
  )
}
