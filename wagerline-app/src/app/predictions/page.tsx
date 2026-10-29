'use client'

import Footer from '@/components/Footer'
import { TrendingUp, Target, Zap, Brain, Filter, Star, ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useState } from 'react'

export default function Predictions() {
  const [selectedSport, setSelectedSport] = useState('All')
  const [selectedConfidence, setSelectedConfidence] = useState('All')
  const [selectedDate, setSelectedDate] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null)
  const [selectedOutcome, setSelectedOutcome] = useState<'home' | 'draw' | 'away' | null>(null)
  const [commentCount, setCommentCount] = useState(0)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [calendarMonth, setCalendarMonth] = useState(new Date(2026, 8, 1))

  const sports = ['All', 'Football', 'Basketball', 'American Football', 'Hockey', 'Formula 1']
  const confidenceLevels = ['All', 'Very High (80+)', 'High (70-79)', 'Medium (60-69)']

  const allPredictions = [
    {
      id: 1,
      sport: 'Football',
      league: 'Premier League',
      home: 'Manchester City',
      away: 'Liverpool',
      homeEmoji: '🔵',
      awayEmoji: '🔴',
      homeWin: 58,
      draw: 22,
      awayWin: 20,
      confidence: 78,
      date: '2026-09-04',
      time: '20:00',
      factors: [
        { name: 'Form', value: 8.2, positive: true },
        { name: 'Home Advantage', value: 6.5, positive: true },
        { name: 'Player Stats', value: 4.1, positive: true },
        { name: 'Head to Head', value: -2.3, positive: false },
      ],
    },
    {
      id: 2,
      sport: 'Football',
      league: 'La Liga',
      home: 'Real Madrid',
      away: 'Barcelona',
      homeEmoji: '👑',
      awayEmoji: '🔵',
      homeWin: 62,
      draw: 18,
      awayWin: 20,
      confidence: 84,
      date: '2026-09-05',
      time: '19:30',
      factors: [
        { name: 'Recent Form', value: 9.1, positive: true },
        { name: 'Injury Report', value: 3.2, positive: true },
        { name: 'Head to Head', value: 5.8, positive: true },
        { name: 'Away Performance', value: -1.5, positive: false },
      ],
    },
    {
      id: 3,
      sport: 'Football',
      league: 'Serie A',
      home: 'Inter Milan',
      away: 'Juventus',
      homeEmoji: '⚫',
      awayEmoji: '⚪',
      homeWin: 52,
      draw: 28,
      awayWin: 20,
      confidence: 71,
      date: '2026-09-04',
      time: '18:00',
      factors: [
        { name: 'Form', value: 7.2, positive: true },
        { name: 'Goal Difference', value: 5.3, positive: true },
        { name: 'Defensive Stats', value: 4.8, positive: true },
        { name: 'Missing Players', value: -3.1, positive: false },
      ],
    },
    {
      id: 4,
      sport: 'Football',
      league: 'Bundesliga',
      home: 'Bayern Munich',
      away: 'Borussia Dortmund',
      homeEmoji: '🔴',
      awayEmoji: '💛',
      homeWin: 68,
      draw: 16,
      awayWin: 16,
      confidence: 89,
      date: '2026-09-06',
      time: '15:30',
      factors: [
        { name: 'Recent Form', value: 9.8, positive: true },
        { name: 'Squad Depth', value: 8.5, positive: true },
        { name: 'Home Advantage', value: 6.2, positive: true },
        { name: 'Dortmund Momentum', value: -1.2, positive: false },
      ],
    },
    {
      id: 5,
      sport: 'Basketball',
      league: 'NBA',
      home: 'Boston Celtics',
      away: 'Los Angeles Lakers',
      homeEmoji: '🟢',
      awayEmoji: '💜',
      homeWin: 62,
      draw: 0,
      awayWin: 38,
      confidence: 82,
      date: '2026-09-04',
      time: '22:30',
      factors: [
        { name: 'Team Chemistry', value: 8.9, positive: true },
        { name: 'Scoring Average', value: 7.6, positive: true },
        { name: 'Defense Rating', value: 9.1, positive: true },
        { name: 'Injury Status', value: -2.1, positive: false },
      ],
    },
    {
      id: 6,
      sport: 'American Football',
      league: 'NFL',
      home: 'Kansas City Chiefs',
      away: 'Buffalo Bills',
      homeEmoji: '🔴',
      awayEmoji: '🔵',
      homeWin: 58,
      draw: 0,
      awayWin: 42,
      confidence: 86,
      date: '2026-09-05',
      time: '23:20',
      factors: [
        { name: 'Offensive Line', value: 8.7, positive: true },
        { name: 'Quarterback Rating', value: 9.2, positive: true },
        { name: 'Defense Strength', value: 7.4, positive: true },
        { name: 'Buffalo Recent Play', value: -1.8, positive: false },
      ],
    },
    ...Array.from({ length: 44 }, (_, i) => {
      const id = i + 7
      const sports = ['Football', 'Basketball', 'American Football']
      const leagues = {
        Football: ['Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1'],
        Basketball: ['NBA', 'EuroLeague'],
        'American Football': ['NFL'],
      }
      const sport = sports[id % 3]
      const league = leagues[sport as keyof typeof leagues][id % 5]
      const homes = ['Man City', 'Arsenal', 'Chelsea', 'Liverpool', 'Real Madrid', 'Barcelona', 'Bayern', 'PSG', 'Inter', 'Juventus']
      const aways = ['Tottenham', 'Brighton', 'Newcastle', 'Everton', 'Atletico', 'Valencia', 'Dortmund', 'Lyon', 'Roma', 'Milan']
      const emojisHome = ['🔵', '🔴', '🟡', '🟢', '⚫', '⚪', '💙', '💛', '🟠', '💜']
      const emojisAway = ['🔴', '🟡', '🟢', '⚫', '⚪', '💙', '💛', '🟠', '💜', '🟠']
      const confidences = [65, 72, 78, 85, 68, 75, 82, 70, 88, 76, 63, 79, 84, 71, 67, 73, 86, 69, 77, 80, 74, 81, 62, 89, 66, 83, 61, 87, 64, 90, 68, 76, 82, 71, 79, 85, 60, 75, 84, 69, 77, 81, 73, 88, 70]

      return {
        id,
        sport,
        league,
        home: homes[id % 10],
        away: aways[id % 10],
        homeEmoji: emojisHome[id % 10],
        awayEmoji: emojisAway[id % 10],
        homeWin: 35 + (id * 7) % 35,
        draw: 15 + (id * 5) % 20,
        awayWin: 20 + (id * 11) % 35,
        confidence: confidences[i % 45],
        date: `2026-09-${String((id % 28) + 1).padStart(2, '0')}`,
        time: `${String((id % 24) + 1).padStart(2, '0')}:${String((id * 15) % 60).padStart(2, '0')}`,
        factors: [
          { name: 'Form', value: 5.2 + (id % 5), positive: (id % 3) !== 0 },
          { name: 'Home Advantage', value: 4.5 + (id % 4), positive: (id % 2) === 0 },
          { name: 'Player Stats', value: 3.1 + (id % 5), positive: (id % 2) !== 0 },
          { name: 'Recent Performance', value: 2.8 + (id % 4), positive: (id % 3) === 0 },
        ],
      }
    }),
  ]

  const uniqueDates = ['All', ...new Set(allPredictions.map(p => p.date))].sort()

  const filteredPredictions = allPredictions.filter(pred => {
    const sportMatch = selectedSport === 'All' || pred.sport === selectedSport
    const confidenceMatch = selectedConfidence === 'All' ||
      (selectedConfidence === 'Very High (80+)' && pred.confidence >= 80) ||
      (selectedConfidence === 'High (70-79)' && pred.confidence >= 70 && pred.confidence < 80) ||
      (selectedConfidence === 'Medium (60-69)' && pred.confidence >= 60 && pred.confidence < 70)
    const dateMatch = selectedDate === 'All' || pred.date === selectedDate

    return sportMatch && confidenceMatch && dateMatch
  })

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return '#10B981'
    if (confidence >= 80) return '#06B6D4'
    if (confidence >= 75) return '#D4AF37'
    return '#F97316'
  }

  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 85) return 'Very High'
    if (confidence >= 80) return 'High'
    if (confidence >= 75) return 'Good'
    return 'Moderate'
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050816', color: '#F7F8FC', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, borderBottom: '1px solid #263149', backgroundColor: 'rgba(5, 8, 22, 0.95)', backdropFilter: 'blur(10px)', padding: '16px 32px' }}>
        <div style={{ maxWidth: '1500px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '18px', fontWeight: 900 }}>WAGER<span style={{ color: '#D4AF37' }}>line</span></div>
          <nav style={{ display: 'flex', gap: '32px', flex: 1, marginLeft: '32px' }}>
            {['Home', 'Live', 'Sports', 'Leagues', 'Predictions', 'News', 'Rewards'].map(item => (
              <a key={item} href={item === 'Home' ? '/' : `/${item.toLowerCase()}`} style={{
                fontSize: '12px', fontWeight: 600, color: item === 'Predictions' ? '#D4AF37' : '#A8B0C0',
                textDecoration: 'none', cursor: 'pointer', paddingBottom: '4px',
                borderBottom: item === 'Predictions' ? '2px solid #D4AF37' : 'none',
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
        backgroundPosition: 'center right',
        backgroundAttachment: 'fixed',
        borderBottom: '2px solid #D4AF37',
        position: 'relative',
        minHeight: '280px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(26, 58, 82, 0.93) 0%, rgba(17, 26, 45, 0.93) 100%)', pointerEvents: 'none', zIndex: 1 }} />

        <div style={{ maxWidth: '1500px', margin: '0 auto', padding: '48px 32px', position: 'relative', zIndex: 10, width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <Brain style={{ width: '32px', height: '32px', color: '#D4AF37' }} />
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '2px' }}>
              AI-POWERED ANALYTICS
            </div>
          </div>
          <h1 style={{ fontSize: '48px', fontWeight: 900, color: '#F7F8FC', margin: '0 0 16px 0', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
            Smart Predictions
          </h1>
          <p style={{ fontSize: '16px', color: '#A8B0C0', margin: 0, maxWidth: '600px' }}>
            Machine learning-powered match predictions with confidence scores and detailed factor analysis
          </p>
        </div>

        {/* Stats Row */}
        <div style={{ maxWidth: '1500px', margin: '0 auto', padding: '0 32px 32px', position: 'relative', zIndex: 10, width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #D4AF37' }}>
              <div style={{ fontSize: '11px', color: '#A8B0C0' }}>Total</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#D4AF37' }}>247</div>
            </div>
            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #10B981' }}>
              <div style={{ fontSize: '11px', color: '#A8B0C0' }}>Accuracy</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#10B981' }}>78.4%</div>
            </div>
            <div style={{ backgroundColor: 'rgba(6, 182, 212, 0.1)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #06B6D4' }}>
              <div style={{ fontSize: '11px', color: '#A8B0C0' }}>This Week</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#06B6D4' }}>34</div>
            </div>
            <div style={{ backgroundColor: 'rgba(249, 115, 22, 0.1)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #F97316' }}>
              <div style={{ fontSize: '11px', color: '#A8B0C0' }}>Upcoming</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#F97316' }}>12</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1500px', margin: '0 auto', padding: '32px' }}>
        {/* Filter Section */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Filter style={{ width: '20px', height: '20px', color: '#D4AF37' }} />
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#F7F8FC' }}>Filters</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {/* Sport Filter */}
            <div style={{ backgroundColor: '#0A1020', borderRadius: '12px', padding: '16px', borderLeft: '4px solid #D4AF37' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#A8B0C0', marginBottom: '12px', display: 'block' }}>Sport</label>
              <select
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: '#111A2D',
                  color: '#F7F8FC',
                  border: '1px solid #263149',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {sports.map(sport => (
                  <option key={sport} value={sport}>{sport}</option>
                ))}
              </select>
            </div>

            {/* Confidence Filter */}
            <div style={{ backgroundColor: '#0A1020', borderRadius: '12px', padding: '16px', borderLeft: '4px solid #10B981' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#A8B0C0', marginBottom: '12px', display: 'block' }}>Confidence Level</label>
              <select
                value={selectedConfidence}
                onChange={(e) => setSelectedConfidence(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: '#111A2D',
                  color: '#F7F8FC',
                  border: '1px solid #263149',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {confidenceLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div style={{ backgroundColor: '#0A1020', borderRadius: '12px', padding: '16px', borderLeft: '4px solid #06B6D4', position: 'relative' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#A8B0C0', marginBottom: '12px', display: 'block' }}>Date</label>
              <button
                onClick={() => setCalendarOpen(!calendarOpen)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: '#111A2D',
                  color: '#F7F8FC',
                  border: '1px solid #263149',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                }}
              >
                {selectedDate === 'All' ? 'Select a date' : selectedDate}
              </button>

              {/* Calendar Popup */}
              {calendarOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: '#0A1020',
                  border: '1px solid #263149',
                  borderRadius: '8px',
                  padding: '16px',
                  marginTop: '8px',
                  zIndex: 500,
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
                }}>
                  {/* Calendar Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <button
                      onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))}
                      style={{ background: 'none', border: 'none', color: '#D4AF37', cursor: 'pointer', padding: '4px' }}>
                      <ChevronLeft style={{ width: '16px', height: '16px' }} />
                    </button>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#F7F8FC' }}>
                      {calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </div>
                    <button
                      onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))}
                      style={{ background: 'none', border: 'none', color: '#D4AF37', cursor: 'pointer', padding: '4px' }}>
                      <ChevronRight style={{ width: '16px', height: '16px' }} />
                    </button>
                  </div>

                  {/* Clear Button */}
                  <button
                    onClick={() => {
                      setSelectedDate('All')
                      setCalendarOpen(false)
                    }}
                    style={{
                      width: '100%',
                      padding: '8px',
                      backgroundColor: 'rgba(212, 175, 55, 0.1)',
                      border: '1px solid #D4AF37',
                      color: '#D4AF37',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      marginBottom: '12px'
                    }}>
                    Clear Date
                  </button>

                  {/* Day Headers */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} style={{ fontSize: '10px', fontWeight: 700, color: '#A8B0C0', textAlign: 'center', padding: '8px 0' }}>
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                    {(() => {
                      const year = calendarMonth.getFullYear()
                      const month = calendarMonth.getMonth()
                      const firstDay = new Date(year, month, 1)
                      const lastDay = new Date(year, month + 1, 0)
                      const daysInMonth = lastDay.getDate()
                      const startingDayOfWeek = firstDay.getDay()

                      const days = []
                      for (let i = 0; i < startingDayOfWeek; i++) {
                        days.push(null)
                      }
                      for (let day = 1; day <= daysInMonth; day++) {
                        days.push(day)
                      }

                      return days.map((day, idx) => {
                        if (day === null) {
                          return <div key={`empty-${idx}`} style={{ padding: '8px' }} />
                        }

                        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                        const isSelected = selectedDate === dateStr
                        const hasData = uniqueDates.includes(dateStr)

                        return (
                          <button
                            key={day}
                            onClick={() => {
                              setSelectedDate(dateStr)
                              setCalendarOpen(false)
                            }}
                            disabled={!hasData}
                            style={{
                              padding: '8px',
                              backgroundColor: isSelected ? '#D4AF37' : hasData ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
                              border: isSelected ? '1px solid #D4AF37' : hasData ? '1px solid #06B6D4' : '1px solid #263149',
                              color: isSelected ? '#050816' : hasData ? '#06B6D4' : '#737C8F',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: hasData ? 'pointer' : 'not-allowed',
                              opacity: hasData ? 1 : 0.5
                            }}>
                            {day}
                          </button>
                        )
                      })
                    })()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Predictions Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px' }}>
          {filteredPredictions.map(pred => (
            <div key={pred.id} style={{ backgroundColor: '#0A1020', borderRadius: '12px', overflow: 'hidden', borderLeft: '4px solid #D4AF37' }}>
              {/* Header */}
              <div style={{ padding: '16px', borderBottom: '1px solid #263149', backgroundColor: 'rgba(212, 175, 55, 0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase' }}>
                      {pred.league}
                    </div>
                    <div style={{ fontSize: '12px', color: '#A8B0C0', marginTop: '2px' }}>
                      {pred.date} • {pred.time}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: getConfidenceColor(pred.confidence), padding: '6px 12px', borderRadius: '6px' }}>
                    <Star style={{ width: '14px', height: '14px', color: '#050816', fill: '#050816' }} />
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#050816' }}>{pred.confidence}%</div>
                  </div>
                </div>
              </div>

              {/* Match Info */}
              <div style={{ padding: '16px', borderBottom: '1px solid #263149' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', marginBottom: '6px' }}>{pred.homeEmoji}</div>
                    <div style={{ fontSize: '12px', fontWeight: 700 }}>{pred.home}</div>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#D4AF37' }}>vs</div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', marginBottom: '6px' }}>{pred.awayEmoji}</div>
                    <div style={{ fontSize: '12px', fontWeight: 700 }}>{pred.away}</div>
                  </div>
                </div>

                {/* Probabilities */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                  <div style={{ backgroundColor: 'rgba(56, 189, 248, 0.1)', padding: '8px', borderRadius: '6px', textAlign: 'center', borderLeft: '3px solid #38BDF8' }}>
                    <div style={{ fontSize: '10px', color: '#A8B0C0', marginBottom: '4px' }}>Home</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#38BDF8' }}>{pred.homeWin}%</div>
                  </div>
                  <div style={{ backgroundColor: 'rgba(115, 124, 143, 0.1)', padding: '8px', borderRadius: '6px', textAlign: 'center', borderLeft: '3px solid #737C8F' }}>
                    <div style={{ fontSize: '10px', color: '#A8B0C0', marginBottom: '4px' }}>Draw</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#737C8F' }}>{pred.draw}%</div>
                  </div>
                  <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '8px', borderRadius: '6px', textAlign: 'center', borderLeft: '3px solid #EF4444' }}>
                    <div style={{ fontSize: '10px', color: '#A8B0C0', marginBottom: '4px' }}>Away</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#EF4444' }}>{pred.awayWin}%</div>
                  </div>
                </div>

                {/* Probability Bar */}
                <div style={{ display: 'flex', height: '6px', borderRadius: '3px', overflow: 'hidden', gap: '1px' }}>
                  <div style={{ flex: pred.homeWin, backgroundColor: '#38BDF8' }} />
                  <div style={{ flex: pred.draw, backgroundColor: '#737C8F' }} />
                  <div style={{ flex: pred.awayWin, backgroundColor: '#EF4444' }} />
                </div>
              </div>

              {/* Factors */}
              <div style={{ padding: '16px', borderBottom: '1px solid #263149' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#D4AF37', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <TrendingUp style={{ width: '16px', height: '16px' }} />
                  Key Factors
                </div>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {pred.factors.map((factor, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: 'rgba(212, 175, 55, 0.05)', borderRadius: '6px' }}>
                      <div style={{ fontSize: '11px', color: '#A8B0C0' }}>{factor.name}</div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: factor.positive ? '#10B981' : '#EF4444' }}>
                        {factor.positive ? '+' : ''}{factor.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Button */}
              <div style={{ padding: '16px', display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 700, color: '#D4AF37' }}>
                  <Target style={{ width: '16px', height: '16px' }} />
                  {pred.homeWin > pred.awayWin ? `${pred.home} Wins` : `${pred.away} Wins`}
                </div>
                <button
                  onClick={() => {
                    setSelectedMatchId(pred.id)
                    setModalOpen(true)
                  }}
                  style={{ padding: '8px 16px', backgroundColor: '#D4AF37', color: '#050816', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Your Predictions <ArrowRight style={{ width: '12px', height: '12px' }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && selectedMatchId && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#0A1020', borderRadius: '12px', padding: '32px', maxWidth: '550px', width: '90%', borderLeft: '4px solid #D4AF37', maxHeight: '80vh', overflowY: 'auto' }}>
            {(() => {
              const selectedMatch = filteredPredictions.find(p => p.id === selectedMatchId)
              if (!selectedMatch) return null

              return (
                <>
                  {/* Modal Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#F7F8FC', margin: 0 }}>Select Outcome</h2>
                    <button
                      onClick={() => {
                        setModalOpen(false)
                        setSelectedOutcome(null)
                      }}
                      style={{ background: 'none', border: 'none', fontSize: '24px', color: '#D4AF37', cursor: 'pointer' }}>
                      ×
                    </button>
                  </div>

                  {/* Match Details */}
                  <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#F7F8FC' }}>
                        {selectedMatch.home} vs {selectedMatch.away}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#D4AF37' }}>
                        <Star style={{ width: '14px', height: '14px', fill: '#D4AF37' }} />
                        {selectedMatch.confidence}% Confidence
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#A8B0C0' }}>{selectedMatch.league} • {selectedMatch.date}</div>
                  </div>

                  {/* Outcome Selection */}
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#A8B0C0', marginBottom: '12px' }}>Choose Your Prediction:</div>
                    <div style={{ display: 'grid', gap: '12px' }}>
                      {/* Home Win */}
                      <button
                        onClick={() => setSelectedOutcome('home')}
                        style={{
                          padding: '16px',
                          backgroundColor: selectedOutcome === 'home' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(56, 189, 248, 0.05)',
                          border: selectedOutcome === 'home' ? '2px solid #38BDF8' : '1px solid #263149',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          textAlign: 'left',
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.borderColor = '#38BDF8'
                          ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(56, 189, 248, 0.1)'
                        }}
                        onMouseLeave={(e) => {
                          if (selectedOutcome !== 'home') {
                            (e.currentTarget as HTMLButtonElement).style.borderColor = '#263149'
                            ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(56, 189, 248, 0.05)'
                          }
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#38BDF8' }}>{selectedMatch.home} Wins</div>
                            <div style={{ fontSize: '11px', color: '#A8B0C0', marginTop: '4px' }}>Home team victory</div>
                          </div>
                          <div style={{ fontSize: '20px', fontWeight: 700, color: '#38BDF8' }}>{selectedMatch.homeWin}%</div>
                        </div>
                      </button>

                      {/* Draw */}
                      <button
                        onClick={() => setSelectedOutcome('draw')}
                        style={{
                          padding: '16px',
                          backgroundColor: selectedOutcome === 'draw' ? 'rgba(212, 175, 55, 0.2)' : 'rgba(212, 175, 55, 0.05)',
                          border: selectedOutcome === 'draw' ? '2px solid #D4AF37' : '1px solid #263149',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          textAlign: 'left',
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.borderColor = '#D4AF37'
                          ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(212, 175, 55, 0.1)'
                        }}
                        onMouseLeave={(e) => {
                          if (selectedOutcome !== 'draw') {
                            (e.currentTarget as HTMLButtonElement).style.borderColor = '#263149'
                            ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(212, 175, 55, 0.05)'
                          }
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#D4AF37' }}>Draw</div>
                            <div style={{ fontSize: '11px', color: '#A8B0C0', marginTop: '4px' }}>Match tie</div>
                          </div>
                          <div style={{ fontSize: '20px', fontWeight: 700, color: '#D4AF37' }}>{selectedMatch.draw}%</div>
                        </div>
                      </button>

                      {/* Away Win */}
                      <button
                        onClick={() => setSelectedOutcome('away')}
                        style={{
                          padding: '16px',
                          backgroundColor: selectedOutcome === 'away' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.05)',
                          border: selectedOutcome === 'away' ? '2px solid #EF4444' : '1px solid #263149',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          textAlign: 'left',
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.borderColor = '#EF4444'
                          ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(239, 68, 68, 0.1)'
                        }}
                        onMouseLeave={(e) => {
                          if (selectedOutcome !== 'away') {
                            (e.currentTarget as HTMLButtonElement).style.borderColor = '#263149'
                            ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(239, 68, 68, 0.05)'
                          }
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#EF4444' }}>{selectedMatch.away} Wins</div>
                            <div style={{ fontSize: '11px', color: '#A8B0C0', marginTop: '4px' }}>Away team victory</div>
                          </div>
                          <div style={{ fontSize: '20px', fontWeight: 700, color: '#EF4444' }}>{selectedMatch.awayWin}%</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Modal Actions */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <button
                      onClick={() => {
                        setModalOpen(false)
                        setSelectedOutcome(null)
                      }}
                      style={{ padding: '12px', backgroundColor: '#263149', color: '#F7F8FC', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (selectedOutcome) {
                          setCommentCount(commentCount + 1)
                          setModalOpen(false)
                          setSelectedOutcome(null)
                        }
                      }}
                      disabled={!selectedOutcome}
                      style={{ padding: '12px', backgroundColor: selectedOutcome ? '#D4AF37' : '#737C8F', color: '#050816', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: selectedOutcome ? 'pointer' : 'not-allowed', opacity: selectedOutcome ? 1 : 0.6 }}
                    >
                      Confirm Selection
                    </button>
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      )}

      {/* Comment Counter - Bottom Right */}
      {commentCount > 0 && (
        <div style={{ position: 'fixed', bottom: '32px', right: '32px', backgroundColor: '#D4AF37', color: '#050816', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 900, zIndex: 999, boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)' }}>
          {commentCount}
        </div>
      )}

      <Footer />
    </div>
  )
}
