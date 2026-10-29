'use client'

import { Search, Globe2, ChevronDown, Play, Radio, ArrowRight, Trophy, TrendingUp, Users, Zap, Target } from 'lucide-react'
import Image from 'next/image'
import Footer from '@/components/Footer'
import { useLanguage } from '@/context/LanguageContext'
import { useTranslation } from '@/hooks/useTranslation'
import { useState } from 'react'

export default function Home() {
  const { language, setLanguage } = useLanguage()
  const { t } = useTranslation(language)
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)

  // Debug: Log language changes
  if (typeof window !== 'undefined') {
    console.log('Home page rendered with language:', language)
  }

  const handleNavigation = (path: string) => {
    window.location.href = path
  }

  const languages: Array<{ code: 'en' | 'es' | 'ar'; name: string }> = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'ar', name: 'العربية' },
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050816', color: '#F7F8FC', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* ===== HEADER ===== */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        borderBottom: '1px solid #263149',
        backgroundColor: 'rgba(5, 8, 22, 0.95)',
        backdropFilter: 'blur(10px)',
      }}>
        <div style={{
          maxWidth: '1500px',
          margin: '0 auto',
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '32px',
        }}>
          {/* Logo */}
          <div style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '-0.5px', whiteSpace: 'nowrap' }}>
            WAGER<span style={{ color: '#FFD400' }}>line</span>
          </div>

          {/* Navigation */}
          <nav style={{ display: 'flex', gap: '32px', flex: 1 }}>
            {[
              { name: 'Home', key: 'nav.home' },
              { name: 'Live', key: 'nav.live' },
              { name: 'Sports', key: 'nav.sports' },
              { name: 'Leagues', key: 'nav.leagues' },
              { name: 'Predictions', key: 'nav.predictions' },
              { name: 'News', key: 'nav.news' },
              { name: 'Rewards', key: 'nav.rewards' },
            ].map(item => (
              <a key={item.name} href={item.name === 'Home' ? '/' : `/${item.name.toLowerCase()}`} style={{
                fontSize: '12px',
                fontWeight: 600,
                color: item.name === 'Home' ? '#FFD400' : '#A8B0C0',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'color 0.2s',
                paddingBottom: '4px',
                borderBottom: item.name === 'Home' ? '2px solid #FFD400' : 'none',
              }}>
                {t(item.key)}
              </a>
            ))}
          </nav>

          {/* Right Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', whiteSpace: 'nowrap' }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder={t('header.search')}
                style={{
                  backgroundColor: '#0A1020',
                  border: '1px solid #263149',
                  borderRadius: '8px',
                  padding: '8px 12px 8px 32px',
                  fontSize: '12px',
                  color: '#F7F8FC',
                  width: '200px',
                  outline: 'none',
                }}
              />
              <Search style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#737C8F' }} />
            </div>

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
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
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
                        backgroundColor: language === lang.code ? '#111A2D' : 'transparent',
                        border: 'none',
                        borderRadius: '4px',
                        color: language === lang.code ? '#FFD400' : '#A8B0C0',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        marginBottom: lang.code === 'ar' ? 0 : '2px',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#111A2D'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = language === lang.code ? '#111A2D' : 'transparent'}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            <button style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#F7F8FC',
              background: 'transparent',
              border: '1px solid #263149',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}>
              {t('header.login')}
            </button>

            <button style={{
              fontSize: '12px',
              fontWeight: 900,
              color: '#050816',
              background: '#FFD400',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}>
              {t('header.signup')}
            </button>
          </div>
        </div>
      </header>

      {/* Content wrapper with padding for fixed header */}
      <div style={{ paddingTop: '56px' }}>
        {/* ===== HERO + LIVE MATCH ===== */}
        <div style={{
          maxWidth: '1500px',
          margin: '0 auto',
          padding: '32px',
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '24px',
          marginBottom: '32px',
        }}>
          {/* HERO SECTION */}
          <div style={{
            position: 'relative',
            backgroundColor: '#0A1020',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1200 400%22%3E%3Crect fill=%22%23050816%22 width=%221200%22 height=%22400%22/%3E%3C/svg%3E")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            borderRadius: '12px',
            border: '1px solid #263149',
            padding: '48px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            minHeight: '400px',
            overflow: 'hidden',
          }}>
            {/* Dark overlay for text readability */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '12px',
            }} />

            {/* Hero Content */}
            <div style={{ position: 'relative', zIndex: 10 }}>
              {/* Headline */}
              <h1 style={{
                fontSize: '48px',
                fontWeight: 900,
                lineHeight: '1.1',
                marginBottom: '20px',
                color: '#F7F8FC',
              }}>
                {t('hero.title').split('. ').map((part, idx, arr) => (
                  <span key={idx}>
                    {idx === arr.length - 1 ? <span style={{ color: '#FFD400' }}>{part}.</span> : `${part}.`}
                    {idx < arr.length - 1 && <br />}
                  </span>
                ))}
              </h1>

              {/* Description */}
              <p style={{
                fontSize: '16px',
                color: '#A8B0C0',
                marginBottom: '24px',
                lineHeight: '1.5',
                maxWidth: '400px',
                fontWeight: 500,
              }}>
                {t('hero.subtitle')}
              </p>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => handleNavigation('/live')} style={{
                  backgroundColor: '#FFD400',
                  color: '#050816',
                  fontWeight: 'bold',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}>
                  {t('hero.cta_primary')}
                </button>
                <button onClick={() => handleNavigation('/predictions')} style={{
                  backgroundColor: 'transparent',
                  color: '#F7F8FC',
                  fontWeight: 600,
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: '1px solid #737C8F',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}>
                  {t('hero.cta_secondary')}
                </button>
              </div>
            </div>

            {/* Play Button (bottom-right) */}
            <div style={{
              position: 'absolute',
              bottom: '24px',
              right: '24px',
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 20,
            }}>
              <Play style={{ width: '28px', height: '28px', color: 'white', fill: 'white' }} />
            </div>
          </div>

          {/* LIVE MATCH CARD */}
          <div style={{
            backgroundColor: '#0A1020',
            border: '1px solid #263149',
            borderRadius: '12px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '10px', fontWeight: 600, color: '#737C8F', textTransform: 'uppercase' }}>
                {t('live.title')}
              </span>
              <div style={{
                backgroundColor: '#EF233C',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '10px',
                fontWeight: 'bold',
              }}>
                ● LIVE
              </div>
            </div>

            {/* Competition */}
            <div style={{ fontSize: '10px', color: '#737C8F', fontWeight: 600, marginBottom: '16px' }}>
              Premier League – Round 36
            </div>

            {/* Match Display */}
            <div style={{ marginBottom: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#F7F8FC', marginBottom: '8px' }}>
                Manchester City
              </div>
              <div style={{ fontSize: '48px', fontWeight: 900, color: '#FFD400', marginBottom: '8px' }}>
                2 - 1
              </div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#F7F8FC', marginBottom: '12px' }}>
                Liverpool
              </div>

              {/* Live Indicator */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '10px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22C55E' }} />
                <span style={{ color: '#22C55E', fontWeight: 'bold' }}>LIVE</span>
                <span style={{ color: '#737C8F' }}>75:35</span>
              </div>
            </div>

            {/* Events */}
            <div style={{
              borderTop: '1px solid #263149',
              borderBottom: '1px solid #263149',
              padding: '16px 0',
              marginBottom: '12px',
              fontSize: '10px',
              color: '#737C8F',
              lineHeight: '1.8',
            }}>
              <div>23' Haaland</div>
              <div>45+2' De Bruyne</div>
              <div>37' Salah</div>
            </div>

            {/* Tabs */}
            <div style={{
              display: 'flex',
              gap: '16px',
              borderBottom: '1px solid #263149',
              paddingBottom: '8px',
            }}>
              {['Overview', 'Timeline', 'Stats', 'Lineups'].map((tab, idx) => (
                <button key={tab} style={{
                  fontSize: '10px',
                  fontWeight: 'bold',
                  color: idx === 0 ? '#FFD400' : '#737C8F',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  paddingBottom: '8px',
                  borderBottom: idx === 0 ? '2px solid #FFD400' : 'none',
                }}>
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ===== TOP LEAGUES ===== */}
        <div style={{
          maxWidth: '1500px',
          margin: '0 auto',
          padding: '0 32px',
          marginBottom: '32px',
        }}>
          <div style={{
            backgroundColor: '#0A1020',
            border: '1px solid #263149',
            borderRadius: '12px',
            padding: '24px',
          }}>
            <div style={{ fontSize: '10px', fontWeight: 600, color: '#737C8F', textTransform: 'uppercase', marginBottom: '24px' }}>
              {t('top_leagues.title')}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
              gap: '16px',
            }}>
              {[
                { name: 'Premier League', country: 'England', img: 'PremierLeague.webp' },
                { name: 'La Liga', country: 'Spain', img: 'Laliga.webp' },
                { name: 'Serie A', country: 'Italy', img: 'SerieA.webp' },
                { name: 'Bundesliga', country: 'Germany', img: 'Bundesliga.webp' },
                { name: 'Ligue 1', country: 'France', img: 'Ligue1.webp' },
                { name: 'Süper Lig', country: 'Türkiye', img: 'SüperLig.webp' },
                { name: 'NBA', country: 'USA', img: 'nba.webp' },
                { name: 'NFL', country: 'USA', img: 'AmericanFotball.webp' },
                { name: 'NHL', country: 'Canada', img: 'nhl.webp' },
                { name: 'F1', country: 'World', img: 'formula.webp' },
              ].map(league => (
                <div key={league.name} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '8px',
                  padding: '8px',
                  cursor: 'pointer',
                }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '8px',
                    backgroundColor: '#111A2D',
                    border: '1px solid #263149',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}>
                    <Image
                      src={`/logo/${league.img}`}
                      alt={league.name}
                      width={56}
                      height={56}
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    />
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#F7F8FC' }}>
                    {league.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#A8B0C0' }}>
                    {league.country}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== DASHBOARD GRID ===== */}
        <div style={{
          maxWidth: '1500px',
          margin: '0 auto',
          padding: '0 32px',
          marginBottom: '48px',
        }}>
          {/* ROW 1: 4 equal columns */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            marginBottom: '16px',
          }}>
            {/* LIVE NOW */}
            <div style={{
              backgroundColor: '#0A1020',
              border: '1px solid #263149',
              borderRadius: '12px',
              padding: '16px',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '9px',
                fontWeight: 600,
                color: '#737C8F',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}>
                {t('live.title')}
                <div style={{
                  backgroundColor: 'rgba(239, 35, 60, 0.2)',
                  color: '#EF233C',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '8px',
                }}>
                  ● LIVE
                </div>
              </div>
              {[
                { league: 'Premier League', match: 'Man City 2-1 Liverpool', time: 'LIVE 75\'' },
                { league: 'La Liga', match: 'Real Madrid 3-1 Valencia', time: 'LIVE 60\'' },
                { league: 'Serie A', match: 'Inter 1-0 Juventus', time: 'LIVE 45\'' },
                { league: 'Bundesliga', match: 'Bayern 2-0 Dortmund', time: 'LIVE 30\'' },
              ].map((item, idx) => (
                <div key={idx} style={{
                  fontSize: '11px',
                  color: '#F7F8FC',
                  marginBottom: '12px',
                  paddingBottom: '12px',
                  borderBottom: idx < 3 ? '1px solid #263149' : 'none',
                }}>
                  <div style={{ color: '#A8B0C0', fontSize: '10px', marginBottom: '2px', fontWeight: 500 }}>{item.league}</div>
                  <div style={{ fontWeight: 600, marginBottom: '2px' }}>{item.match}</div>
                  <div style={{ color: '#22C55E', fontSize: '10px', fontWeight: 600 }}>{item.time}</div>
                </div>
              ))}
              <button onClick={() => handleNavigation('/live')} style={{
                color: '#FFD400',
                fontSize: '9px',
                fontWeight: 'bold',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                padding: 0,
              }}>
                {t('live.view_all')}
              </button>
            </div>

            {/* AI PREDICTIONS */}
            <div style={{
              backgroundColor: '#0A1020',
              border: '1px solid #263149',
              borderRadius: '12px',
              padding: '16px',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '9px',
                fontWeight: 600,
                color: '#737C8F',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}>
                {t('predictions.title')}
                <button onClick={() => handleNavigation('/predictions')} style={{ color: '#FFD400', cursor: 'pointer', background: 'none', border: 'none', fontSize: '9px', fontWeight: 600, padding: 0 }}>{t('predictions.see_all')}</button>
              </div>
              {[
                { teams: 'Man City vs Liverpool', league: 'Premier League', h: 58, d: 22, a: 20, conf: 86 },
                { teams: 'Real Madrid vs Barcelona', league: 'La Liga', h: 52, d: 28, a: 20, conf: 84 },
                { teams: 'Inter vs Juventus', league: 'Serie A', h: 55, d: 25, a: 20, conf: 85 },
              ].map((pred, idx) => (
                <div key={idx} style={{
                  marginBottom: '12px',
                  paddingBottom: '12px',
                  borderBottom: idx < 2 ? '1px solid #263149' : 'none',
                }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#F7F8FC', marginBottom: '2px' }}>
                    {pred.teams}
                  </div>
                  <div style={{ fontSize: '11px', color: '#A8B0C0', marginBottom: '6px' }}>
                    {pred.league}
                  </div>
                  {/* Probability Bars */}
                  <div style={{ display: 'flex', gap: '2px', marginBottom: '6px' }}>
                    <div style={{
                      flex: pred.h,
                      height: '4px',
                      backgroundColor: '#38BDF8',
                      borderRadius: '2px',
                    }} />
                    <div style={{
                      flex: pred.d,
                      height: '4px',
                      backgroundColor: '#737C8F',
                      borderRadius: '2px',
                    }} />
                    <div style={{
                      flex: pred.a,
                      height: '4px',
                      backgroundColor: '#EF233C',
                      borderRadius: '2px',
                    }} />
                  </div>
                  <div style={{ fontSize: '8px', color: '#737C8F', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{pred.h}%</span>
                    <span>{pred.d}%</span>
                    <span>{pred.a}%</span>
                  </div>
                  <div style={{
                    fontSize: '8px',
                    backgroundColor: 'rgba(255, 212, 0, 0.2)',
                    color: '#FFD400',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    marginTop: '6px',
                    display: 'inline-block',
                  }}>
                    AI {pred.conf}% Confidence
                  </div>
                </div>
              ))}
            </div>

            {/* LEAGUE TABLE */}
            <div style={{
              backgroundColor: '#0A1020',
              border: '1px solid #263149',
              borderRadius: '12px',
              padding: '16px',
            }}>
              <div style={{
                fontSize: '9px',
                fontWeight: 600,
                color: '#737C8F',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}>
                {t('league_table.title')}
              </div>
              <table style={{ width: '100%', fontSize: '11px', color: '#A8B0C0', marginBottom: '12px' }}>
                <tbody>
                  {[
                    [1, 'Man City', 34, 24, 7, 3, 82, 32, '+50', 79],
                    [2, 'Arsenal', 34, 22, 7, 5, 76, 26, '+47', 73],
                    [3, 'Liverpool', 34, 22, 6, 6, 78, 30, '+48', 72],
                    [4, 'Aston Villa', 34, 18, 7, 9, 54, 42, '+12', 61],
                    [5, 'Tottenham', 34, 17, 6, 11, 62, 47, '+15', 57],
                  ].map((row, idx) => (
                    <tr key={idx} style={{
                      borderBottom: idx < 4 ? '1px solid #263149' : 'none',
                      padding: '6px 0',
                    }}>
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx} style={{
                          padding: '6px 0',
                          textAlign: cellIdx === 1 ? 'left' : 'center',
                          color: cellIdx === 0 ? '#F7F8FC' : '#737C8F',
                          fontWeight: cellIdx <= 1 ? 600 : 400,
                        }}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={() => handleNavigation('/leagues')} style={{
                color: '#FFD400',
                fontSize: '9px',
                fontWeight: 'bold',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                padding: 0,
              }}>
                {t('league_table.view_full')}
              </button>
            </div>

            {/* PLAYER SPOTLIGHT */}
            <div style={{
              backgroundColor: '#0A1020',
              border: '1px solid #263149',
              borderRadius: '12px',
              padding: '16px',
            }}>
              <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '8px',
                  backgroundColor: '#111A2D',
                  margin: '0 auto 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #263149',
                }}>
                  <Users style={{ width: '40px', height: '40px', color: '#FFD400' }} />
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#F7F8FC' }}>
                  Erling Haaland
                </div>
                <div style={{ fontSize: '11px', color: '#A8B0C0' }}>
                  Manchester City
                </div>
                <div style={{ fontSize: '11px', color: '#A8B0C0' }}>
                  Forward
                </div>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                marginBottom: '12px',
              }}>
                {[
                  { label: 'Age', value: '24' },
                  { label: 'Height', value: '194cm' },
                  { label: 'Weight', value: '94kg' },
                ].map(stat => (
                  <div key={stat.label} style={{
                    backgroundColor: '#111A2D',
                    padding: '8px',
                    borderRadius: '6px',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '8px', color: '#737C8F', marginBottom: '2px' }}>
                      {stat.label}
                    </div>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#F7F8FC' }}>
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{
                display: 'flex',
                gap: '8px',
                fontSize: '8px',
                fontWeight: 600,
                borderBottom: '1px solid #263149',
                paddingBottom: '8px',
                marginBottom: '8px',
              }}>
                {['Overview', 'Stats', 'Matches', 'Career', 'News'].map(tab => (
                  <button key={tab} style={{
                    background: 'none',
                    border: 'none',
                    color: tab === 'Overview' ? '#FFD400' : '#737C8F',
                    cursor: 'pointer',
                    fontSize: '8px',
                  }}>
                    {tab}
                  </button>
                ))}
              </div>
              <div style={{ fontSize: '8px', color: '#737C8F', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                <div>Matches: <span style={{ color: '#F7F8FC', fontWeight: 600 }}>28</span></div>
                <div>Goals: <span style={{ color: '#FFD400', fontWeight: 600 }}>27</span></div>
                <div>Assists: <span style={{ color: '#F7F8FC', fontWeight: 600 }}>5</span></div>
                <div>Rating: <span style={{ color: '#F7F8FC', fontWeight: 600 }}>7.91</span></div>
              </div>
            </div>
          </div>

          {/* ROW 2: Asymmetric (1fr + 1fr + 2fr + 1fr) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 2fr 1fr',
            gap: '16px',
          }}>
            {/* TOP NEWS */}
            <div style={{
              backgroundColor: '#0A1020',
              border: '1px solid #263149',
              borderRadius: '12px',
              padding: '16px',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '9px',
                fontWeight: 600,
                color: '#737C8F',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}>
                {t('top_news.title')}
                <button onClick={() => handleNavigation('/news')} style={{ color: '#FFD400', cursor: 'pointer', background: 'none', border: 'none', fontSize: '9px', fontWeight: 600, padding: 0 }}>{t('top_news.view_all')}</button>
              </div>
              {[
                { cat: 'PREMIER LEAGUE', title: 'Haaland double helps Man City win', time: '2h ago' },
                { cat: 'LA LIGA', title: 'Mbappé impacts Real Madrid victory', time: '4h ago' },
                { cat: 'SERIE A', title: 'Inter extends winning streak', time: '6h ago' },
              ].map((news, idx) => (
                <div key={idx} style={{
                  marginBottom: '12px',
                  paddingBottom: '12px',
                  borderBottom: idx < 2 ? '1px solid #263149' : 'none',
                }}>
                  <div style={{
                    width: '100%',
                    height: '80px',
                    backgroundColor: '#111A2D',
                    borderRadius: '6px',
                    marginBottom: '8px',
                    border: '1px solid #263149',
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #263149 10px, #263149 20px)',
                  }} />
                  <div style={{ fontSize: '11px', color: '#FFD400', fontWeight: 700, marginBottom: '3px' }}>
                    {news.cat}
                  </div>
                  <div style={{ fontSize: '12px', color: '#F7F8FC', fontWeight: 600, marginBottom: '3px', lineHeight: 1.3 }}>
                    {news.title}
                  </div>
                  <div style={{ fontSize: '10px', color: '#A8B0C0' }}>
                    {news.time}
                  </div>
                </div>
              ))}
            </div>

            {/* YOUR REWARDS */}
            <div style={{
              backgroundColor: '#0A1020',
              border: '1px solid #263149',
              borderRadius: '12px',
              padding: '16px',
            }}>
              <div style={{
                backgroundColor: '#111A2D',
                padding: '12px',
                borderRadius: '8px',
                textAlign: 'center',
                marginBottom: '12px',
              }}>
                <div style={{ fontSize: '8px', color: '#737C8F', marginBottom: '4px' }}>
                  Level
                </div>
                <div style={{ fontSize: '36px', fontWeight: 900, color: '#FFD400' }}>
                  7
                </div>
                <div style={{ fontSize: '10px', color: '#F7F8FC' }}>
                  Elite Fan
                </div>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '8px',
                color: '#737C8F',
                marginBottom: '6px',
              }}>
                <span>Next Level XP</span>
                <span style={{ color: '#FFD400' }}>2,450 / 3,000</span>
              </div>
              <div style={{
                width: '100%',
                height: '4px',
                backgroundColor: '#111A2D',
                borderRadius: '2px',
                overflow: 'hidden',
                marginBottom: '12px',
              }}>
                <div style={{
                  width: '82%',
                  height: '100%',
                  backgroundColor: '#FFD400',
                }} />
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                fontSize: '8px',
                color: '#737C8F',
              }}>
                <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#111A2D', borderRadius: '6px' }}>
                  <div>Badges</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#F7F8FC' }}>12</div>
                </div>
                <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#111A2D', borderRadius: '6px' }}>
                  <div>Points</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#F7F8FC' }}>2,450</div>
                </div>
                <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#111A2D', borderRadius: '6px' }}>
                  <div>Rank</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#F7F8FC' }}>#3,210</div>
                </div>
              </div>
            </div>

            {/* NEWS WIDGET (spans 2 columns) */}
            <div style={{
              backgroundColor: '#0A1020',
              border: '1px solid #263149',
              borderRadius: '12px',
              padding: '16px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
            }}>
              {/* Featured */}
              <div>
                <div style={{
                  width: '100%',
                  height: '140px',
                  backgroundColor: '#111A2D',
                  borderRadius: '8px',
                  marginBottom: '8px',
                  border: '1px solid #263149',
                  backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #263149 10px, #263149 20px)',
                }} />
                <div style={{ fontSize: '11px', color: '#FFD400', fontWeight: 700, marginBottom: '4px' }}>
                  LA LIGA
                </div>
                <div style={{ fontSize: '13px', color: '#F7F8FC', fontWeight: 600, marginBottom: '4px', lineHeight: 1.3 }}>
                  Mbappé returns as Real Madrid win big
                </div>
                <div style={{ fontSize: '11px', color: '#A8B0C0' }}>
                  4 hours ago
                </div>
              </div>

              {/* Sidebar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  'NBA Playoffs: Celtics take control',
                  'NFL Draft 2026: Top prospects watch',
                  'F1 Standings: Verstappen extends lead',
                ].map((article, idx) => (
                  <div key={idx} style={{
                    fontSize: '11px',
                    color: '#F7F8FC',
                    borderLeft: '3px solid #FFD400',
                    paddingLeft: '12px',
                    lineHeight: 1.4,
                  }}>
                    {article}
                  </div>
                ))}
              </div>
            </div>

            {/* REWARDS WIDGET */}
            <div style={{
              backgroundColor: '#0A1020',
              border: '1px solid #263149',
              borderRadius: '12px',
              padding: '16px',
            }}>
              {/* Section 1: Balance */}
              <div style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #263149' }}>
                <div style={{ fontSize: '10px', color: '#A8B0C0', marginBottom: '4px', fontWeight: 500 }}>
                  {t('rewards.balance')}
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFD400', marginBottom: '4px' }}>
                  2,450 Points
                </div>
                <div style={{ fontSize: '11px', color: '#FFD400', cursor: 'pointer', fontWeight: 600 }}>
                  How to Earn →
                </div>
              </div>

              {/* Section 2: Daily Tasks */}
              <div style={{ marginBottom: '12px', fontSize: '11px' }}>
                <div style={{ color: '#A8B0C0', fontWeight: 600, marginBottom: '6px' }}>
                  {t('rewards.daily_tasks')}
                </div>
                {[
                  { task: 'Login to platform', done: true },
                  { task: 'View 3 live matches', done: true },
                  { task: 'Make a prediction', done: false },
                  { task: 'Read a news article', done: false },
                ].map((item, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '3px',
                    color: '#737C8F',
                  }}>
                    <span>{item.task}</span>
                    <span style={{ color: item.done ? '#22C55E' : '#737C8F' }}>
                      {item.done ? '✓' : '○'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button onClick={() => handleNavigation('/rewards')} style={{
                  width: '100%',
                  backgroundColor: '#FFD400',
                  color: '#050816',
                  fontWeight: 'bold',
                  padding: '10px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}>
                  {t('rewards.view_all')}
                </button>
                <button onClick={() => handleNavigation('/rewards')} style={{
                  width: '100%',
                  backgroundColor: 'transparent',
                  color: '#F7F8FC',
                  fontWeight: 600,
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #263149',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}>
                  {t('rewards.leaderboard')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  )
}
