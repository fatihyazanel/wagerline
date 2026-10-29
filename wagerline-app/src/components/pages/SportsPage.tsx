'use client'

import { ArrowRight } from 'lucide-react'

const SPORTS = [
  { icon: '⚽', name: 'Football', count: '1,247' },
  { icon: '🏀', name: 'Basketball', count: '312' },
  { icon: '🏈', name: 'American Football', count: '120' },
  { icon: '🏒', name: 'Ice Hockey', count: '108' },
  { icon: '🏎️', name: 'Formula 1', count: '23' },
]

const COMPETITIONS = [
  'Premier League', 'La Liga', 'Serie A', 'Bundesliga',
  'Ligue 1', 'NBA', 'NFL', 'NHL',
  'Champions League', 'World Cup', 'Super Lig', 'Formula 1'
]

const TRENDING = [
  { rank: 1, match: 'Man City 2–1 Liverpool', trend: '▲' },
  { rank: 2, match: 'Barcelona 1–0 Madrid', trend: '▲' },
  { rank: 3, match: 'Lakers 83–78 Warriors', trend: '▼' },
  { rank: 4, match: 'Maple Leafs 3–2 Habs', trend: '▲' },
]

const TOP_PLAYERS = [
  { name: 'Erling Haaland', team: 'Man City', goals: '27' },
  { name: 'Mohamed Salah', team: 'Liverpool', goals: '22' },
  { name: 'Harry Kane', team: 'Bayern', goals: '21' },
]

export default function SportsPage() {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-br from-brand-yellow/10 to-status-info/5 border border-subtle rounded-lg p-12 min-h-80 flex flex-col justify-center">
        <h1 className="text-4xl font-black tracking-tight mb-4 max-w-2xl leading-tight">
          ALL SPORTS.<br />ALL INTELLIGENCE.<br />
          <span className="text-brand-yellow">ONE PLATFORM.</span>
        </h1>
        <p className="text-sm text-secondary mb-6 max-w-xl">
          Live scores, stats, AI predictions and everything you need to stay ahead.
        </p>
        <div className="flex gap-3 w-fit">
          <button className="bg-brand-yellow text-dark-bg px-4 py-2 rounded text-xs font-bold hover:bg-brand-yellow-dark transition-colors">
            Explore All Sports
          </button>
          <button className="border border-subtle text-secondary px-4 py-2 rounded text-xs font-bold hover:border-light transition-colors">
            Learn More
          </button>
        </div>
      </div>

      {/* Sports Grid */}
      <div>
        <h2 className="text-lg font-bold mb-4">Sports</h2>
        <div className="grid grid-cols-5 gap-4">
          {SPORTS.map((sport) => (
            <div
              key={sport.name}
              className="bg-gradient-to-br from-surface-light to-surface border border-subtle rounded-lg p-4 text-center hover:border-brand-yellow transition-colors cursor-pointer"
            >
              <div className="text-3xl mb-2">{sport.icon}</div>
              <div className="text-xs font-bold mb-1">{sport.name}</div>
              <div className="text-xs text-tertiary">{sport.count} Competitions</div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Competitions */}
      <div className="bg-surface border border-subtle rounded-lg p-4">
        <div className="text-xs font-bold uppercase text-tertiary mb-4 pb-3 border-b border-subtle">
          Popular Competitions
        </div>
        <div className="grid grid-cols-4 gap-2">
          {COMPETITIONS.map((comp) => (
            <button
              key={comp}
              className="bg-surface-light border border-subtle rounded px-3 py-2 text-xs font-bold hover:border-brand-yellow hover:text-brand-yellow transition-colors"
            >
              {comp}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Trending Teams */}
        <div className="bg-surface border border-subtle rounded-lg p-4">
          <div className="text-xs font-bold uppercase text-tertiary mb-4 pb-3 border-b border-subtle">
            Trending Teams
          </div>
          <div className="space-y-2">
            {TRENDING.map((item) => (
              <div key={item.rank} className="flex justify-between items-center text-xs py-1.5 border-b border-subtle last:border-0">
                <span className="text-secondary">{item.rank}. {item.match}</span>
                <span className={item.trend === '▲' ? 'text-status-success' : 'text-status-danger'}>
                  {item.trend}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Players */}
        <div className="bg-surface border border-subtle rounded-lg p-4">
          <div className="text-xs font-bold uppercase text-tertiary mb-4 pb-3 border-b border-subtle">
            Top Players
          </div>
          <div className="space-y-3">
            {TOP_PLAYERS.map((player) => (
              <div key={player.name} className="py-1.5 border-b border-subtle last:border-0">
                <div className="text-xs font-bold text-primary">{player.name}</div>
                <div className="text-xs text-tertiary">{player.team} · {player.goals} Goals</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
