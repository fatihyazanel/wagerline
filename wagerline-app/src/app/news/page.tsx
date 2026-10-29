'use client'

import Footer from '@/components/Footer'
import { Search, Eye, ChevronDown, Globe2, ExternalLink, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useLanguage } from '@/context/LanguageContext'
import { useTranslation } from '@/hooks/useTranslation'

interface NewsArticle {
  id: number
  title: string
  description: string
  image_url?: string
  source: string
  content: string
  published_at: string
  created_at: string
}

export default function News() {
  const { language, setLanguage } = useLanguage()
  const { t } = useTranslation(language)
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSports, setSelectedSports] = useState<string[]>([])
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([])
  const [sportDropdownOpen, setSportDropdownOpen] = useState(false)
  const [leagueDropdownOpen, setLeagueDropdownOpen] = useState(false)
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)

  const languages: Array<{ code: 'en' | 'es' | 'ar'; name: string }> = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'ar', name: 'العربية' },
  ]

  const sports = ['Football', 'Basketball', 'Tennis', 'Cricket', 'Baseball', 'Rugby']
  const leagues = ['Premier League', 'La Liga', 'Bundesliga', 'Serie A', 'Ligue 1', 'NBA', 'MLB', 'other']

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true)
        const response = await fetch('http://localhost:3001/api/v1/news?limit=50')
        if (!response.ok) throw new Error('Failed to fetch news')
        const data = await response.json()
        setArticles(data.data || [])
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch news')
        setArticles([])
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  const toggleSport = (sport: string) => {
    setSelectedSports(prev => {
      const updated = prev.includes(sport) ? prev.filter(s => s !== sport) : [...prev, sport]
      if (updated.length > 0) setSportDropdownOpen(false)
      return updated
    })
  }

  const toggleLeague = (league: string) => {
    setSelectedLeagues(prev => {
      const updated = prev.includes(league) ? prev.filter(l => l !== league) : [...prev, league]
      if (updated.length > 0) setLeagueDropdownOpen(false)
      return updated
    })
  }

  const filteredArticles = articles.filter(article => {
    const matchesSearch = searchQuery === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  const featuredArticle = filteredArticles[0]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getImageEmoji = (source: string, title: string) => {
    const emojis = ['⚽', '🏀', '🎾', '🏏', '⚾', '🏉', '⛳', '🚴', '🥊', '🏐']
    return emojis[Math.floor(Math.random() * emojis.length)]
  }

  const stripHTML = (html: string) => {
    const div = document.createElement('div')
    div.innerHTML = html
    return div.textContent || div.innerText || ''
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050816', color: '#F7F8FC', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Fixed Header */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, borderBottom: '1px solid #263149', backgroundColor: 'rgba(5, 8, 22, 0.95)', backdropFilter: 'blur(10px)', padding: '16px 32px' }}>
        <div style={{ maxWidth: '1500px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '18px', fontWeight: 900 }}>WAGER<span style={{ color: '#FFD400' }}>line</span></div>
          <nav style={{ display: 'flex', gap: '32px', flex: 1, marginLeft: '32px' }}>
            {[
              { key: 'nav.home', href: '/' },
              { key: 'nav.live', href: '/live' },
              { key: 'nav.sports', href: '/sports' },
              { key: 'nav.leagues', href: '/leagues' },
              { key: 'nav.predictions', href: '/predictions' },
              { key: 'nav.news', href: '/news' },
              { key: 'nav.rewards', href: '/rewards' }
            ].map(item => (
              <a key={item.key} href={item.href} style={{
                fontSize: '12px', fontWeight: 600, color: item.key === 'nav.news' ? '#FFD400' : '#A8B0C0',
                textDecoration: 'none', cursor: 'pointer', paddingBottom: '4px',
                borderBottom: item.key === 'nav.news' ? '2px solid #FFD400' : 'none',
              }}>
                {t(item.key)}
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
                      backgroundColor: language === lang.code ? '#111A2D' : 'transparent',
                      border: 'none',
                      borderRadius: '4px',
                      color: language === lang.code ? '#FFD400' : '#A8B0C0',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
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
        </div>
      </header>

      {/* Hero Banner with Background Image */}
      <div style={{
        marginTop: '64px',
        backgroundImage: 'url(/logo/news.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingBottom: '40px',
        minHeight: '320px'
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(5, 8, 22, 0.5)' }} />
        <div style={{ position: 'relative', maxWidth: '1500px', width: '100%', margin: '0 auto', paddingLeft: '32px', paddingRight: '32px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 900, color: '#FFD400', margin: 0, marginBottom: '16px' }}>{t('news_page.title')}</h1>
          <p style={{ fontSize: '14px', color: '#A8B0C0', margin: 0, marginBottom: '24px' }}>{t('news_page.subtitle')}</p>
          {/* Search in Hero */}
          <div style={{ display: 'flex', gap: '8px', backgroundColor: '#0A1020', border: '1px solid #263149', borderRadius: '12px', padding: '12px 16px', alignItems: 'center', maxWidth: '600px' }}>
            <Search style={{ width: '20px', height: '20px', color: '#A8B0C0' }} />
            <input
              type="text"
              placeholder={t('news_page.search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1, backgroundColor: 'transparent', border: 'none', color: '#F7F8FC', fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1500px', margin: '0 auto', padding: '40px 32px' }}>

        {/* Sport & League Filters - Minimal */}
        <div style={{ marginBottom: '32px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          {/* Sport Filter */}
          <div style={{ position: 'relative', flex: 1 }}>
            <button
              onClick={() => setSportDropdownOpen(!sportDropdownOpen)}
              style={{
                padding: '8px 12px',
                backgroundColor: 'transparent',
                color: '#F7F8FC',
                border: 'none',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span style={{ color: selectedSports.length > 0 ? '#FFD400' : '#A8B0C0' }}>
                {t('news_page.sport')} {selectedSports.length > 0 && `(${selectedSports.length})`}
              </span>
              <ChevronDown style={{ width: '14px', height: '14px', transform: sportDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
            </button>

            {/* Sport Dropdown */}
            {sportDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                backgroundColor: '#0A1020',
                border: '1px solid #263149',
                borderRadius: '8px',
                padding: '12px',
                marginTop: '4px',
                zIndex: 500,
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
                minWidth: '200px'
              }}>
                {sports.map(sport => (
                  <label key={sport} style={{ display: 'flex', alignItems: 'center', padding: '8px', cursor: 'pointer', borderRadius: '4px', marginBottom: '2px' }}>
                    <input
                      type="checkbox"
                      checked={selectedSports.includes(sport)}
                      onChange={() => toggleSport(sport)}
                      style={{ marginRight: '8px', cursor: 'pointer', accentColor: '#FFD400' }}
                    />
                    <span style={{ fontSize: '12px', color: '#F7F8FC', fontWeight: 500 }}>{sport}</span>
                  </label>
                ))}
                {selectedSports.length > 0 && (
                  <button
                    onClick={() => setSelectedSports([])}
                    style={{
                      width: '100%',
                      padding: '6px',
                      backgroundColor: 'rgba(255, 212, 0, 0.05)',
                      border: 'none',
                      color: '#FFD400',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      marginTop: '8px'
                    }}
                  >
                    {t('news_page.clear')}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* League Filter */}
          <div style={{ position: 'relative', flex: 1 }}>
            <button
              onClick={() => setLeagueDropdownOpen(!leagueDropdownOpen)}
              style={{
                padding: '8px 12px',
                backgroundColor: 'transparent',
                color: '#F7F8FC',
                border: 'none',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span style={{ color: selectedLeagues.length > 0 ? '#06B6D4' : '#A8B0C0' }}>
                {t('news_page.league')} {selectedLeagues.length > 0 && `(${selectedLeagues.length})`}
              </span>
              <ChevronDown style={{ width: '14px', height: '14px', transform: leagueDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
            </button>

            {/* League Dropdown */}
            {leagueDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                backgroundColor: '#0A1020',
                border: '1px solid #263149',
                borderRadius: '8px',
                padding: '12px',
                marginTop: '4px',
                zIndex: 500,
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
                minWidth: '200px',
                maxHeight: '300px',
                overflowY: 'auto'
              }}>
                {leagues.map(league => (
                  <label key={league} style={{ display: 'flex', alignItems: 'center', padding: '8px', cursor: 'pointer', borderRadius: '4px', marginBottom: '2px' }}>
                    <input
                      type="checkbox"
                      checked={selectedLeagues.includes(league)}
                      onChange={() => toggleLeague(league)}
                      style={{ marginRight: '8px', cursor: 'pointer', accentColor: '#06B6D4' }}
                    />
                    <span style={{ fontSize: '12px', color: '#F7F8FC', fontWeight: 500 }}>{league}</span>
                  </label>
                ))}
                {selectedLeagues.length > 0 && (
                  <button
                    onClick={() => setSelectedLeagues([])}
                    style={{
                      width: '100%',
                      padding: '6px',
                      backgroundColor: 'rgba(6, 182, 212, 0.05)',
                      border: 'none',
                      color: '#06B6D4',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      marginTop: '8px'
                    }}
                  >
                    {t('news_page.clear')}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ backgroundColor: '#0A1020', border: '1px solid #263149', borderRadius: '12px', padding: '40px', textAlign: 'center' }}>
            <p style={{ color: '#A8B0C0', fontSize: '14px' }}>Loading news...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={{ backgroundColor: '#0A1020', border: '1px solid #EF4444', borderRadius: '12px', padding: '24px', marginBottom: '48px' }}>
            <p style={{ color: '#FCA5A5', fontSize: '14px', margin: 0 }}>⚠️ {error}</p>
            <p style={{ color: '#A8B0C0', fontSize: '12px', marginTop: '8px' }}>Make sure the backend server is running on http://localhost:3001</p>
          </div>
        )}

        {/* Featured Article */}
        {!loading && featuredArticle && (
          <div style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: '#F7F8FC' }}>{t('news_page.featured_story')}</h2>
            <div onClick={() => setSelectedArticle(featuredArticle)} style={{ backgroundColor: '#0A1020', border: '2px solid #FFD400', borderRadius: '12px', padding: '24px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s ease' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#FFD400', textTransform: 'uppercase', marginBottom: '8px' }}>{featuredArticle.source}</div>
                <h3 style={{ fontSize: '28px', fontWeight: 900, color: '#F7F8FC', marginBottom: '12px', lineHeight: '1.3' }}>{featuredArticle.title}</h3>
                <p style={{ fontSize: '14px', color: '#A8B0C0', marginBottom: '16px', maxHeight: '60px', overflow: 'hidden' }}>{stripHTML(featuredArticle.description).substring(0, 180)}</p>
                <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#737C8F' }}>
                  <span>{formatDate(featuredArticle.published_at)}</span>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Detayları aç <ExternalLink style={{ width: '14px', height: '14px' }} /></span>
                </div>
              </div>
              <div style={{ borderRadius: '8px', overflow: 'hidden', height: '200px', backgroundColor: '#111A2D' }}>
                {featuredArticle.image_url ? (
                  <img src={featuredArticle.image_url} alt={featuredArticle.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>{getImageEmoji(featuredArticle.source, featuredArticle.title)}</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Latest News Grid */}
        {!loading && filteredArticles.length > 0 && (
          <div style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: '#F7F8FC' }}>{t('news_page.latest_news')} ({filteredArticles.length})</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {filteredArticles.map((article) => (
                <div key={article.id} onClick={() => setSelectedArticle(article)} style={{ backgroundColor: '#0A1020', border: '1px solid #263149', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s ease', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ width: '100%', height: '200px', backgroundColor: '#111A2D', overflow: 'hidden' }}>
                    {article.image_url ? (
                      <img src={article.image_url} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px' }}>
                        {getImageEmoji(article.source, article.title)}
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ fontSize: '10px', fontWeight: 700, color: '#FFD400', textTransform: 'uppercase' }}>{article.source}</div>
                      <div style={{ fontSize: '10px', color: '#737C8F' }}>Sports</div>
                    </div>
                    <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#F7F8FC', marginBottom: '12px', lineHeight: '1.4', minHeight: '42px', flex: 1 }}>{article.title}</h3>
                    <p style={{ fontSize: '11px', color: '#A8B0C0', marginBottom: '12px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{stripHTML(article.description)}</p>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: '#737C8F' }}>
                      <span>{formatDate(article.published_at)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && filteredArticles.length === 0 && !error && (
          <div style={{ backgroundColor: '#0A1020', border: '1px solid #263149', borderRadius: '12px', padding: '40px', textAlign: 'center', marginBottom: '48px' }}>
            <p style={{ color: '#A8B0C0', fontSize: '14px' }}>No articles found matching your search.</p>
          </div>
        )}

        {/* News Stats */}
        {!loading && articles.length > 0 && (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: '#F7F8FC' }}>News Statistics</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
              <div style={{ backgroundColor: '#0A1020', border: '1px solid #263149', borderRadius: '12px', padding: '24px' }}>
                <div style={{ fontSize: '32px', fontWeight: 900, color: '#FFD400', marginBottom: '8px' }}>{articles.length}</div>
                <div style={{ fontSize: '14px', color: '#F7F8FC', fontWeight: 600 }}>Total Articles</div>
                <div style={{ fontSize: '11px', color: '#737C8F', marginTop: '4px' }}>from Guardian Sport</div>
              </div>
              <div style={{ backgroundColor: '#0A1020', border: '1px solid #263149', borderRadius: '12px', padding: '24px' }}>
                <div style={{ fontSize: '32px', fontWeight: 900, color: '#06B6D4', marginBottom: '8px' }}>Today</div>
                <div style={{ fontSize: '14px', color: '#F7F8FC', fontWeight: 600 }}>Latest Update</div>
                <div style={{ fontSize: '11px', color: '#737C8F', marginTop: '4px' }}>{formatDate(articles[0]?.published_at || new Date().toISOString())}</div>
              </div>
              <div style={{ backgroundColor: '#0A1020', border: '1px solid #263149', borderRadius: '12px', padding: '24px' }}>
                <div style={{ fontSize: '32px', fontWeight: 900, color: '#34D399', marginBottom: '8px' }}>Multiple</div>
                <div style={{ fontSize: '14px', color: '#F7F8FC', fontWeight: 600 }}>Sports Covered</div>
                <div style={{ fontSize: '11px', color: '#737C8F', marginTop: '4px' }}>Football, Tennis, Cricket & more</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: '#0A1020', borderRadius: '16px', maxWidth: '700px', width: '100%', maxHeight: '90vh', overflow: 'auto', border: '1px solid #263149' }}>
            {/* Close Button */}
            <div style={{ position: 'sticky', top: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #263149', backgroundColor: '#0A1020', zIndex: 10 }}>
              <h2 style={{ color: '#FFD400', fontSize: '18px', fontWeight: 700, margin: 0 }}>Haber Detayları</h2>
              <button onClick={() => setSelectedArticle(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A8B0C0', padding: 0 }}>
                <X style={{ width: '24px', height: '24px' }} />
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '24px' }}>
              {/* Image */}
              {selectedArticle.image_url && (
                <img src={selectedArticle.image_url} alt={selectedArticle.title} style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '8px', marginBottom: '20px' }} />
              )}

              {/* Meta Info */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#FFD400', backgroundColor: 'rgba(255, 212, 0, 0.1)', padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                  {selectedArticle.source}
                </span>
                <span style={{ fontSize: '12px', color: '#737C8F' }}>{formatDate(selectedArticle.published_at)}</span>
              </div>

              {/* Title */}
              <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#F7F8FC', marginBottom: '16px', lineHeight: '1.4' }}>
                {selectedArticle.title}
              </h1>

              {/* Description */}
              <div style={{ fontSize: '14px', color: '#A8B0C0', marginBottom: '20px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                {stripHTML(selectedArticle.description)}
              </div>

              {/* External Link Button */}
              <a href={selectedArticle.content} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'inline-block' }}>
                <button style={{
                  backgroundColor: '#FFD400',
                  color: '#050816',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}>
                  Tam Haberi Oku
                  <ExternalLink style={{ width: '16px', height: '16px' }} />
                </button>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
