import {
  Shield,
  Target,
  Zap,
  Trophy,
  Radio,
  Globe,
  Gem,
  Rocket,
  Flame,
  ArrowUp,
} from 'lucide-react'
import {
  CardHead,
  Chip,
  MetricRow,
  BadgeCard,
  ChallengeCard,
  ManagerNote,
} from '../components/ui'

export default function DealerDashboard() {
  return (
    <div className="screen">
      <div className="stack">
        {/* HERO */}
        <div className="hero">
          <div className="hero__row">
            <div className="hero__score">
              <div className="hero__score-label">FİNAL PUAN</div>
              <div className="hero__score-val">7.250</div>
              <div className="hero__score-sub">Mayıs 2026 · Lig 5</div>
            </div>
            <div className="hero__meta">
              <div>
                <div className="hero__meta-lbl">Pozisyonum</div>
                <div className="hero__meta-v">
                  5.<small>/186</small>
                </div>
                <div className="delta-up">
                  <ArrowUp size={12} /> 3 sıra (haftalık)
                </div>
              </div>
              <div>
                <div className="hero__meta-lbl">Segmentasyon</div>
                <div className="hero__meta-v">
                  85.6<small>/100</small>
                </div>
                <div className="delta-up">
                  <ArrowUp size={12} /> +2.3
                </div>
              </div>
              <div>
                <div className="hero__meta-lbl">Stratejik Ürün</div>
                <div className="hero__meta-v">
                  82.4<small>/100</small>
                </div>
                <div className="delta-up">
                  <ArrowUp size={12} /> +1.8
                </div>
              </div>
              <div>
                <div className="hero__meta-lbl">Rozet Çarpanı</div>
                <div className="hero__meta-v">×1.23</div>
                <div className="delta-up">4 rozet aktif</div>
              </div>
            </div>
            <div className="streak-pill">
              <Flame size={16} /> 14 gün streak
            </div>
          </div>
        </div>

        <div className="grid-2">
          {/* LEFT */}
          <div className="stack">
            <section className="card card__pad">
              <CardHead
                title="Final Puan Kırılımı"
                inlineSub="· 2 ana puan başlığı + bonuslar"
                right={<Chip tone="amber">+12% vs Nisan</Chip>}
              />
              <MetricRow
                icon={<Shield size={18} />}
                iconBg="var(--purple-bg)"
                iconColor="var(--purple)"
                name="Segmentasyon"
                sub="Kulvar içi pozisyon + gelişim"
                progress={85}
                progressTone="purple"
                value="85.6"
                valueSub="%50 ağırlık"
              />
              <MetricRow
                icon={<Target size={18} />}
                iconBg="var(--amber-bg)"
                iconColor="var(--amber)"
                name="Stratejik Ürünler"
                sub="5G, Fiber, Premium SP, Yüksek TL"
                progress={82}
                value="82.4"
                valueSub="%50 ağırlık"
              />
              <MetricRow
                icon={<Zap size={18} />}
                iconBg="#fff"
                iconColor="var(--amber)"
                name="Bonuslar"
                sub="Rozet ×1.23 · Challenge +250 · Bölge +%3"
                value="+1.450"
                valueSub="Final puana eklendi"
                box
              />
            </section>

            <section className="card card__pad">
              <CardHead
                title="Yaklaşan Rozetler"
                right={<Chip tone="blue">Tümünü gör</Chip>}
              />
              <div className="badge-grid">
                <BadgeCard icon={<Trophy size={24} />} medal="amber" name="Segmentasyon Üstü" desc="Kulvarda +%30" mult="×1.10" />
                <BadgeCard icon={<Radio size={24} />} medal="blue" name="5G Öncüsü" desc="50+ 5G/ay" mult="×1.08" />
                <BadgeCard icon={<Globe size={24} />} medal="bronz" name="Fiber Ustası" desc="Pen. %15+" mult="×1.05" />
                <BadgeCard icon={<Gem size={24} />} medal="purple" name="Premium SP" desc="SP %20+" lock="12/20" locked />
                <BadgeCard icon={<Rocket size={24} />} medal="green" name="Hızlı Yükselen" desc="Kulvarda yukarı" lock="Kilitli" locked />
              </div>
            </section>
          </div>

          {/* RIGHT */}
          <div className="stack">
            <section className="card card__pad">
              <CardHead title="Aktif Challenge" right={<Chip tone="green">8 gün kaldı</Chip>} />
              <ChallengeCard
                icon={<Target size={86} />}
                tag="STRATEJİK ÜRÜN"
                title="Bu ay 5G destekli cihaz satışında zirveyi kap"
                desc="Hedef: 30 adet · Tamamlandı: 18 · Ödül: +250 puan"
                progress={60}
                pmetaLeft="%60 ilerleme"
                pmetaRight="+150 puan beklemede"
              />
            </section>

            <section className="card card__pad">
              <CardHead title="Yönetici Notu" inlineSub="· CSM'inden" />
              <ManagerNote
                initials="SY"
                name="Selin Yıldız"
                role="Channel Sales Manager"
                text="Mehmet, Premium SP oranında son 2 hafta gerçekten iyi ilerleme var (12/20). Ay sonuna 8 satış kaldı — Pazartesi mağaza ziyaretinde bayi vitrini düzenleme önerilerimi konuşalım. 5G challenge'da da tempon iyi, devam."
                date="📅 15 Haziran 2026 · 14:22"
              />
            </section>

            <section className="card card__pad">
              <CardHead title="Lig Akışı" inlineSub="· Mayıs 2026" />
              <div className="rowflex" style={{ flexWrap: 'wrap', gap: 8 }}>
                <Chip tone="green">✓ Veri</Chip>
                <Chip tone="green">✓ Uygunluk</Chip>
                <Chip tone="amber">● Hesaplama</Chip>
                <Chip>Bap Yayını</Chip>
                <Chip>Takip</Chip>
                <Chip>Finalizasyon</Chip>
              </div>
              <p className="text-sm text-muted" style={{ marginTop: 14, lineHeight: 1.7 }}>
                Sonraki: <b>Bap Yayını · 23 Mayıs</b>
                <br />
                Finalizasyon: 31 Mayıs 23:59
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
