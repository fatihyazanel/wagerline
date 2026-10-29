export const sports = [
  { slug: 'football', name_key: 'sports.football', icon: 'soccer' },
  { slug: 'basketball', name_key: 'sports.basketball', icon: 'basketball' },
  { slug: 'american-football', name_key: 'sports.american_football', icon: 'football' },
  { slug: 'ice-hockey', name_key: 'sports.ice_hockey', icon: 'hockey' },
  { slug: 'formula-1', name_key: 'sports.formula_1', icon: 'car' },
]

export const competitions = [
  // Football
  { sport_slug: 'football', slug: 'premier-league', name_key: 'competitions.premier_league', external_provider: 'sportdb', external_id: '133602' },
  { sport_slug: 'football', slug: 'la-liga', name_key: 'competitions.la_liga', external_provider: 'sportdb', external_id: '133603' },
  { sport_slug: 'football', slug: 'serie-a', name_key: 'competitions.serie_a', external_provider: 'sportdb', external_id: '133604' },
  { sport_slug: 'football', slug: 'bundesliga', name_key: 'competitions.bundesliga', external_provider: 'sportdb', external_id: '133605' },
  { sport_slug: 'football', slug: 'ligue-1', name_key: 'competitions.ligue_1', external_provider: 'sportdb', external_id: '133606' },
  { sport_slug: 'football', slug: 'super-lig', name_key: 'competitions.super_lig', external_provider: 'sportdb', external_id: '133609' },
  // Basketball
  { sport_slug: 'basketball', slug: 'nba', name_key: 'competitions.nba', external_provider: 'sportdb', external_id: '133602' },
  // American Football
  { sport_slug: 'american-football', slug: 'nfl', name_key: 'competitions.nfl', external_provider: 'sportdb', external_id: '133602' },
  // Ice Hockey
  { sport_slug: 'ice-hockey', slug: 'nhl', name_key: 'competitions.nhl', external_provider: 'sportdb', external_id: '133602' },
  // Formula 1
  { sport_slug: 'formula-1', slug: 'formula-1', name_key: 'competitions.formula_1', external_provider: 'ergast', external_id: 'f1' },
]

export const teams = [
  // Premier League
  { sport_slug: 'football', slug: 'arsenal', logo_url: '/logos/arsenal.png', en: 'Arsenal FC', es: 'Arsenal FC', ar: 'أرسنال' },
  { sport_slug: 'football', slug: 'chelsea', logo_url: '/logos/chelsea.png', en: 'Chelsea FC', es: 'Chelsea FC', ar: 'تشيلسي' },
  { sport_slug: 'football', slug: 'manchester-city', logo_url: '/logos/man-city.png', en: 'Manchester City', es: 'Manchester City', ar: 'مانشستر سيتي' },
  { sport_slug: 'football', slug: 'manchester-united', logo_url: '/logos/man-utd.png', en: 'Manchester United', es: 'Manchester United', ar: 'مانشستر يونايتد' },
  { sport_slug: 'football', slug: 'liverpool', logo_url: '/logos/liverpool.png', en: 'Liverpool FC', es: 'Liverpool FC', ar: 'ليفربول' },
  { sport_slug: 'football', slug: 'tottenham', logo_url: '/logos/tottenham.png', en: 'Tottenham Hotspur', es: 'Tottenham Hotspur', ar: 'توتنهام' },
  { sport_slug: 'football', slug: 'newcastle', logo_url: '/logos/newcastle.png', en: 'Newcastle United', es: 'Newcastle United', ar: 'نيوكاسل' },
  { sport_slug: 'football', slug: 'brighton', logo_url: '/logos/brighton.png', en: 'Brighton & Hove Albion', es: 'Brighton & Hove Albion', ar: 'برايتون' },
]

export const seasons = [
  { competition_slug: 'premier-league', name: '2025-26', start_date: '2025-08-01', end_date: '2026-05-31', is_current: true },
  { competition_slug: 'la-liga', name: '2025-26', start_date: '2025-08-15', end_date: '2026-05-31', is_current: true },
  { competition_slug: 'nba', name: '2025-26', start_date: '2025-10-01', end_date: '2026-06-30', is_current: true },
]

export const levels = [
  { level_number: 1, name: 'Novice', min_xp: 0, max_xp: 500 },
  { level_number: 2, name: 'Amateur', min_xp: 500, max_xp: 1500 },
  { level_number: 3, name: 'Enthusiast', min_xp: 1500, max_xp: 3000 },
  { level_number: 4, name: 'Expert', min_xp: 3000, max_xp: 6000 },
  { level_number: 5, name: 'Master', min_xp: 6000, max_xp: 10000 },
]
