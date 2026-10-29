import { Trophy, Gem, Award, Medal, Shield, ArrowRight } from 'lucide-react'
import { leagues, leagueRows, leagueAccents, type League } from '../data'

const leagueIcon = (name: League['icon'], color: string) => {
  const props = { size: 22, color }
  switch (name) {
    case 'gem':
      return <Gem {...props} />
    case 'award':
      return <Award {...props} />
    case 'medal':
      return <Medal {...props} />
    case 'shield':
      return <Shield {...props} />
  }
}

export default function LeagueDistribution() {
  return (
    <section className="card leaguewrap">
      <div className="card__head">
        <div>
          <div className="card__title">
            <Trophy size={20} color="#e17100" />
            Lig &amp; Segment Dağılımları
          </div>
          <p className="card__subtitle">
            Bayilerin toplam puanlarına göre yerleştiği rekabet seviyeleri.
          </p>
        </div>
        <span className="pill" style={{ gap: 6 }}>
          <Trophy size={12} />
          Marmara Platin 1
        </span>
      </div>

      <div className="leagues">
        {leagues.map((lg) => {
          const accent = leagueAccents[lg.key]
          return (
            <div
              key={lg.name}
              className="league"
              style={{
                background: `var(--${lg.key}-bg)`,
                borderColor: `var(--${lg.key}-bd)`,
              }}
            >
              <div className="league__icon" style={{ background: `${accent}1f` }}>
                {leagueIcon(lg.icon, accent)}
              </div>
              <div className="league__name">{lg.name}</div>
              <div className="league__count">{lg.count}</div>
              <div className="league__score" style={{ color: accent }}>
                {lg.score}
              </div>
            </div>
          )
        })}
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Lig Segmenti</th>
            <th className="num">Bayi Sayısı</th>
            <th className="num">Hedef Ort.</th>
            <th className="num">Güncel Ort.</th>
            <th>En Başarılı Bayi</th>
          </tr>
        </thead>
        <tbody>
          {leagueRows.map((row, i) => (
            <tr key={i}>
              <td>
                <span className="dotname">
                  <span className="dot" style={{ background: leagueAccents[row.key] }} />
                  {row.league}
                </span>
              </td>
              <td className="num">{row.count}</td>
              <td className="num">{row.target}</td>
              <td className="num cell-strong">{row.current}</td>
              <td>{row.topDealer}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="card__foot">
        <a className="linkbtn" href="#">
          Tüm ligleri Gör
          <ArrowRight size={14} />
        </a>
      </div>
    </section>
  )
}
