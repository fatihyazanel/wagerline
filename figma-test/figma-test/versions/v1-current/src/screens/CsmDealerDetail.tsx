import { Shield, Target, Trophy, Zap, Radio, Globe, Sprout } from 'lucide-react'
import { CardHead, MetricRow, ManagerNote, ChallengeCard, BadgeCard } from '../components/ui'

export default function CsmDealerDetail() {
  return (
    <div className="screen">
      <div className="stack">
        <div className="detail-hero">
          <span className="avatar-sm detail-hero__av">MK</span>
          <div className="grow">
            <div className="detail-hero__eyebrow">BAYİ DETAY · LİG 5 · MARMARA</div>
            <div className="detail-hero__name">Mehmet Kaya — Beşiktaş</div>
            <div className="detail-hero__sub">Bayi kodu: B-2847 · CSM bağı: 16 ay · Min. ay kuralı: ✓</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="detail-hero__score-label">FİNAL PUAN</div>
            <div className="detail-hero__score">7.250</div>
            <div className="detail-hero__sub">5. / 186 · Lig 5</div>
          </div>
        </div>

        <div className="grid-2">
          {/* LEFT */}
          <div className="stack">
            <section className="card card__pad">
              <CardHead title="Puan Kırılımı" />
              <MetricRow
                icon={<Shield size={18} />}
                iconBg="var(--purple-bg)"
                iconColor="var(--purple)"
                name="Segmentasyon"
                progress={85}
                progressTone="purple"
                value="85.6"
                valueSub="×0.50"
              />
              <MetricRow
                icon={<Target size={18} />}
                iconBg="var(--amber-bg)"
                iconColor="var(--amber)"
                name="Stratejik Ürünler"
                progress={82}
                value="82.4"
                valueSub="×0.50"
              />
              <MetricRow
                icon={<Trophy size={18} />}
                iconBg="var(--green-bg)"
                iconColor="var(--green)"
                name="Rozet Çarpanı"
                progress={70}
                progressTone="green"
                value="×1.23"
                valueSub="4 aktif"
              />
              <MetricRow
                icon={<Zap size={18} />}
                iconBg="var(--bronz-bg)"
                iconColor="var(--bronz)"
                name="Challenge + Bölge"
                progress={65}
                value="+395"
                valueSub="Bonus puan"
              />
            </section>

            <section className="card card__pad">
              <CardHead title="Geçmiş Performans" inlineSub="· Son 6 ay" />
              <svg className="chart-svg" viewBox="0 0 600 160" style={{ height: 160 }}>
                <defs>
                  <linearGradient id="csmDealerArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,120 L100,100 L200,90 L300,60 L400,75 L500,50 L600,55 L600,160 L0,160 Z" fill="url(#csmDealerArea)" />
                <path d="M0,120 L100,100 L200,90 L300,60 L400,75 L500,50 L600,55" stroke="var(--brand)" strokeWidth="3" fill="none" />
                <g fill="var(--muted)" fontSize="10" fontFamily="Inter">
                  <text x="0" y="155">Ara</text>
                  <text x="100" y="155">Oca</text>
                  <text x="200" y="155">Şub</text>
                  <text x="300" y="155">Mar</text>
                  <text x="400" y="155">Nis</text>
                  <text x="500" y="155">May</text>
                  <text x="580" y="155">Haz</text>
                </g>
              </svg>
            </section>
          </div>

          {/* RIGHT */}
          <div className="stack">
            <section className="card card__pad">
              <CardHead title="Yönetici Notu" inlineSub="· Bayi mobile/dashboard'unda gözükür" />
              <ManagerNote
                initials="SY"
                name="Senin notu (gönderildi)"
                role="15 Haz · 14:22"
                text="Mehmet, Premium SP oranında son 2 hafta gerçekten iyi ilerleme var (12/20). Ay sonuna 8 satış kaldı — Pazartesi mağaza ziyaretinde bayi vitrini düzenleme önerilerimi konuşalım. 5G challenge'da da tempon iyi, devam."
              />
              <textarea
                className="textarea"
                rows={3}
                placeholder="Yeni not yaz... (Bayinin ana sayfasında gözükecek)"
                style={{ marginTop: 12 }}
              />
              <div className="spread" style={{ marginTop: 8 }}>
                <span className="text-sm text-muted">📌 Notlar audit loga işlenir</span>
                <button className="btn btn--primary">Not Gönder</button>
              </div>
            </section>

            <section className="card card__pad">
              <CardHead title="Aktif Challenge" />
              <ChallengeCard
                tag="STRATEJİK ÜRÜN"
                title="5G destekli cihaz · 30 adet"
                desc="%60 ilerleme · 8 gün kaldı"
                progress={60}
              />
              <div className="rowflex" style={{ marginTop: 16, gap: 8 }}>
                <button className="btn btn--ghost">Hedef Düzenle</button>
                <button className="btn btn--ghost">İptal</button>
                <button className="btn btn--primary">Tamamlanmış İşaretle</button>
              </div>
            </section>

            <section className="card card__pad">
              <CardHead title="Aktif Rozetler" />
              <div className="badge-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                <BadgeCard icon={<Trophy size={20} />} medal="amber" name="Segment Üstü" />
                <BadgeCard icon={<Radio size={20} />} medal="blue" name="5G Öncüsü" />
                <BadgeCard icon={<Globe size={20} />} medal="bronz" name="Fiber Ustası" />
                <BadgeCard icon={<Sprout size={20} />} medal="green" name="Yükselen" />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
