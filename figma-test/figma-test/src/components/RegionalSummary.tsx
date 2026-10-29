import { Trophy, FileText, TrendingUp, ArrowRight } from 'lucide-react'
import { regionRows } from '../data'
import TurkeyMap from './TurkeyMap'

export default function RegionalSummary() {
  return (
    <section className="card region">
      <div className="card__head">
        <div>
          <div className="card__title">
            <Trophy size={20} color="#4f39f6" />
            Bölgesel Özet
          </div>
          <p className="card__subtitle">
            Bayilerin toplam puanlarına bayilere göre kırılımı
          </p>
        </div>
        <button className="report-btn">
          <FileText size={14} />
          Rapor Al (XLSX)
        </button>
      </div>

      <div className="region__body">
        <TurkeyMap />

        <table className="table" style={{ marginTop: 0 }}>
          <thead>
            <tr>
              <th>BÖLGE</th>
              <th className="num">Ort. PUAN</th>
              <th className="num">DEĞİŞİM</th>
            </tr>
          </thead>
          <tbody>
            {regionRows.map((row) => (
              <tr key={row.region}>
                <td className="cell-strong">{row.region}</td>
                <td className="num cell-strong">{row.score}</td>
                <td className="num">
                  <span className="trend">
                    <TrendingUp size={14} />
                    {row.change}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="card__sep" />
      <div className="card__foot">
        <a className="linkbtn" href="#">
          Bölge detaylarını gör
          <ArrowRight size={14} />
        </a>
      </div>
    </section>
  )
}
