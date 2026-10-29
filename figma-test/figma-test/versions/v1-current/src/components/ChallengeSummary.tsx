import { Star, Gift, ArrowRight } from 'lucide-react'

export default function ChallengeSummary() {
  return (
    <section className="card challenge">
      <div className="card__title">
        <Star size={20} color="#4f39f6" />
        Meydan Okuma Özeti
      </div>

      <div className="challenge__stats">
        <div>
          <div className="stat__label">Toplam Meydan Okuma</div>
          <div className="stat__value">72</div>
        </div>
        <div>
          <div className="stat__label">Katılım Oranı</div>
          <div className="stat__value">%68</div>
        </div>
      </div>

      <div className="challenge__highlight">
        <div className="challenge__eyebrow">En Başarılı Meydan Okuma</div>
        <div className="challenge__name">Marmara Bölge Şampiyonu Challenge</div>
        <div className="challenge__metarow">
          <span className="challenge__points">
            <Gift size={14} />
            1.250 Ek Puan
          </span>
          <span className="challenge__done">12 Bayi Tamamladı</span>
        </div>
      </div>

      <hr className="card__sep" />
      <div className="card__foot">
        <a className="linkbtn" href="#">
          Tüm meydan okumaları gör
          <ArrowRight size={14} />
        </a>
      </div>
    </section>
  )
}
