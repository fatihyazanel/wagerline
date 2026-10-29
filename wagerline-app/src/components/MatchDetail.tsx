interface MatchDetailProps {
  match: {
    league: string
    home: string
    away: string
    homeScore: number
    awayScore: number
    minute: string | number
  }
}

export default function MatchDetail({ match }: MatchDetailProps) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="pb-3 border-b border-subtle">
        <div className="text-xs text-tertiary mb-2">{match.league} · Round 36</div>
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-semibold">{match.home}</div>
          <div className="text-2xl font-black text-brand-yellow">{match.homeScore}</div>
          <div className="text-xs font-semibold text-right">{match.away}</div>
        </div>
        <div className="flex items-center justify-between">
          <div></div>
          <div className="text-2xl font-black text-brand-yellow">{match.awayScore}</div>
          <div></div>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 text-xs">
        <span className="w-2 h-2 bg-status-success rounded-full animate-pulse"></span>
        <span className="text-status-success font-bold">LIVE</span>
        <span className="text-tertiary">{match.minute}'</span>
      </div>

      {/* Stats */}
      <div className="space-y-2">
        <div>
          <div className="text-xs text-tertiary mb-1">Possession</div>
          <div className="h-1 bg-surface-light rounded overflow-hidden mb-1">
            <div className="h-full w-7/12 bg-brand-yellow rounded"></div>
          </div>
          <div className="text-xs text-secondary font-bold">58% / 42%</div>
        </div>

        <div className="pt-2">
          <div className="text-xs text-secondary font-bold">Shots: 15 / 7</div>
          <div className="text-xs text-secondary font-bold mt-1">On Target: 6 / 3</div>
        </div>
      </div>
    </div>
  )
}
