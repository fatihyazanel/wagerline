interface MatchCardProps {
  match: {
    league: string
    home: string
    away: string
    homeScore: number
    awayScore: number
    minute: string | number
  }
}

export default function MatchCard({ match }: MatchCardProps) {
  return (
    <div className="grid grid-cols-4 gap-3 items-center">
      {/* League */}
      <div className="text-xs font-bold uppercase text-tertiary">{match.league}</div>

      {/* Teams and Score */}
      <div className="col-span-2 flex justify-between items-center gap-2">
        <span className="text-xs font-semibold truncate">{match.home}</span>
        <span className="text-sm font-black text-brand-yellow flex-shrink-0">
          {match.homeScore} - {match.awayScore}
        </span>
        <span className="text-xs font-semibold truncate text-right">{match.away}</span>
      </div>

      {/* Time/Minute */}
      <div className="text-xs text-tertiary text-right">{match.minute}'</div>
    </div>
  )
}
