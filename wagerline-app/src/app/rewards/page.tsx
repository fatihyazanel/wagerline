'use client'

import Footer from '@/components/Footer'
import {
  Award, Zap, Trophy, TrendingUp, Lock, Crown, Check, LogIn, Tv2, Brain, Newspaper, Share2,
  Target, Star, Eye, BarChart2, Sparkles, X, Coins, Badge, CircleCheck, Flame, Gift, ShoppingBag,
  ChevronRight, ArrowRight, Timer, Users, Shield, Globe2, ChevronDown
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { useTranslation } from '@/hooks/useTranslation'

export default function Rewards() {
  const { language, setLanguage } = useLanguage()
  const { t } = useTranslation(language)
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)

  // Debug: Log language changes
  if (typeof window !== 'undefined') {
    console.log('Rewards page rendered with language:', language)
  }

  const languages: Array<{ code: 'en' | 'es' | 'ar'; name: string }> = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'ar', name: 'العربية' },
  ]
  // Language Dropdown State
  const [hoveredLanguage, setHoveredLanguage] = useState<'en' | 'es' | 'ar' | null>(null)

  // Profile State
  const [profile] = useState({
    name: 'Alex Thompson',
    title: 'Elite Predictor',
    level: 24,
    xp: 12450,
    nextLevelXp: 20000,
    points: 12450,
    rank: 8,
    predictions: 1248,
    accuracy: 67.8,
    memberSince: 'Jan 2024',
    country: 'UK',
    streakDays: 12,
    bestStreakDays: 24,
  })

  // Task State
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set([]))
  const [taskCountdown, setTaskCountdown] = useState(29674) // 08:14:34 in seconds
  const [predictionModalOpen, setPredictionModalOpen] = useState(false)
  const [selectedOutcome, setSelectedOutcome] = useState<'home' | 'draw' | 'away' | null>(null)

  // Leaderboard State
  const [leaderboardPeriod, setLeaderboardPeriod] = useState<'week' | 'month' | 'all'>('week')
  const [hoveredTaskId, setHoveredTaskId] = useState<number | null>(null)
  const [hoveredRewardId, setHoveredRewardId] = useState<number | null>(null)

  const dailyTasks = [
    { id: 1, title: 'Make a Prediction', description: 'Make any match prediction', points: 50, xp: 30, icon: Brain, actionLabel: 'Make a Prediction' },
    { id: 2, title: 'Watch 2 Live Matches', description: 'Watch live matches for 10+ minutes', points: 40, xp: 25, icon: Tv2, actionLabel: 'Watch Match' },
    { id: 3, title: 'Correct Prediction', description: 'Make 1 correct prediction', points: 60, xp: 35, icon: Target, actionLabel: 'View Predictions' },
    { id: 4, title: 'Check Match Stats', description: 'View match statistics', points: 30, xp: 15, icon: BarChart2, actionLabel: 'View Stats' },
    { id: 5, title: 'Invite a Friend', description: 'Invite a friend to join WAGERline', points: 100, xp: 50, icon: Share2, actionLabel: 'Invite Friend' },
  ]

  const achievements = [
    { id: 1, title: 'Prediction Master', description: 'Make 100 correct predictions', progress: 78, target: 100, icon: Target, status: 'in_progress', reward: 200 },
    { id: 2, title: 'Streak King', description: 'Maintain 30 day streak', progress: 12, target: 30, icon: Flame, status: 'in_progress', reward: 500 },
    { id: 3, title: 'Stats Explorer', description: 'View 500 match statistics', progress: 312, target: 500, icon: BarChart2, status: 'in_progress', reward: 300 },
    { id: 4, title: 'Social Butterfly', description: 'Invite 10 friends', progress: 4, target: 10, icon: Users, status: 'in_progress', reward: 400 },
    { id: 5, title: 'Elite Predictor', description: 'Reach 80% accuracy', progress: 67.8, target: 80, icon: Shield, status: 'locked', reward: 600 },
    { id: 6, title: 'Legend', description: 'Reach Level 50', progress: 24, target: 50, icon: Crown, status: 'locked', reward: 1000 },
  ]

  const weeklyChallenge = {
    title: 'Make 25 correct predictions',
    progress: 18,
    target: 25,
    expiresIn: '03d 08h 14m',
    reward: { points: 500, xp: 250 }
  }

  const leaderboards = {
    week: [
      { rank: 1, name: 'Marcus_Pro', level: 28, points: 18750, xp: 12300 },
      { rank: 2, name: 'BettingWizard', level: 26, points: 16420, xp: 10850 },
      { rank: 3, name: 'GoalGetter', level: 25, points: 14980, xp: 9720 },
      { rank: 4, name: 'StatKing', level: 24, points: 13250, xp: 8900 },
      { rank: 8, name: 'You (Alex)', level: 24, points: profile.points, xp: profile.xp, isCurrentUser: true },
    ],
    month: [
      { rank: 1, name: 'Marcus_Pro', level: 28, points: 42300, xp: 28900 },
      { rank: 2, name: 'BettingWizard', level: 26, points: 38750, xp: 24500 },
      { rank: 3, name: 'GoalGetter', level: 25, points: 35200, xp: 21300 },
      { rank: 5, name: 'You (Alex)', level: 24, points: profile.points, xp: profile.xp, isCurrentUser: true },
    ],
    all: [
      { rank: 1, name: 'LegendaryPro', level: 42, points: 125000, xp: 89300 },
      { rank: 2, name: 'TopPredictor', level: 38, points: 98500, xp: 72100 },
      { rank: 3, name: 'Marcus_Pro', level: 28, points: 67400, xp: 51200 },
      { rank: 15, name: 'You (Alex)', level: 24, points: profile.points, xp: profile.xp, isCurrentUser: true },
    ]
  }

  const recentActivity = [
    { id: 1, type: 'prediction', title: 'Correct prediction', description: 'Man City vs Arsenal', points: 60, timestamp: '2m ago' },
    { id: 2, type: 'task', title: 'Daily task completed', description: 'Make a Prediction', points: 50, timestamp: '15m ago' },
    { id: 3, type: 'achievement', title: 'Achievement unlocked', description: 'Prediction Master', points: 200, timestamp: '1h ago' },
    { id: 4, type: 'challenge', title: 'Weekly challenge progress', description: '18 / 25 predictions', points: 100, timestamp: '2h ago' },
    { id: 5, type: 'social', title: 'Friend invited', description: 'johndoe@email.com', points: 100, timestamp: '3h ago' },
  ]

  // Countdown Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTaskCountdown(prev => {
        if (prev <= 1) return 86400 // Reset to 24 hours
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatCountdown = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const xpProgress = (profile.xp / profile.nextLevelXp) * 100
  const xpRemaining = profile.nextLevelXp - profile.xp
  const radius = 85
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (xpProgress / 100) * circumference

  const handleTaskAction = (taskId: number) => {
    if (taskId === 1) {
      setPredictionModalOpen(true)
      return
    }
    const newCompleted = new Set(completedTasks)
    newCompleted.add(taskId)
    setCompletedTasks(newCompleted)
  }

  const handlePredictionSubmit = () => {
    if (selectedOutcome) {
      const newCompleted = new Set(completedTasks)
      newCompleted.add(1)
      setCompletedTasks(newCompleted)
      setPredictionModalOpen(false)
      setSelectedOutcome(null)
    }
  }

  const currentLeaderboard = leaderboards[leaderboardPeriod]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050816', color: '#F7F8FC', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Fixed Header */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, borderBottom: '1px solid #263149', backgroundColor: 'rgba(5, 8, 22, 0.95)', backdropFilter: 'blur(10px)', padding: '16px 32px' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '18px', fontWeight: 900 }}>WAGER<span style={{ color: '#FFD400' }}>line</span></div>
          <nav style={{ display: 'flex', gap: '32px', flex: 1, marginLeft: '32px' }}>
            {[
              { key: 'home', label: t('nav.home'), path: '/' },
              { key: 'live', label: t('nav.live'), path: '/live' },
              { key: 'sports', label: t('nav.sports'), path: '/sports' },
              { key: 'leagues', label: t('nav.leagues'), path: '/leagues' },
              { key: 'predictions', label: t('nav.predictions'), path: '/predictions' },
              { key: 'news', label: t('nav.news'), path: '/news' },
              { key: 'rewards', label: t('nav.rewards'), path: '/rewards' },
            ].map(item => (
              <a key={item.key} href={item.path} style={{
                fontSize: '12px', fontWeight: 600, color: item.key === 'rewards' ? '#FFD400' : '#A8B0C0',
                textDecoration: 'none', cursor: 'pointer', paddingBottom: '4px',
                borderBottom: item.key === 'rewards' ? '2px solid #FFD400' : 'none',
              }}>
                {item.label}
              </a>
            ))}
          </nav>

          {/* Language Selector */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setLangDropdownOpen(!langDropdownOpen)} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#A8B0C0',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0',
            }}>
              <Globe2 style={{ width: '16px', height: '16px' }} />
              {language.toUpperCase()}
              <ChevronDown style={{ width: '14px', height: '14px', transform: langDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
            </button>

            {langDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                backgroundColor: '#0A1020',
                border: '1px solid #263149',
                borderRadius: '8px',
                padding: '8px',
                marginTop: '4px',
                zIndex: 500,
                minWidth: '140px',
              }}>
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code)
                      setLangDropdownOpen(false)
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '10px 12px',
                      backgroundColor: language === lang.code || hoveredLanguage === lang.code ? '#111A2D' : 'transparent',
                      border: 'none',
                      borderRadius: '4px',
                      color: language === lang.code ? '#FFD400' : '#A8B0C0',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      marginBottom: lang.code === 'ar' ? 0 : '2px',
                    }}
                    onMouseEnter={() => setHoveredLanguage(lang.code)}
                    onMouseLeave={() => setHoveredLanguage(null)}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content - 12-column Grid */}
      <div style={{ paddingTop: '80px', maxWidth: '1440px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Hero Section: Profile (3) + Rewards Hub (7) + XP Ring (2) */}
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 7fr 2fr', gap: '16px', marginBottom: '32px' }}>

          {/* Profile Card */}
          <div style={{ backgroundColor: '#0A1020', border: '1px solid #263149', borderRadius: '12px', padding: '24px', borderLeft: '4px solid #FFD400' }}>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ width: '88px', height: '88px', borderRadius: '8px', backgroundColor: '#111A2D', border: '2px solid #FFD400', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 900, color: '#FFD400', marginBottom: '16px' }}>
                AT
              </div>
              <div style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)', borderRadius: '6px', padding: '6px 12px', display: 'inline-block', marginBottom: '12px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#8B5CF6' }}>LVL {profile.level}</div>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#F7F8FC', margin: 0, marginBottom: '2px' }}>{profile.name}</h3>
              <p style={{ fontSize: '13px', color: '#A8B0C0', margin: 0, marginBottom: '16px' }}>{profile.title}</p>
            </div>
            <div style={{ borderTop: '1px solid #263149', paddingTop: '16px' }}>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', color: '#737C8F', fontWeight: 600, marginBottom: '4px' }}>{t('profile.member_since').toUpperCase()}</div>
                <div style={{ fontSize: '13px', color: '#F7F8FC', fontWeight: 500 }}>{profile.memberSince}</div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', color: '#737C8F', fontWeight: 600, marginBottom: '4px' }}>{t('profile.predictions').toUpperCase()}</div>
                <div style={{ fontSize: '13px', color: '#F7F8FC', fontWeight: 500 }}>{profile.predictions.toLocaleString('en-US')}</div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', color: '#737C8F', fontWeight: 600, marginBottom: '4px' }}>{t('profile.accuracy').toUpperCase()}</div>
                <div style={{ fontSize: '13px', color: '#F7F8FC', fontWeight: 500 }}>{profile.accuracy}%</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: '#737C8F', fontWeight: 600, marginBottom: '4px' }}>{t('profile.country').toUpperCase()}</div>
                <div style={{ fontSize: '13px', color: '#F7F8FC', fontWeight: 500 }}>{profile.country}</div>
              </div>
            </div>
          </div>

          {/* Rewards Hub */}
          <div style={{ backgroundColor: '#0A1020', border: '1px solid #263149', borderRadius: '12px', padding: '28px', borderLeft: '4px solid #8B5CF6' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#F7F8FC', margin: 0, marginBottom: '4px' }}>{t('rewards_page.title')}</h1>
            <p style={{ fontSize: '14px', color: '#A8B0C0', margin: 0, marginBottom: '20px' }}>{t('rewards_page.subtitle')}</p>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#F7F8FC' }}>{t('rewards_page.next_level')}: {profile.level + 1}</span>
                <span style={{ fontSize: '13px', color: '#A8B0C0' }}>{xpRemaining.toLocaleString('en-US')} {t('common.xp')} {t('rewards_page.to_go')}</span>
              </div>
              <div style={{ backgroundColor: '#111A2D', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                <div style={{ width: `${Math.min(100, xpProgress)}%`, height: '100%', backgroundColor: '#8B5CF6', transition: 'width 0.6s ease-out' }} />
              </div>
              <div style={{ fontSize: '12px', color: '#8B5CF6', fontWeight: 500 }}>
                {profile.xp.toLocaleString('en-US')} / {profile.nextLevelXp.toLocaleString('en-US')} {t('common.xp')}
              </div>
            </div>

            <div style={{ backgroundColor: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: '#A8B0C0' }}>↗ {t('rewards_page.keep_going_message')}</div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ padding: '8px 16px', backgroundColor: '#8B5CF6', color: '#F7F8FC', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                {t('buttons.view_progress')}
              </button>
              <button style={{ padding: '8px 16px', backgroundColor: 'transparent', border: '1px solid #263149', color: '#A8B0C0', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                {t('rewards_page.daily_challenges')}
              </button>
            </div>
          </div>

          {/* XP Ring */}
          <div style={{ backgroundColor: '#0A1020', border: '1px solid #263149', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '160px', height: '160px', marginBottom: '16px' }}>
              <svg width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="80" cy="80" r={radius} fill="none" stroke="#263149" strokeWidth="8" />
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
                />
                <circle cx="80" cy="80" r={radius - 15} fill="none" stroke="#FFD400" strokeWidth="2" opacity="0.3" />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 900, color: '#FFD400', lineHeight: 1 }}>LVL</div>
                <div style={{ fontSize: '32px', fontWeight: 900, color: '#8B5CF6', lineHeight: 1 }}>{profile.level}</div>
              </div>
            </div>
            <div style={{ fontSize: '11px', color: '#A8B0C0', textAlign: 'center' }}>
              {profile.xp.toLocaleString('en-US')} XP
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: t('rewards_page.wager_points'), value: profile.points.toLocaleString('en-US'), delta: t('rewards_page.points_this_week', { points: 850 }), icon: Coins, color: '#FFD400' },
            { label: t('rewards_page.xp_earned'), value: profile.xp.toLocaleString('en-US'), delta: t('rewards_page.xp_this_week', { xp: 1250 }), icon: Badge, color: '#06B6D4' },
            { label: t('rewards_page.tasks_completed'), value: '28', delta: t('rewards_page.tasks_this_week', { tasks: 6 }), icon: CircleCheck, color: '#22C55E' },
            { label: t('rewards_page.current_streak'), value: `${profile.streakDays} ${t('common.days')}`, delta: `${t('common.best')}: ${profile.bestStreakDays} ${t('common.days')}`, icon: Flame, color: '#F97316' },
          ].map((stat, idx) => (
            <div key={idx} style={{ backgroundColor: '#0A1020', border: '1px solid #263149', borderRadius: '12px', borderLeft: `4px solid ${stat.color}`, padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <stat.icon style={{ width: '16px', height: '16px', color: stat.color }} />
                <span style={{ fontSize: '10px', color: '#A8B0C0', fontWeight: 600, textTransform: 'uppercase' }}>{stat.label}</span>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#F7F8FC', marginBottom: '4px' }}>{stat.value}</div>
              <div style={{ fontSize: '11px', color: '#737C8F' }}>{stat.delta}</div>
            </div>
          ))}
        </div>

        {/* Daily Tasks (8) + Achievements (4) */}
        <div style={{ display: 'grid', gridTemplateColumns: '8fr 4fr', gap: '16px', marginBottom: '32px' }}>

          {/* Daily Tasks */}
          <div style={{ backgroundColor: '#0A1020', border: '1px solid #263149', borderRadius: '12px', borderLeft: '4px solid #8B5CF6', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#F7F8FC', margin: 0 }}>{t('rewards_page.daily_tasks')}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#A8B0C0' }}>
                <Timer style={{ width: '14px', height: '14px' }} />
                {t('rewards_page.resets_in')} {formatCountdown(taskCountdown)}
              </div>
            </div>

            {dailyTasks.map(task => (
              <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderBottom: '1px solid #263149', cursor: 'pointer', transition: 'background-color 0.2s', backgroundColor: hoveredTaskId === task.id ? '#111A2D' : 'transparent' }} onMouseEnter={() => setHoveredTaskId(task.id)} onMouseLeave={() => setHoveredTaskId(null)}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#111A2D', flexShrink: 0 }}>
                  <task.icon style={{ width: '20px', height: '20px', color: completedTasks.has(task.id) ? '#22C55E' : '#8B5CF6' }} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#F7F8FC', marginBottom: '2px' }}>{task.title}</div>
                  <div style={{ fontSize: '12px', color: '#A8B0C0' }}>{task.description}</div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginRight: '16px', flexShrink: 0 }}>
                  <div style={{ backgroundColor: 'rgba(255, 212, 0, 0.1)', borderRadius: '6px', padding: '6px 10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: '#A8B0C0', marginBottom: '2px' }}>{t('common.pts')}</div>
                    <div style={{ fontSize: '12px', fontWeight: 900, color: '#FFD400' }}>+{task.points}</div>
                  </div>
                  <div style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', borderRadius: '6px', padding: '6px 10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: '#A8B0C0', marginBottom: '2px' }}>{t('common.xp')}</div>
                    <div style={{ fontSize: '12px', fontWeight: 900, color: '#8B5CF6' }}>+{task.xp}</div>
                  </div>
                </div>

                <button onClick={() => handleTaskAction(task.id)} style={{ padding: '8px 16px', backgroundColor: completedTasks.has(task.id) ? '#22C55E' : '#8B5CF6', color: '#F7F8FC', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {completedTasks.has(task.id) ? (
                    <>
                      <Check style={{ width: '14px', height: '14px' }} />
                      {t('common.done')}
                    </>
                  ) : (
                    task.actionLabel
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Achievements */}
          <div style={{ backgroundColor: '#0A1020', border: '1px solid #263149', borderRadius: '12px', borderLeft: '4px solid #FFD400', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#F7F8FC', margin: 0 }}>{t('rewards_page.achievements')}</h2>
              <a href="/rewards?tab=achievements" style={{ fontSize: '12px', color: '#8B5CF6', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {t('common.view_all')} <ChevronRight style={{ width: '14px', height: '14px' }} />
              </a>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {achievements.slice(0, 4).map(achievement => (
                <div key={achievement.id} style={{ backgroundColor: '#111A2D', border: achievement.status === 'locked' ? '1px solid #263149' : '1px solid #FFD400', borderRadius: '8px', padding: '16px', opacity: achievement.status === 'locked' ? 0.6 : 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '6px', backgroundColor: '#0A1020', marginBottom: '10px' }}>
                    <achievement.icon style={{ width: '24px', height: '24px', color: achievement.status === 'locked' ? '#737C8F' : '#FFD400' }} />
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#F7F8FC', marginBottom: '4px' }}>{achievement.title}</div>
                  <div style={{ fontSize: '10px', color: '#A8B0C0', marginBottom: '8px' }}>{achievement.progress} / {achievement.target}</div>
                  {achievement.status !== 'locked' && (
                    <div style={{ backgroundColor: '#263149', height: '4px', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(100, (achievement.progress / achievement.target) * 100)}%`, height: '100%', backgroundColor: '#FFD400' }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Challenge (4) + Reward Store (8) */}
        <div style={{ display: 'grid', gridTemplateColumns: '4fr 8fr', gap: '16px', marginBottom: '32px' }}>

          {/* Weekly Challenge */}
          <div style={{ backgroundColor: '#0A1020', border: '1px solid #263149', borderRadius: '12px', borderLeft: '4px solid #06B6D4', padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#F7F8FC', margin: 0, marginBottom: '16px' }}>{t('rewards_page.weekly_challenge')}</h2>
            <div style={{ fontSize: '12px', color: '#A8B0C0', marginBottom: '12px' }}>{weeklyChallenge.expiresIn}</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#F7F8FC', marginBottom: '12px' }}>{weeklyChallenge.title}</div>
            <div style={{ fontSize: '12px', color: '#A8B0C0', marginBottom: '8px' }}>{weeklyChallenge.progress} / {weeklyChallenge.target}</div>
            <div style={{ backgroundColor: '#263149', height: '6px', borderRadius: '3px', overflow: 'hidden', marginBottom: '16px' }}>
              <div style={{ width: `${(weeklyChallenge.progress / weeklyChallenge.target) * 100}%`, height: '100%', backgroundColor: '#06B6D4' }} />
            </div>
            <div style={{ backgroundColor: '#111A2D', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', color: '#A8B0C0', marginBottom: '4px' }}>{t('common.reward').toUpperCase()}</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#F7F8FC', display: 'flex', gap: '12px' }}>
                <span>{weeklyChallenge.reward.points} {t('common.points')}</span>
                <span style={{ color: '#A8B0C0' }}>•</span>
                <span>{weeklyChallenge.reward.xp} {t('common.xp')}</span>
              </div>
            </div>
            <button style={{ width: '100%', padding: '10px', backgroundColor: '#06B6D4', color: '#F7F8FC', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
              {t('rewards_page.view_all_challenges')}
            </button>
          </div>

          {/* Reward Store */}
          <div style={{ backgroundColor: '#0A1020', border: '1px solid #263149', borderRadius: '12px', borderLeft: '4px solid #FFD400', padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#F7F8FC', margin: 0, marginBottom: '8px' }}>{t('rewards_page.reward_store')}</h2>
            <p style={{ fontSize: '12px', color: '#A8B0C0', margin: 0, marginBottom: '16px' }}>{t('rewards_page.spend_points_message')}</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              {[
                { title: t('rewards.premium_access'), points: 2000, desc: t('rewards.three_days') },
                { title: t('rewards.jersey_mystery_box'), points: 5000, desc: t('rewards.exclusive_item') },
                { title: t('rewards.amazon_gift_card'), points: 10000, desc: t('rewards.fifty_usd') },
                { title: t('rewards.vip_access'), points: 25000, desc: t('rewards.one_month') },
              ].map((item, idx) => (
                <button key={idx} style={{ backgroundColor: hoveredRewardId === idx ? '#0D1426' : '#111A2D', border: '1px solid #263149', borderRadius: '8px', padding: '12px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={() => setHoveredRewardId(idx)} onMouseLeave={() => setHoveredRewardId(null)}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#A8B0C0', marginBottom: '4px' }}>{item.desc}</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#F7F8FC', marginBottom: '8px' }}>{item.title}</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#FFD400' }}>{item.points.toLocaleString('en-US')} {t('common.points')}</div>
                </button>
              ))}
            </div>

            <button style={{ width: '100%', marginTop: '16px', padding: '10px', backgroundColor: 'transparent', border: '1px solid #263149', color: '#F7F8FC', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              {t('rewards_page.visit_store')} <ArrowRight style={{ width: '14px', height: '14px' }} />
            </button>
          </div>
        </div>

        {/* Leaderboard */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#F7F8FC', margin: 0 }}>{t('rewards_page.leaderboard')}</h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['week', 'month', 'all'] as const).map(period => (
                <button key={period} onClick={() => setLeaderboardPeriod(period)} style={{ padding: '6px 12px', backgroundColor: leaderboardPeriod === period ? '#8B5CF6' : 'transparent', border: leaderboardPeriod === period ? 'none' : '1px solid #263149', color: '#F7F8FC', borderRadius: '6px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize' }}>
                  {period === 'week' ? t('rewards_page.this_week') : period === 'month' ? t('rewards_page.this_month') : t('rewards_page.all_time')}
                </button>
              ))}
            </div>
          </div>

          <div style={{ backgroundColor: '#0A1020', border: '1px solid #263149', borderRadius: '12px', borderLeft: '4px solid #FFD400', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 80px 100px 100px', gap: '16px', padding: '16px', backgroundColor: '#111A2D', borderBottom: '1px solid #263149', fontSize: '11px', fontWeight: 600, color: '#737C8F', textTransform: 'uppercase' }}>
              <div>#</div>
              <div>{t('common.user')}</div>
              <div>{t('common.level')}</div>
              <div style={{ textAlign: 'right' }}>{t('common.points')}</div>
              <div style={{ textAlign: 'right' }}>{t('common.xp')}</div>
            </div>
            {currentLeaderboard.map((user, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 80px 100px 100px', gap: '16px', padding: '16px', borderBottom: idx < currentLeaderboard.length - 1 ? '1px solid #263149' : 'none', backgroundColor: user.isCurrentUser ? 'rgba(6, 182, 212, 0.05)' : user.rank <= 3 ? 'rgba(255, 212, 0, 0.02)' : 'transparent', borderLeft: user.isCurrentUser ? '3px solid #06B6D4' : user.rank === 1 ? '4px solid #FFD400' : 'none', alignItems: 'center' }}>
                <div style={{ fontSize: '14px', fontWeight: 900, color: user.rank === 1 ? '#FFD400' : user.rank === 2 ? '#A8B0C0' : user.rank === 3 ? '#F97316' : '#737C8F' }}>
                  {user.rank === 1 ? <Crown style={{ width: '16px', height: '16px' }} /> : `#${user.rank}`}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#F7F8FC' }}>{user.name}</div>
                <div style={{ fontSize: '12px', color: '#A8B0C0' }}>L{user.level}</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFD400', textAlign: 'right' }}>{user.points.toLocaleString('en-US')}</div>
                <div style={{ fontSize: '12px', color: '#A8B0C0', textAlign: 'right' }}>{user.xp.toLocaleString('en-US')}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#F7F8FC', margin: 0, marginBottom: '16px' }}>{t('rewards_page.recent_activity')}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
            {recentActivity.map(activity => (
              <div key={activity.id} style={{ backgroundColor: '#0A1020', border: '1px solid #263149', borderRadius: '12px', borderLeft: '4px solid #22C55E', padding: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#F7F8FC', marginBottom: '4px' }}>{activity.title}</div>
                <div style={{ fontSize: '12px', color: '#A8B0C0', marginBottom: '8px' }}>{activity.description}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '11px', color: '#737C8F' }}>{activity.timestamp}</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#FFD400' }}>+{activity.points}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Prediction Modal */}
      {predictionModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#0A1020', borderRadius: '12px', padding: '32px', maxWidth: '500px', width: '90%', borderLeft: '4px solid #D4AF37', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#F7F8FC', margin: 0 }}>{t('rewards_page.make_prediction')}</h2>
              <button onClick={() => { setPredictionModalOpen(false); setSelectedOutcome(null); }} style={{ background: 'none', border: 'none', color: '#A8B0C0', cursor: 'pointer', fontSize: '24px', padding: 0 }}>
                <X style={{ width: '24px', height: '24px' }} />
              </button>
            </div>

            <div style={{ backgroundColor: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.2)', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#8B5CF6', textTransform: 'uppercase', marginBottom: '8px' }}>{t('modal.league')}</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#F7F8FC', marginBottom: '4px' }}>{t('modal.match')}</div>
              <div style={{ fontSize: '12px', color: '#A8B0C0' }}>{t('modal.match_info')}</div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                {[
                  { label: t('prediction.home_win'), pct: 58, color: '#38BDF8' },
                  { label: t('prediction.draw'), pct: 22, color: '#D4AF37' },
                  { label: t('prediction.away_win'), pct: 20, color: '#EF4444' },
                ].map((opt, idx) => (
                  <div key={idx} style={{ backgroundColor: `${opt.color}10`, border: `1px solid ${opt.color}40`, borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: '#A8B0C0', marginBottom: '4px' }}>{opt.label}</div>
                    <div style={{ fontSize: '16px', fontWeight: 900, color: opt.color }}>{opt.pct}%</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', height: '6px', borderRadius: '3px', overflow: 'hidden', gap: '1px' }}>
                <div style={{ flex: '0 0 58%', backgroundColor: '#38BDF8' }} />
                <div style={{ flex: '0 0 22%', backgroundColor: '#D4AF37' }} />
                <div style={{ flex: '0 0 20%', backgroundColor: '#EF4444' }} />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#A8B0C0', marginBottom: '12px' }}>{t('rewards_page.choose_prediction')}:</div>
              <div style={{ display: 'grid', gap: '10px' }}>
                {[
                  { key: 'home', label: t('modal.team_home_wins'), color: '#38BDF8' },
                  { key: 'draw', label: t('prediction.draw'), color: '#D4AF37' },
                  { key: 'away', label: t('modal.team_away_wins'), color: '#EF4444' },
                ].map(option => (
                  <button key={option.key} onClick={() => setSelectedOutcome(option.key as any)} style={{ padding: '12px 16px', backgroundColor: selectedOutcome === option.key ? `${option.color}20` : '#111A2D', border: selectedOutcome === option.key ? `2px solid ${option.color}` : '1px solid #263149', borderRadius: '8px', color: option.color, fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button onClick={() => { setPredictionModalOpen(false); setSelectedOutcome(null); }} style={{ padding: '10px 16px', backgroundColor: '#263149', color: '#F7F8FC', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                {t('buttons.cancel')}
              </button>
              <button onClick={handlePredictionSubmit} disabled={!selectedOutcome} style={{ padding: '10px 16px', backgroundColor: selectedOutcome ? '#8B5CF6' : '#737C8F', color: '#F7F8FC', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: selectedOutcome ? 'pointer' : 'not-allowed', opacity: selectedOutcome ? 1 : 0.6 }}>
                {t('buttons.submit')}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
