import {
  Trophy,
  Radio,
  Globe,
  Sprout,
  Gem,
  Rocket,
  Star,
  Flame,
} from 'lucide-react'
import { CardHead, StatCard, BadgeCard } from '../components/ui'

export default function DealerBadges() {
  return (
    <div className="screen">
      <div className="stack">
        <div className="grid-3">
          <StatCard
            label="Sahip olduğum"
            value={
              <>
                4 <small>/ 8</small>
              </>
            }
            sub="+1 bu ay kazanıldı"
          />
          <StatCard label="Toplam çarpan" value="×1.23" sub="Final puana uygulanan" />
          <StatCard label="En yakın rozet" value="Premium SP" sub="12/20 · %60 tamam" />
        </div>

        <section className="card card__pad">
          <CardHead
            title="Kazanılan Rozetler"
            inlineSub="· Final puanına çarpan olarak uygulanır"
          />
          <div className="badge-grid">
            <BadgeCard icon={<Trophy size={24} />} medal="amber" name="Segmentasyon Üstü" desc="Mart 2026" mult="×1.10" />
            <BadgeCard icon={<Radio size={24} />} medal="blue" name="5G Öncüsü" desc="Şubat 2026" mult="×1.08" />
            <BadgeCard icon={<Globe size={24} />} medal="bronz" name="Fiber Ustası" desc="Nisan 2026" mult="×1.05" />
            <BadgeCard icon={<Sprout size={24} />} medal="green" name="Yükselen Bayi" desc="Mayıs 2026" mult="×1.03" />
          </div>
        </section>

        <section className="card card__pad">
          <CardHead title="Kazanılabilir Rozetler" inlineSub="· Aktif ay kuralları" />
          <div className="badge-grid">
            <BadgeCard icon={<Gem size={24} />} medal="purple" name="Premium SP" desc="SP oranı %20+" lock="12/20" locked />
            <BadgeCard icon={<Rocket size={24} />} medal="green" name="Hızlı Yükselen" desc="Kulvarda yukarı çık" lock="%65" locked />
            <BadgeCard icon={<Star size={24} />} medal="brand" name="Komuta Rozeti" desc="3 ay üst üste Top 10" lock="2/3" locked />
            <BadgeCard icon={<Flame size={24} />} medal="bronz" name="Streak Avcısı" desc="30 gün aktivite" lock="14/30" locked />
          </div>
        </section>
      </div>
    </div>
  )
}
