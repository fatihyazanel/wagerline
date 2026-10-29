import FilterBar from '../components/FilterBar'
import KpiCards from '../components/KpiCards'
import LeagueDistribution from '../components/LeagueDistribution'
import ChallengeSummary from '../components/ChallengeSummary'
import AiAnalysis from '../components/AiAnalysis'
import RegionalSummary from '../components/RegionalSummary'

// The "Genel Sayfa" / Türkiye Özeti dashboard — the original design, kept intact.
export default function PublicOverview() {
  return (
    <div className="screen">
      <FilterBar />
      <KpiCards />

      <div className="mid-grid">
        <LeagueDistribution />
        <div className="right-col">
          <ChallengeSummary />
          <AiAnalysis />
        </div>
      </div>

      <RegionalSummary />
    </div>
  )
}
