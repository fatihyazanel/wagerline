'use client'

import { useState } from 'react'
import { Activity } from 'lucide-react'
import KPICard from '../KPICard'
import MatchCard from '../MatchCard'
import MatchDetail from '../MatchDetail'

const LIVE_MATCHES = [
  { id: 1, league: 'PL', home: 'Man City', away: 'Liverpool', homeScore: 2, awayScore: 1, minute: 75, status: 'live' },
  { id: 2, league: 'LA', home: 'Barcelona', away: 'Real Madrid', homeScore: 1, awayScore: 0, minute: 62, status: 'live' },
  { id: 3, league: 'SA', home: 'AC Milan', away: 'Juventus', homeScore: 2, awayScore: 1, minute: 68, status: 'live' },
  { id: 4, league: 'BUN', home: 'Dortmund', away: 'Bayern', homeScore: 1, awayScore: 0, minute: 58, status: 'live' },
  { id: 5, league: 'PL', home: 'Arsenal', away: 'Tottenham', homeScore: 2, awayScore: 2, minute: 80, status: 'live' },
  { id: 6, league: 'NBA', home: 'Lakers', away: 'Warriors', homeScore: 83, awayScore: 78, minute: 'Q3', status: 'live' },
]

const UPCOMING = [
  { time: '18:30', match: 'Dortmund vs Leipzig' },
  { time: '20:45', match: 'Inter vs Atalanta' },
  { time: '21:00', match: 'PSG vs Marseille' },
]

const TOP_SCORERS = [
  { rank: 1, name: 'Erling Haaland', team: 'Man City', goals: 27 },
  { rank: 2, name: 'Mohamed Salah', team: 'Liverpool', goals: 22 },
  { rank: 3, name: 'Harry Kane', team: 'Bayern Munich', goals: 21 },
  { rank: 4, name: 'Kylian Mbappé', team: 'Paris SG', goals: 19 },
  { rank: 5, name: 'Vinicius Jr', team: 'Real Madrid', goals: 18 },
]

export default function LivePage() {
  const [selectedMatch, setSelectedMatch] = useState(LIVE_MATCHES[0])
  const [filter, setFilter] = useState('all')

  const filters = ['All', 'Football', 'Basketball', 'Ice Hockey', 'American Football', 'Formula 1']

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black tracking-tight">Live</h1>
        <div className="flex items-center gap-1 bg-status-danger text-white px-2 py-1 rounded text-xs font-bold">
          <Activity className="w-3 h-3" />
          LIVE
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 border-b border-subtle pb-3 overflow-x-auto">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f.toLowerCase())}
            className={`text-xs font-semibold whitespace-nowrap pb-2 transition-colors ${
              filter === f.toLowerCase()
                ? 'text-brand-yellow'
                : 'text-tertiary hover:text-secondary'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Left: Live Matches */}
        <div className="col-span-2 bg-surface border border-subtle rounded-lg p-4">
          <div className="text-xs font-bold uppercase text-tertiary mb-4 pb-3 border-b border-subtle">
            Live Now ({LIVE_MATCHES.length})
          </div>
          <div className="space-y-1">
            {LIVE_MATCHES.map((match) => (
              <button
                key={match.id}
                onClick={() => setSelectedMatch(match)}
                className={`w-full text-left p-2.5 rounded transition-all border-l-2 ${
                  selectedMatch.id === match.id
                    ? 'bg-brand-yellow/10 border-l-brand-yellow'
                    : 'border-l-transparent hover:bg-white/5'
                }`}
              >
                <MatchCard match={match} />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Match Details */}
        <div className="bg-surface border border-subtle rounded-lg p-4">
          <div className="text-xs font-bold uppercase text-tertiary mb-4 pb-3 border-b border-subtle">
            Match Details
          </div>
          <MatchDetail match={selectedMatch} />
        </div>
      </div>

      {/* Upcoming Matches */}
      <div className="bg-surface border border-subtle rounded-lg p-4">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-subtle">
          <div className="text-xs font-bold uppercase text-tertiary">Upcoming Matches</div>
          <button className="text-xs text-tertiary hover:text-secondary transition-colors">View All</button>
        </div>
        <div className="space-y-2">
          {UPCOMING.map((item, idx) => (
            <div key={idx} className="grid grid-cols-2 gap-4 text-xs py-1.5 border-b border-subtle last:border-0">
              <span className="text-secondary">{item.match}</span>
              <span className="text-tertiary text-right">{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Scorers */}
      <div className="bg-surface border border-subtle rounded-lg p-4">
        <div className="text-xs font-bold uppercase text-tertiary mb-4 pb-3 border-b border-subtle">Top Scorers</div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-subtle">
              <th className="text-left py-2 text-tertiary font-bold">#</th>
              <th className="text-left py-2 text-tertiary font-bold">Player</th>
              <th className="text-left py-2 text-tertiary font-bold">Team</th>
              <th className="text-right py-2 text-tertiary font-bold">Goals</th>
            </tr>
          </thead>
          <tbody>
            {TOP_SCORERS.map((scorer) => (
              <tr key={scorer.rank} className="border-b border-subtle hover:bg-white/5">
                <td className="py-2 text-tertiary">{scorer.rank}</td>
                <td className="py-2 text-secondary">{scorer.name}</td>
                <td className="py-2 text-secondary">{scorer.team}</td>
                <td className="py-2 text-right text-brand-yellow font-bold">{scorer.goals}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
