'use client'

import Footer from '@/components/Footer'
import { Zap, Trophy, Users, TrendingUp, BarChart3, Users2 } from 'lucide-react'
import { useState } from 'react'

export default function Live() {
  const [selectedMatch, setSelectedMatch] = useState(0)
  const [activeSport, setActiveSport] = useState('All Sports')
  const [activeLeague, setActiveLeague] = useState('All Leagues')
  const [activeTab, setActiveTab] = useState('Timeline')

  const filters = ['All Sports', 'Football', 'Basketball', 'American Football', 'Hockey', 'Formula 1']
  const leagues = ['All Leagues', 'Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1']

  const liveMatches = [
    {
      league: 'Premier League',
      home: 'Manchester City',
      away: 'Liverpool',
      score: '2-1',
      time: '75:35',
      events: 3,
      performers: [
        { name: 'Erling Haaland', team: 'Manchester City', goals: 2, assists: 0, rating: 8.9 },
        { name: 'Mohamed Salah', team: 'Liverpool', goals: 1, assists: 0, rating: 7.8 },
      ],
      timeline: [
        { minute: '12\'', event: 'Goal', player: 'Erling Haaland', team: 'Manchester City' },
        { minute: '34\'', event: 'Yellow Card', player: 'Kyle Walker', team: 'Manchester City' },
        { minute: '45\'', event: 'Goal', player: 'Mohamed Salah', team: 'Liverpool' },
        { minute: '67\'', event: 'Goal', player: 'Erling Haaland', team: 'Manchester City' },
      ],
      stats: {
        homeShots: 18,
        awayShots: 9,
        homePossession: 65,
        awayPossession: 35,
        homeCorners: 7,
        awayCorners: 3,
      },
      lineups: {
        home: ['Ederson', 'Walker', 'Akanji', 'Dias', 'Cancelo', 'De Bruyne', 'Rodri', 'Gundogan', 'Foden', 'Haaland', 'Alvarez'],
        away: ['Alisson', 'Alexander-Arnold', 'Van Dijk', 'Matip', 'Robertson', 'Henderson', 'Thiago', 'Fabinho', 'Salah', 'Díaz', 'Jota'],
      },
      h2h: [
        { date: '2025-08-15', result: 'Draw 2-2', competition: 'Premier League' },
        { date: '2025-05-10', result: 'Man City 1-0', competition: 'Premier League' },
        { date: '2025-02-01', result: 'Liverpool 1-1', competition: 'Premier League' },
      ],
    },
    {
      league: 'La Liga',
      home: 'Real Madrid',
      away: 'Valencia',
      score: '3-1',
      time: '60:12',
      events: 2,
      performers: [
        { name: 'Kylian Mbappé', team: 'Real Madrid', goals: 2, assists: 0, rating: 8.7 },
        { name: 'Vinícius Jr', team: 'Real Madrid', goals: 1, assists: 1, rating: 8.5 },
      ],
      timeline: [
        { minute: '8\'', event: 'Goal', player: 'Kylian Mbappé', team: 'Real Madrid' },
        { minute: '22\'', event: 'Goal', player: 'Vinícius Jr', team: 'Real Madrid' },
        { minute: '38\'', event: 'Goal', player: 'Kylian Mbappé', team: 'Real Madrid' },
      ],
      stats: { homeShots: 16, awayShots: 6, homePossession: 68, awayPossession: 32, homeCorners: 5, awayCorners: 2 },
      lineups: {
        home: ['Courtois', 'Carvajal', 'Nacho', 'Alaba', 'Mendy', 'Modrić', 'Camavinga', 'Bellingham', 'Vinicius', 'Mbappé', 'Rodrygo'],
        away: ['Stole', 'Correia', 'Yakobi', 'Paulista', 'Foulquier', 'Guillamón', 'Moreno', 'Soro', 'Castillejo', 'Cavani', 'Ferràn'],
      },
      h2h: [
        { date: '2025-08-22', result: 'Real Madrid 2-0', competition: 'La Liga' },
        { date: '2025-03-15', result: 'Valencia 1-1', competition: 'La Liga' },
      ],
    },
    {
      league: 'Serie A',
      home: 'Inter',
      away: 'Juventus',
      score: '1-0',
      time: '45:00',
      events: 1,
      performers: [
        { name: 'Lautaro Martinez', team: 'Inter', goals: 1, assists: 0, rating: 8.3 },
        { name: 'Federico Chiesa', team: 'Juventus', goals: 0, assists: 0, rating: 7.6 },
      ],
      timeline: [
        { minute: '23\'', event: 'Goal', player: 'Lautaro Martinez', team: 'Inter' },
      ],
      stats: { homeShots: 12, awayShots: 5, homePossession: 62, awayPossession: 38, homeCorners: 4, awayCorners: 1 },
      lineups: {
        home: ['Handanović', 'Skriniar', 'Acerbi', 'Bastoni', 'Darmian', 'Barella', 'Brozović', 'Mkhitaryan', 'Dimarco', 'Martínez', 'Lautaro'],
        away: ['Szczesny', 'Danilo', 'Bremer', 'Gatti', 'Alex Sandro', 'Locatelli', 'Fagioli', 'Cuadrado', 'Chiesa', 'Vlahović', 'Yildiz'],
      },
      h2h: [
        { date: '2025-09-01', result: 'Juventus 0-0', competition: 'Serie A' },
      ],
    },
    {
      league: 'Bundesliga',
      home: 'Bayern Munich',
      away: 'Dortmund',
      score: '2-0',
      time: '30:45',
      events: 2,
      performers: [
        { name: 'Serge Gnabry', team: 'Bayern Munich', goals: 1, assists: 1, rating: 8.4 },
        { name: 'Marco Reus', team: 'Dortmund', goals: 0, assists: 0, rating: 7.9 },
      ],
      timeline: [
        { minute: '15\'', event: 'Goal', player: 'Leroy Sané', team: 'Bayern Munich' },
        { minute: '28\'', event: 'Goal', player: 'Serge Gnabry', team: 'Bayern Munich' },
      ],
      stats: { homeShots: 14, awayShots: 4, homePossession: 71, awayPossession: 29, homeCorners: 6, awayCorners: 1 },
      lineups: {
        home: ['Neuer', 'Pavard', 'de Ligt', 'Upamecano', 'Davies', 'Kimmich', 'Laimer', 'Sane', 'Müller', 'Gnabry', 'Serge'],
        away: ['Kobel', 'Wolf', 'Hummels', 'Akanji', 'Ozcan', 'Emre Can', 'Bruma', 'Reyna', 'Reus', 'Fullkrug', 'Gittens'],
      },
      h2h: [
        { date: '2025-08-10', result: 'Bayern 3-1', competition: 'Bundesliga' },
      ],
    },
  ]

  const upcomingMatches = [
    { league: 'Premier League', match: 'Chelsea vs Arsenal', time: 'Today 20:00', odds: { home: 2.10, draw: 3.40, away: 3.50 } },
    { league: 'La Liga', match: 'Barcelona vs Atletico', time: 'Tomorrow 18:30', odds: { home: 1.95, draw: 3.20, away: 4.10 } },
    { league: 'Serie A', match: 'Milan vs Roma', time: 'Tomorrow 20:45', odds: { home: 2.05, draw: 3.30, away: 3.80 } },
  ]

  const currentMatch = liveMatches[selectedMatch]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050816', color: '#F7F8FC', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, borderBottom: '1px solid #263149', backgroundColor: 'rgba(5, 8, 22, 0.95)', backdropFilter: 'blur(10px)', padding: '16px 32px' }}>
        <div style={{ maxWidth: '1500px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '18px', fontWeight: 900 }}>WAGER<span style={{ color: '#D4AF37' }}>line</span></div>
          <nav style={{ display: 'flex', gap: '32px', flex: 1, marginLeft: '32px' }}>
            {['Home', 'Live', 'Sports', 'Leagues', 'Predictions', 'News', 'Rewards'].map(item => (
              <a key={item} href={item === 'Home' ? '/' : `/${item.toLowerCase()}`} style={{
                fontSize: '12px', fontWeight: 600, color: item === 'Live' ? '#D4AF37' : '#A8B0C0',
                textDecoration: 'none', cursor: 'pointer', paddingBottom: '4px',
                borderBottom: item === 'Live' ? '2px solid #D4AF37' : 'none',
              }}>
                {item}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Live Banner with Image */}
      <div style={{
        paddingTop: '72px',
        backgroundImage: 'url(/logos/livepage.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center right',
        backgroundAttachment: 'fixed',
        borderBottom: '2px solid #D4AF37',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(17, 26, 45, 0.92) 0%, rgba(5, 8, 22, 0.92) 100%)', pointerEvents: 'none', zIndex: 1 }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, fontSize: '120px', opacity: 0.08, display: 'flex', alignItems: 'center', zIndex: 0 }}>
          ⚽🏀🏈
        </div>
        <div style={{ maxWidth: '1500px', margin: '0 auto', padding: '32px', display: 'flex', alignItems: 'center', gap: '24px', position: 'relative', zIndex: 10 }}>
          <div style={{ fontSize: '64px' }}>🔴</div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '2px' }}>● LIVE NOW</div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#F7F8FC', marginTop: '4px', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>Real-Time Match Coverage</div>
            <div style={{ fontSize: '12px', color: '#A8B0C0', marginTop: '8px' }}>Watch live scores, statistics, and player performances</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1500px', margin: '0 auto', padding: '32px' }}>

        {/* Filters */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <div>
            <label style={{ fontSize: '11px', color: '#A8B0C0', fontWeight: 600, display: 'block', marginBottom: '8px' }}>SPORT</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveSport(f)}
                  style={{
                    backgroundColor: activeSport === f ? '#D4AF37' : '#0A1020',
                    color: activeSport === f ? '#050816' : '#F7F8FC',
                    border: activeSport === f ? 'none' : '1px solid #263149',
                    borderRadius: '6px', padding: '8px 12px', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '11px', color: '#A8B0C0', fontWeight: 600, display: 'block', marginBottom: '8px' }}>LEAGUE</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {leagues.map(l => (
                <button
                  key={l}
                  onClick={() => setActiveLeague(l)}
                  style={{
                    backgroundColor: activeLeague === l ? '#D4AF37' : '#0A1020',
                    color: activeLeague === l ? '#050816' : '#F7F8FC',
                    border: activeLeague === l ? 'none' : '1px solid #263149',
                    borderRadius: '6px', padding: '8px 12px', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Two Column Layout: Matches on Left, Details on Right */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px', marginBottom: '48px' }}>
          {/* Left Column: Active & Upcoming Matches */}
          <div>
            {/* Active Matches */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Trophy style={{ width: '18px', height: '18px', color: '#D4AF37' }} />
                <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#F7F8FC', margin: 0 }}>Active Matches</h2>
              </div>
              <div style={{ display: 'grid', gap: '12px' }}>
                {liveMatches.map((match, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedMatch(idx)}
                    style={{
                      backgroundColor: selectedMatch === idx ? '#111A2D' : '#0A1020',
                      border: selectedMatch === idx ? '2px solid #D4AF37' : '2px solid #EF233C',
                      borderRadius: '12px', padding: '16px', cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div style={{ fontSize: '10px', color: '#A8B0C0', fontWeight: 600, textTransform: 'uppercase' }}>{match.league}</div>
                      <div style={{ fontSize: '10px', backgroundColor: '#EF233C', color: 'white', padding: '4px 8px', borderRadius: '4px', fontWeight: 700 }}>
                        ● LIVE
                      </div>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#F7F8FC', marginBottom: '4px' }}>{match.home}</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#F7F8FC', marginBottom: '8px' }}>{match.away}</div>
                    <div style={{ fontSize: '28px', fontWeight: 900, color: '#D4AF37', marginBottom: '8px' }}>{match.score}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#A8B0C0' }}>
                      <span>{match.time}</span>
                      <span>{match.events} events</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Matches */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <TrendingUp style={{ width: '18px', height: '18px', color: '#D4AF37' }} />
                <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#F7F8FC', margin: 0 }}>Upcoming Matches</h2>
              </div>
              <div style={{ display: 'grid', gap: '12px' }}>
                {upcomingMatches.map((m, idx) => (
                  <div key={idx} style={{ backgroundColor: '#0A1020', border: '1px solid #263149', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ fontSize: '10px', color: '#A8B0C0', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase' }}>{m.league}</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#F7F8FC', marginBottom: '12px' }}>{m.match}</div>
                    <div style={{ fontSize: '11px', color: '#D4AF37', fontWeight: 600, marginBottom: '16px' }}>{m.time}</div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                      <div style={{ backgroundColor: '#111A2D', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '9px', color: '#A8B0C0', marginBottom: '4px' }}>Home</div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#38BDF8' }}>{m.odds.home}</div>
                      </div>
                      <div style={{ backgroundColor: '#111A2D', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '9px', color: '#A8B0C0', marginBottom: '4px' }}>Draw</div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#737C8F' }}>{m.odds.draw}</div>
                      </div>
                      <div style={{ backgroundColor: '#111A2D', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '9px', color: '#A8B0C0', marginBottom: '4px' }}>Away</div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#EF233C' }}>{m.odds.away}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Match Details & Performers */}
          <div style={{ backgroundColor: '#0A1020', border: '1px solid #263149', borderRadius: '12px', padding: '24px', height: 'fit-content', position: 'sticky', top: '180px' }}>
            <div style={{ fontSize: '12px', color: '#A8B0C0', fontWeight: 600, textTransform: 'uppercase', marginBottom: '16px' }}>{currentMatch.league}</div>

          {/* Score Display */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#F7F8FC', marginBottom: '8px' }}>{currentMatch.home}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '56px', fontWeight: 900, color: '#D4AF37' }}>{currentMatch.score}</div>
              <div style={{ fontSize: '12px', color: '#A8B0C0' }}>{currentMatch.time}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#F7F8FC' }}>{currentMatch.away}</div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #263149', paddingBottom: '12px', marginBottom: '24px', overflowX: 'auto' }}>
            {['Timeline', 'Stats', 'Lineups', 'H2H'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  fontSize: '12px', fontWeight: 700, color: activeTab === tab ? '#D4AF37' : '#737C8F',
                  background: 'none', border: 'none', cursor: 'pointer', paddingBottom: '4px',
                  borderBottom: activeTab === tab ? '3px solid #D4AF37' : 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'Timeline' && (
            <div style={{ display: 'grid', gap: '12px', marginBottom: '24px' }}>
              {currentMatch.timeline.map((event, idx) => (
                <div key={idx} style={{ backgroundColor: '#111A2D', borderLeft: '3px solid #D4AF37', borderRadius: '4px', padding: '12px', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '12px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#D4AF37', minWidth: '40px' }}>{event.minute}</div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#F7F8FC' }}>{event.player}</div>
                    <div style={{ fontSize: '10px', color: '#A8B0C0' }}>{event.event} · {event.team}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Stats' && (
            <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
              {[
                { label: 'Shots', home: currentMatch.stats.homeShots, away: currentMatch.stats.awayShots },
                { label: 'Possession', home: currentMatch.stats.homePossession + '%', away: currentMatch.stats.awayPossession + '%' },
                { label: 'Corners', home: currentMatch.stats.homeCorners, away: currentMatch.stats.awayCorners },
              ].map((stat, idx) => (
                <div key={idx}>
                  <div style={{ fontSize: '11px', color: '#A8B0C0', marginBottom: '6px', fontWeight: 600 }}>{stat.label}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', alignItems: 'center' }}>
                    <div style={{ backgroundColor: '#111A2D', borderRadius: '4px', padding: '8px', textAlign: 'right', fontSize: '13px', fontWeight: 700, color: '#D4AF37' }}>{stat.home}</div>
                    <div style={{ fontSize: '10px', color: '#737C8F' }}>vs</div>
                    <div style={{ backgroundColor: '#111A2D', borderRadius: '4px', padding: '8px', textAlign: 'left', fontSize: '13px', fontWeight: 700, color: '#D4AF37' }}>{stat.away}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Lineups' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#D4AF37', marginBottom: '12px' }}>{currentMatch.home}</div>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {currentMatch.lineups.home.map((player, idx) => (
                    <div key={idx} style={{ backgroundColor: '#111A2D', borderRadius: '4px', padding: '8px 12px', fontSize: '11px', color: '#F7F8FC' }}>
                      {player}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#D4AF37', marginBottom: '12px' }}>{currentMatch.away}</div>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {currentMatch.lineups.away.map((player, idx) => (
                    <div key={idx} style={{ backgroundColor: '#111A2D', borderRadius: '4px', padding: '8px 12px', fontSize: '11px', color: '#F7F8FC' }}>
                      {player}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'H2H' && (
            <div style={{ display: 'grid', gap: '12px', marginBottom: '24px' }}>
              {currentMatch.h2h.map((match, idx) => (
                <div key={idx} style={{ backgroundColor: '#111A2D', borderRadius: '8px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#F7F8FC' }}>{match.result}</div>
                    <div style={{ fontSize: '10px', color: '#A8B0C0' }}>{match.date} · {match.competition}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Live Match Performers */}
          <div style={{ borderTop: '1px solid #263149', paddingTop: '24px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#F7F8FC', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users style={{ width: '16px', height: '16px', color: '#D4AF37' }} />
              Live Match Performers
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
              {currentMatch.performers.map((player, idx) => (
                <div key={idx} style={{ backgroundColor: '#111A2D', border: '1px solid #263149', borderRadius: '8px', padding: '16px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#F7F8FC', marginBottom: '4px' }}>{player.name}</div>
                  <div style={{ fontSize: '11px', color: '#A8B0C0', marginBottom: '12px' }}>{player.team}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                    <div style={{ backgroundColor: '#050816', borderRadius: '4px', padding: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', color: '#A8B0C0', marginBottom: '4px' }}>Goals</div>
                      <div style={{ fontSize: '16px', fontWeight: 900, color: '#D4AF37' }}>{player.goals}</div>
                    </div>
                    <div style={{ backgroundColor: '#050816', borderRadius: '4px', padding: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', color: '#A8B0C0', marginBottom: '4px' }}>Assists</div>
                      <div style={{ fontSize: '16px', fontWeight: 900, color: '#38BDF8' }}>{player.assists}</div>
                    </div>
                    <div style={{ backgroundColor: '#050816', borderRadius: '4px', padding: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', color: '#A8B0C0', marginBottom: '4px' }}>Rating</div>
                      <div style={{ fontSize: '16px', fontWeight: 900, color: '#D4AF37' }}>{player.rating}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
