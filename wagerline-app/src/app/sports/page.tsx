'use client'

import Footer from '@/components/Footer'
import { useState, useEffect } from 'react'
import { Trophy, Users, Activity, Zap, TrendingUp, ChevronRight, BarChart3, Percent } from 'lucide-react'

export default function Sports() {
  const [selectedSport, setSelectedSport] = useState('football')
  const [selectedCompetition, setSelectedCompetition] = useState<string | null>('premier-league')
  const [hoveredCompId, setHoveredCompId] = useState<string | null>(null)
  const [hoveredMatchId, setHoveredMatchId] = useState<number | null>(null)
  const [hoveredUpcomingId, setHoveredUpcomingId] = useState<number | null>(null)
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(2) // Default to Liverpool vs Brighton
  const [selectedMatchType, setSelectedMatchType] = useState<'recent' | 'upcoming'>('upcoming')

  const sports = [
    { id: 'football', name: 'Football', icon: Trophy },
    { id: 'basketball', name: 'Basketball', icon: Users },
    { id: 'american-football', name: 'American Football', icon: Activity },
    { id: 'ice-hockey', name: 'Ice Hockey', icon: Zap },
    { id: 'formula-1', name: 'Formula 1', icon: TrendingUp },
  ]

  const competitions = {
    football: [
      { id: 'premier-league', name: 'Premier League', logo: '/logos/PremierLeague.webp', country: 'England' },
      { id: 'la-liga', name: 'La Liga', logo: '/logos/Laliga.webp', country: 'Spain' },
      { id: 'serie-a', name: 'Serie A', logo: '/logos/SerieA.webp', country: 'Italy' },
      { id: 'bundesliga', name: 'Bundesliga', logo: '/logos/Bundesliga.webp', country: 'Germany' },
      { id: 'ligue-1', name: 'Ligue 1', logo: '/logos/Ligue1.webp', country: 'France' },
      { id: 'champions-league', name: 'Champions League', logo: '/logos/ChampionsLeague.webp', country: 'Europe' },
      { id: 'super-lig', name: 'Süper Lig', logo: '/logos/SüperLig.webp', country: 'Turkey' },
    ],
    basketball: [
      { id: 'nba', name: 'NBA', logo: '/logos/nba.webp', country: 'USA' },
    ],
    'american-football': [],
    'ice-hockey': [
      { id: 'nhl', name: 'NHL', logo: '/logos/nhl.webp', country: 'USA/Canada' },
    ],
    'formula-1': [
      { id: 'f1', name: 'Formula 1', logo: '/logos/formula.webp', country: 'World' },
    ],
  }

  const recentMatches = [
    { id: 1, home: 'Manchester City', away: 'Liverpool', score: '3-1', date: 'Sep 1', round: 'Matchday 3' },
    { id: 2, home: 'Arsenal', away: 'Chelsea', score: '2-2', date: 'Aug 31', round: 'Matchday 3' },
    { id: 3, home: 'Tottenham', away: 'Brighton', score: '2-0', date: 'Aug 30', round: 'Matchday 3' },
    { id: 4, home: 'Newcastle', away: 'Fulham', score: '1-0', date: 'Aug 29', round: 'Matchday 2' },
    { id: 5, home: 'Aston Villa', away: 'Everton', score: '2-1', date: 'Aug 28', round: 'Matchday 2' },
  ]

  const upcomingMatches = [
    { id: 1, home: 'Chelsea', away: 'Arsenal', date: 'Sep 4', time: '15:00', homeWinProb: 45, drawProb: 28, awayWinProb: 27, odds: { home: 2.45, draw: 3.20, away: 3.10 } },
    { id: 2, home: 'Liverpool', away: 'Brighton', date: 'Sep 5', time: '20:00', homeWinProb: 68, drawProb: 18, awayWinProb: 14, odds: { home: 1.65, draw: 3.80, away: 5.50 } },
    { id: 3, home: 'Man City', away: 'Newcastle', date: 'Sep 6', time: '15:00', homeWinProb: 72, drawProb: 16, awayWinProb: 12, odds: { home: 1.55, draw: 3.90, away: 6.00 } },
  ]

  const selectedMatch = upcomingMatches[1] // Liverpool vs Brighton for demo
  const selectedCompetitionData = competitions[selectedSport as keyof typeof competitions][0]

  const headToHeadStats = [
    { team: 'Liverpool', lastMatches: '3W 1D 1L', winRate: '65%', avgGoals: 2.3, leaguePos: 2, points: 12 },
    { team: 'Brighton', lastMatches: '2W 2D 1L', winRate: '48%', avgGoals: 1.8, leaguePos: 5, points: 8 },
  ]

  const matchStats = [
    { label: 'Possession', liverpool: 58, brighton: 42 },
    { label: 'Shots on Target', liverpool: 8, brighton: 4 },
    { label: 'Corners', liverpool: 7, brighton: 3 },
    { label: 'Fouls', liverpool: 12, brighton: 14 },
  ]

  const recentMatchStats: { [key: number]: { possession: number; shotsOnTarget: number; corners: number; fouls: number; passes: number; tackles: number } } = {
    1: { possession: 55, shotsOnTarget: 12, corners: 8, fouls: 10, passes: 450, tackles: 18 },
    2: { possession: 52, shotsOnTarget: 9, corners: 6, fouls: 12, passes: 420, tackles: 20 },
    3: { possession: 60, shotsOnTarget: 11, corners: 9, fouls: 8, passes: 480, tackles: 16 },
    4: { possession: 48, shotsOnTarget: 7, corners: 5, fouls: 14, passes: 380, tackles: 22 },
    5: { possession: 56, shotsOnTarget: 10, corners: 7, fouls: 11, passes: 440, tackles: 19 },
  }

  const competitionStats = [
    { label: 'Total Goals This Round', value: 28, icon: '⚽' },
    { label: 'Avg Goals per Match', value: 3.2, icon: '📊' },
    { label: 'Highest Scoring Team', value: 'Man City (6)', icon: '🔥' },
    { label: 'Clean Sheets', value: 3, icon: '🛡️' },
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050816', color: '#F7F8FC', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, borderBottom: '1px solid #263149', backgroundColor: 'rgba(5, 8, 22, 0.95)', backdropFilter: 'blur(10px)', padding: '16px 32px' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '18px', fontWeight: 900 }}>WAGER<span style={{ color: '#D4AF37' }}>line</span></div>
          <nav style={{ display: 'flex', gap: '32px', flex: 1, marginLeft: '32px' }}>
            {['Home', 'Live', 'Sports', 'Leagues', 'Predictions', 'News', 'Rewards'].map(item => (
              <a key={item} href={item === 'Home' ? '/' : `/${item.toLowerCase()}`} style={{
                fontSize: '12px', fontWeight: 600, color: item === 'Sports' ? '#D4AF37' : '#A8B0C0',
                textDecoration: 'none', cursor: 'pointer', paddingBottom: '4px',
                borderBottom: item === 'Sports' ? '2px solid #D4AF37' : 'none',
              }}>
                {item}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero Banner */}
      <div style={{
        paddingTop: '72px',
        backgroundImage: 'url(/logos/sportspage.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        borderBottom: '4px solid #D4AF37',
        position: 'relative',
        minHeight: '320px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(10, 16, 32, 0.85) 0%, rgba(5, 8, 22, 0.90) 100%)', pointerEvents: 'none', zIndex: 1 }} />

        <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '48px 32px', position: 'relative', zIndex: 10, width: '100%' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '16px' }}>
            GLOBAL SPORTS INTELLIGENCE
          </div>
          <h1 style={{ fontSize: '48px', fontWeight: 900, color: '#F7F8FC', margin: '0 0 12px 0', textShadow: '0 4px 12px rgba(0,0,0,0.8)', maxWidth: '800px' }}>
            Master Every Sport. Predict Victory.
          </h1>
          <p style={{ fontSize: '16px', color: '#A8B0C0', margin: 0, maxWidth: '600px', lineHeight: '1.6' }}>
            Real-time analytics, expert predictions, and comprehensive match intelligence across all major sports.
          </p>
        </div>

        {/* Sport Selector */}
        <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 32px 32px', position: 'relative', zIndex: 10, width: '100%' }}>
          <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
            {sports.map(sport => {
              const SportIcon = sport.icon
              return (
                <button
                  key={sport.id}
                  onClick={() => {
                    setSelectedSport(sport.id)
                    setSelectedCompetition(null)
                  }}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: selectedSport === sport.id ? '#D4AF37' : 'rgba(212, 175, 55, 0.15)',
                    color: selectedSport === sport.id ? '#050816' : '#F7F8FC',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: 600,
                    fontSize: '13px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <SportIcon style={{ width: '18px', height: '18px' }} />
                  {sport.name}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '32px' }}>
        {/* Popular Competitions */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#F7F8FC', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Trophy style={{ width: '20px', height: '20px', color: '#D4AF37' }} />
            Popular Competitions
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '16px' }}>
            {competitions[selectedSport as keyof typeof competitions].map(comp => (
              <div
                key={comp.id}
                onClick={() => setSelectedCompetition(comp.id)}
                style={{
                  backgroundColor: hoveredCompId === comp.id || selectedCompetition === comp.id ? '#111A2D' : '#0A1020',
                  border: `2px solid ${selectedCompetition === comp.id ? '#D4AF37' : hoveredCompId === comp.id ? '#D4AF37' : '#263149'}`,
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  textAlign: 'center',
                }}
                onMouseEnter={() => setHoveredCompId(comp.id)}
                onMouseLeave={() => setHoveredCompId(null)}
              >
                <img src={comp.logo} alt={comp.name} style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#F7F8FC', lineHeight: '1.3' }}>
                  {comp.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedCompetition && (
          <>
            {/* Two Column Layout: Matches List + Details Panel */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
              {/* LEFT COLUMN: Upcoming Matches + Recent Matches */}
              <div>
                {/* Upcoming Matches */}
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#F7F8FC', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Percent style={{ width: '18px', height: '18px', color: '#D4AF37' }} />
                    Upcoming Matches
                  </h3>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {upcomingMatches.map(match => (
                      <div
                        key={match.id}
                        onClick={() => {
                          setSelectedMatchId(match.id)
                          setSelectedMatchType('upcoming')
                        }}
                        style={{
                          backgroundColor: selectedMatchId === match.id && selectedMatchType === 'upcoming' ? '#111A2D' : hoveredUpcomingId === match.id ? '#111A2D' : '#0A1020',
                          border: `2px solid ${selectedMatchId === match.id && selectedMatchType === 'upcoming' ? '#D4AF37' : hoveredUpcomingId === match.id ? '#D4AF37' : '#263149'}`,
                          borderRadius: '10px',
                          padding: '16px',
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                        }}
                        onMouseEnter={() => setHoveredUpcomingId(match.id)}
                        onMouseLeave={() => setHoveredUpcomingId(null)}
                      >
                        <div style={{ fontSize: '10px', color: '#A8B0C0', marginBottom: '12px', fontWeight: 600 }}>
                          {match.date} • {match.time}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: '#F7F8FC', flex: 1 }}>
                            {match.home}
                          </div>
                          <div style={{ fontSize: '11px', color: '#A8B0C0' }}>vs</div>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: '#F7F8FC', flex: 1, textAlign: 'right' }}>
                            {match.away}
                          </div>
                        </div>

                        {/* Win Probability Bars */}
                        <div style={{ display: 'grid', gap: '8px' }}>
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                              <span style={{ fontSize: '10px', color: '#A8B0C0' }}>Win Prob</span>
                              <span style={{ fontSize: '11px', fontWeight: 700, color: '#D4AF37' }}>
                                {Math.max(match.homeWinProb, match.awayWinProb)}%
                              </span>
                            </div>
                            <div style={{ height: '4px', backgroundColor: '#263149', borderRadius: '2px', overflow: 'hidden' }}>
                              <div style={{
                                height: '100%',
                                width: `${Math.max(match.homeWinProb, match.awayWinProb)}%`,
                                backgroundColor: '#D4AF37',
                              }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Matches */}
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#F7F8FC', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BarChart3 style={{ width: '18px', height: '18px', color: '#D4AF37' }} />
                    Recent Matches
                  </h3>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {recentMatches.map(match => (
                      <div
                        key={match.id}
                        onClick={() => {
                          setSelectedMatchId(match.id)
                          setSelectedMatchType('recent')
                        }}
                        style={{
                          backgroundColor: selectedMatchId === match.id && selectedMatchType === 'recent' ? '#111A2D' : hoveredMatchId === match.id ? '#111A2D' : '#0A1020',
                          borderTop: `1px solid ${selectedMatchId === match.id && selectedMatchType === 'recent' ? '#D4AF37' : hoveredMatchId === match.id ? '#D4AF37' : '#263149'}`,
                          borderRight: `1px solid ${selectedMatchId === match.id && selectedMatchType === 'recent' ? '#D4AF37' : hoveredMatchId === match.id ? '#D4AF37' : '#263149'}`,
                          borderBottom: `1px solid ${selectedMatchId === match.id && selectedMatchType === 'recent' ? '#D4AF37' : hoveredMatchId === match.id ? '#D4AF37' : '#263149'}`,
                          borderLeft: '4px solid #D4AF37',
                          borderRadius: '10px',
                          padding: '14px',
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                        }}
                        onMouseEnter={() => setHoveredMatchId(match.id)}
                        onMouseLeave={() => setHoveredMatchId(null)}
                      >
                        <div style={{ fontSize: '10px', color: '#A8B0C0', marginBottom: '8px', fontWeight: 600 }}>
                          {match.round} • {match.date}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: '#F7F8FC', flex: 1 }}>
                            {match.home}
                          </div>
                          <div style={{ fontSize: '16px', fontWeight: 700, color: '#D4AF37', padding: '0 12px' }}>
                            {match.score}
                          </div>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: '#F7F8FC', flex: 1, textAlign: 'right' }}>
                            {match.away}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Match Details */}
              <div>
                {selectedMatchType === 'upcoming' && selectedMatchId ? (() => {
                  const match = upcomingMatches.find(m => m.id === selectedMatchId)
                  return match ? (
                    <>
                      {/* Head to Head History */}
                      <div style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#F7F8FC', marginBottom: '16px' }}>
                          Head to Head History
                        </h3>
                        <div style={{ backgroundColor: '#0A1020', border: '1px solid #263149', borderRadius: '10px', overflow: 'hidden' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                              <tr style={{ backgroundColor: '#111A2D', borderBottom: '1px solid #263149' }}>
                                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#A8B0C0', fontSize: '11px' }}>Team</th>
                                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#A8B0C0', fontSize: '11px' }}>Last 5</th>
                                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#A8B0C0', fontSize: '11px' }}>Win %</th>
                                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#A8B0C0', fontSize: '11px' }}>Avg Goals</th>
                                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#A8B0C0', fontSize: '11px' }}>League Pos</th>
                                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#D4AF37', fontSize: '11px' }}>Pts</th>
                              </tr>
                            </thead>
                            <tbody>
                              {headToHeadStats.map((stat, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #263149', backgroundColor: idx % 2 === 0 ? 'rgba(212, 175, 55, 0.02)' : 'transparent' }}>
                                  <td style={{ padding: '12px', color: '#F7F8FC', fontWeight: 600, fontSize: '12px' }}>{stat.team}</td>
                                  <td style={{ padding: '12px', textAlign: 'center', color: '#A8B0C0', fontSize: '11px' }}>{stat.lastMatches}</td>
                                  <td style={{ padding: '12px', textAlign: 'center', color: '#34A853', fontWeight: 600, fontSize: '12px' }}>{stat.winRate}</td>
                                  <td style={{ padding: '12px', textAlign: 'center', color: '#FFD400', fontWeight: 600, fontSize: '12px' }}>{stat.avgGoals}</td>
                                  <td style={{ padding: '12px', textAlign: 'center', color: '#D4AF37', fontWeight: 600, fontSize: '12px' }}>{stat.leaguePos}</td>
                                  <td style={{ padding: '12px', textAlign: 'center', color: '#D4AF37', fontWeight: 700, fontSize: '12px' }}>{stat.points}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* High Win Probability */}
                      <div style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#F7F8FC', marginBottom: '16px' }}>
                          High Win Probability
                        </h3>
                        <div style={{ display: 'grid', gap: '12px' }}>
                          {/* Home Win */}
                          <div style={{ backgroundColor: '#0A1020', border: '1px solid #263149', borderRadius: '10px', padding: '14px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                              <span style={{ fontSize: '12px', fontWeight: 600, color: '#F7F8FC' }}>{match.home} Win</span>
                              <span style={{ fontSize: '14px', fontWeight: 700, color: match.homeWinProb > 60 ? '#34A853' : '#D4AF37' }}>
                                {match.homeWinProb}%
                              </span>
                            </div>
                            <div style={{ height: '8px', backgroundColor: '#263149', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{
                                height: '100%',
                                width: `${match.homeWinProb}%`,
                                backgroundColor: match.homeWinProb > 60 ? '#34A853' : '#D4AF37',
                                transition: 'width 0.3s'
                              }} />
                            </div>
                          </div>

                          {/* Draw */}
                          <div style={{ backgroundColor: '#0A1020', border: '1px solid #263149', borderRadius: '10px', padding: '14px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                              <span style={{ fontSize: '12px', fontWeight: 600, color: '#F7F8FC' }}>Draw</span>
                              <span style={{ fontSize: '14px', fontWeight: 700, color: '#FFD400' }}>
                                {match.drawProb}%
                              </span>
                            </div>
                            <div style={{ height: '8px', backgroundColor: '#263149', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{
                                height: '100%',
                                width: `${match.drawProb}%`,
                                backgroundColor: '#FFD400',
                                transition: 'width 0.3s'
                              }} />
                            </div>
                          </div>

                          {/* Away Win */}
                          <div style={{ backgroundColor: '#0A1020', border: '1px solid #263149', borderRadius: '10px', padding: '14px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                              <span style={{ fontSize: '12px', fontWeight: 600, color: '#F7F8FC' }}>{match.away} Win</span>
                              <span style={{ fontSize: '14px', fontWeight: 700, color: '#EF4444' }}>
                                {match.awayWinProb}%
                              </span>
                            </div>
                            <div style={{ height: '8px', backgroundColor: '#263149', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{
                                height: '100%',
                                width: `${match.awayWinProb}%`,
                                backgroundColor: '#EF4444',
                                transition: 'width 0.3s'
                              }} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Match Statistics (Predicted) */}
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#F7F8FC', marginBottom: '16px' }}>
                          Match Statistics (Predicted)
                        </h3>
                        <div style={{ display: 'grid', gap: '14px' }}>
                          {matchStats.map((stat, idx) => (
                            <div key={idx} style={{ backgroundColor: '#0A1020', border: '1px solid #263149', borderRadius: '10px', padding: '12px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <span style={{ fontSize: '12px', fontWeight: 600, color: '#F7F8FC' }}>{stat.label}</span>
                                <div style={{ display: 'flex', gap: '16px', fontSize: '11px', fontWeight: 700 }}>
                                  <span style={{ color: '#D4AF37' }}>{stat.liverpool}</span>
                                  <span style={{ color: '#A8B0C0' }}>-</span>
                                  <span style={{ color: '#34A853' }}>{stat.brighton}</span>
                                </div>
                              </div>
                              <div style={{ display: 'flex', gap: '8px', height: '8px' }}>
                                <div style={{
                                  flex: stat.liverpool,
                                  backgroundColor: '#D4AF37',
                                  borderRadius: '4px'
                                }} />
                                <div style={{
                                  flex: stat.brighton,
                                  backgroundColor: '#34A853',
                                  borderRadius: '4px'
                                }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : null
                })() : selectedMatchType === 'recent' && selectedMatchId ? (() => {
                  const match = recentMatches.find(m => m.id === selectedMatchId)
                  const stats = recentMatchStats[selectedMatchId]
                  return match && stats ? (
                    <div>
                      {/* Match Summary */}
                      <div style={{ marginBottom: '24px', backgroundColor: '#0A1020', border: '1px solid #263149', borderRadius: '10px', padding: '16px' }}>
                        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                          <div style={{ fontSize: '12px', color: '#A8B0C0', marginBottom: '8px', fontWeight: 600 }}>
                            {match.round} • {match.date}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
                            <div style={{ fontSize: '14px', fontWeight: 600, color: '#F7F8FC' }}>{match.home}</div>
                            <div style={{ fontSize: '28px', fontWeight: 700, color: '#D4AF37' }}>{match.score}</div>
                            <div style={{ fontSize: '14px', fontWeight: 600, color: '#F7F8FC' }}>{match.away}</div>
                          </div>
                        </div>
                      </div>

                      {/* Match Statistics */}
                      <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#F7F8FC', marginBottom: '12px' }}>
                        Match Statistics
                      </h3>
                      <div style={{ display: 'grid', gap: '12px' }}>
                        {/* Possession */}
                        <div style={{ backgroundColor: '#0A1020', border: '1px solid #263149', borderRadius: '10px', padding: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#F7F8FC' }}>Possession</span>
                            <div style={{ display: 'flex', gap: '12px', fontSize: '11px', fontWeight: 700 }}>
                              <span style={{ color: '#D4AF37' }}>{stats.possession}%</span>
                              <span style={{ color: '#A8B0C0' }}>-</span>
                              <span style={{ color: '#34A853' }}>{100 - stats.possession}%</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '4px', height: '8px' }}>
                            <div style={{
                              flex: stats.possession,
                              backgroundColor: '#D4AF37',
                              borderRadius: '4px'
                            }} />
                            <div style={{
                              flex: 100 - stats.possession,
                              backgroundColor: '#34A853',
                              borderRadius: '4px'
                            }} />
                          </div>
                        </div>

                        {/* Shots on Target */}
                        <div style={{ backgroundColor: '#0A1020', border: '1px solid #263149', borderRadius: '10px', padding: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#F7F8FC' }}>Shots on Target</span>
                            <div style={{ display: 'flex', gap: '16px', fontSize: '11px', fontWeight: 700 }}>
                              <span style={{ color: '#D4AF37' }}>{Math.ceil(stats.shotsOnTarget * 0.6)}</span>
                              <span style={{ color: '#A8B0C0' }}>-</span>
                              <span style={{ color: '#34A853' }}>{Math.floor(stats.shotsOnTarget * 0.4)}</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '4px', height: '8px' }}>
                            <div style={{
                              flex: Math.ceil(stats.shotsOnTarget * 0.6),
                              backgroundColor: '#D4AF37',
                              borderRadius: '4px'
                            }} />
                            <div style={{
                              flex: Math.floor(stats.shotsOnTarget * 0.4),
                              backgroundColor: '#34A853',
                              borderRadius: '4px'
                            }} />
                          </div>
                        </div>

                        {/* Corners */}
                        <div style={{ backgroundColor: '#0A1020', border: '1px solid #263149', borderRadius: '10px', padding: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#F7F8FC' }}>Corners</span>
                            <div style={{ display: 'flex', gap: '16px', fontSize: '11px', fontWeight: 700 }}>
                              <span style={{ color: '#D4AF37' }}>{Math.ceil(stats.corners * 0.6)}</span>
                              <span style={{ color: '#A8B0C0' }}>-</span>
                              <span style={{ color: '#34A853' }}>{Math.floor(stats.corners * 0.4)}</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '4px', height: '8px' }}>
                            <div style={{
                              flex: Math.ceil(stats.corners * 0.6),
                              backgroundColor: '#D4AF37',
                              borderRadius: '4px'
                            }} />
                            <div style={{
                              flex: Math.floor(stats.corners * 0.4),
                              backgroundColor: '#34A853',
                              borderRadius: '4px'
                            }} />
                          </div>
                        </div>

                        {/* Fouls */}
                        <div style={{ backgroundColor: '#0A1020', border: '1px solid #263149', borderRadius: '10px', padding: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#F7F8FC' }}>Fouls</span>
                            <div style={{ display: 'flex', gap: '16px', fontSize: '11px', fontWeight: 700 }}>
                              <span style={{ color: '#D4AF37' }}>{Math.ceil(stats.fouls * 0.48)}</span>
                              <span style={{ color: '#A8B0C0' }}>-</span>
                              <span style={{ color: '#34A853' }}>{Math.floor(stats.fouls * 0.52)}</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '4px', height: '8px' }}>
                            <div style={{
                              flex: Math.ceil(stats.fouls * 0.48),
                              backgroundColor: '#D4AF37',
                              borderRadius: '4px'
                            }} />
                            <div style={{
                              flex: Math.floor(stats.fouls * 0.52),
                              backgroundColor: '#34A853',
                              borderRadius: '4px'
                            }} />
                          </div>
                        </div>

                        {/* Passes */}
                        <div style={{ backgroundColor: '#0A1020', border: '1px solid #263149', borderRadius: '10px', padding: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#F7F8FC' }}>Passes</span>
                            <div style={{ display: 'flex', gap: '16px', fontSize: '11px', fontWeight: 700 }}>
                              <span style={{ color: '#D4AF37' }}>{Math.ceil(stats.passes * 0.55)}</span>
                              <span style={{ color: '#A8B0C0' }}>-</span>
                              <span style={{ color: '#34A853' }}>{Math.floor(stats.passes * 0.45)}</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '4px', height: '8px' }}>
                            <div style={{
                              flex: Math.ceil(stats.passes * 0.55),
                              backgroundColor: '#D4AF37',
                              borderRadius: '4px'
                            }} />
                            <div style={{
                              flex: Math.floor(stats.passes * 0.45),
                              backgroundColor: '#34A853',
                              borderRadius: '4px'
                            }} />
                          </div>
                        </div>

                        {/* Tackles */}
                        <div style={{ backgroundColor: '#0A1020', border: '1px solid #263149', borderRadius: '10px', padding: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#F7F8FC' }}>Tackles</span>
                            <div style={{ display: 'flex', gap: '16px', fontSize: '11px', fontWeight: 700 }}>
                              <span style={{ color: '#D4AF37' }}>{Math.ceil(stats.tackles * 0.47)}</span>
                              <span style={{ color: '#A8B0C0' }}>-</span>
                              <span style={{ color: '#34A853' }}>{Math.floor(stats.tackles * 0.53)}</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '4px', height: '8px' }}>
                            <div style={{
                              flex: Math.ceil(stats.tackles * 0.47),
                              backgroundColor: '#D4AF37',
                              borderRadius: '4px'
                            }} />
                            <div style={{
                              flex: Math.floor(stats.tackles * 0.53),
                              backgroundColor: '#34A853',
                              borderRadius: '4px'
                            }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null
                })() : (
                  <div style={{ backgroundColor: '#0A1020', border: '1px solid #263149', borderRadius: '10px', padding: '32px', textAlign: 'center' }}>
                    <p style={{ color: '#A8B0C0', fontSize: '14px', margin: 0 }}>
                      Maç seçin detayları görmek için
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Competition Statistics & Analysis - Only shows when Upcoming Match selected */}
            {selectedMatchType === 'upcoming' && selectedMatchId && (() => {
              const match = upcomingMatches.find(m => m.id === selectedMatchId)
              return match ? (
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#F7F8FC', marginBottom: '16px' }}>
                    Competition Statistics & Predictions
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                    {competitionStats.map((stat, idx) => (
                      <div key={idx} style={{
                        backgroundColor: '#0A1020',
                        border: '1px solid #263149',
                        borderRadius: '10px',
                        padding: '16px',
                        borderTop: `3px solid ${['#D4AF37', '#34A853', '#EF4444', '#38BDF8'][idx]}`
                      }}>
                        <div style={{ fontSize: '11px', color: '#A8B0C0', marginBottom: '8px' }}>
                          {stat.label}
                        </div>
                        <div style={{ fontSize: '28px', fontWeight: 700, color: '#D4AF37', marginBottom: '4px' }}>
                          {stat.value}
                        </div>
                        <div style={{ fontSize: '10px', color: '#A8B0C0' }}>
                          Current Round Average
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Analysis Commentary */}
                  <div style={{ backgroundColor: '#0A1020', border: '1px solid #263149', borderRadius: '10px', padding: '20px', borderLeft: '4px solid #D4AF37' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#F7F8FC', margin: '0 0 12px 0' }}>
                      Match Analysis & Predictions
                    </h4>
                    <div style={{ fontSize: '13px', lineHeight: '1.7', color: '#A8B0C0' }}>
                      <p style={{ margin: '0 0 12px 0' }}>
                        <strong style={{ color: '#D4AF37' }}>{match.home} ({match.homeWinProb}% Win Probability)</strong> - The home team enters this fixture in exceptional form with strong recent performance. Playing at home provides additional advantage. They've averaged solid goals per match and sit in a competitive league position.
                      </p>
                      <p style={{ margin: '0 0 12px 0' }}>
                        <strong style={{ color: '#34A853' }}>{match.away} ({match.awayWinProb}% Win Probability)</strong> - The away team faces a challenging contest but remains competitive. Current form suggests they will be competitive throughout the match. Their league position indicates quality opposition.
                      </p>
                      <p style={{ margin: 0 }}>
                        <strong style={{ color: '#FFD400' }}>Recommendation:</strong> Analyze the win probabilities and recent team form before making your prediction. Home advantage typically provides a boost, but the away team's defensive strength should be considered.
                      </p>
                    </div>
                  </div>
                </div>
              ) : null
            })()}
          </>
        )}
      </div>

      <Footer />
    </div>
  )
}
