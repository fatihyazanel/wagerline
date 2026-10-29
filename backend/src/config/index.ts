import dotenv from 'dotenv'

dotenv.config()

export const config = {
  // App
  app: {
    port: parseInt(process.env.API_PORT || '3001'),
    host: process.env.API_HOST || '0.0.0.0',
    env: process.env.NODE_ENV || 'development',
    defaultLanguage: process.env.DEFAULT_LANGUAGE || 'en',
  },

  // Database
  database: {
    path: process.env.DATABASE_PATH || './data/wagerline.db',
  },

  // Provider Configuration
  providers: {
    // SportDB
    sportdb: {
      name: 'SportDB',
      baseUrl: 'https://api.sportdb.dev/api',
      apiKey: process.env.SPORTDB_KEY || '',
      priority: 1,
      rateLimit: 100, // requests per minute
      enabled: !!process.env.SPORTDB_KEY,
      endpoints: {
        flashscore: '/flashscore/football',
        transfermarkt: '/transfermarkt/countries',
      },
    },

    // SportScore
    sportscore: {
      name: 'SportScore',
      baseUrl: 'https://sportscore.com/api/widget',
      apiKey: process.env.SPORTSCORE_KEY || '',
      priority: 2,
      rateLimit: 150,
      enabled: !!process.env.SPORTSCORE_KEY,
      endpoints: {
        matches: '/matches',
        competitions: '/competitions',
      },
    },

    // TheSportsDB
    thesportsdb: {
      name: 'TheSportsDB',
      baseUrl: 'https://www.thesportsdb.com/api/v1/json',
      apiKey: process.env.THESPORTSDB_KEY || '123', // Public API doesn't require key
      priority: 3,
      rateLimit: 100,
      enabled: true,
      endpoints: {
        eventslast: '/eventslast.php',
        teams: '/teams.php',
      },
    },

    // API-Sports
    apisports: {
      name: 'API-Sports',
      baseUrl: 'https://v3.football.api-sports.io',
      apiKey: process.env.API_SPORTS_KEY || '',
      priority: 4,
      rateLimit: 100,
      enabled: !!process.env.API_SPORTS_KEY,
      endpoints: {
        fixtures: '/fixtures',
        standings: '/standings',
        statistics: '/fixtures/statistics',
        teams: '/teams',
      },
    },
  },

  // Provider Priority by Sport
  providerPriority: {
    football: ['sportscore', 'apisports', 'thesportsdb', 'sportdb'],
    basketball: ['apisports', 'sportscore'],
    'american-football': ['apisports', 'sportscore'],
    'ice-hockey': ['apisports', 'sportscore'],
    'formula-1': ['sportscore', 'sportdb'],
  },

  // Cache Configuration
  cache: {
    ttl: {
      sports: 7 * 24 * 60 * 60, // 7 days
      competitions: 24 * 60 * 60, // 24 hours
      teams: 24 * 60 * 60,
      players: 24 * 60 * 60,
      events_finished: 30 * 24 * 60 * 60, // 30 days
      events_upcoming: 5 * 60, // 5 minutes
      events_live: 15, // 15 seconds
      standings: 60 * 60, // 1 hour
      news: 30 * 60, // 30 minutes
    },
  },

  // Sync Job Configuration
  sync: {
    daily: {
      hour: 2, // 2 AM
      jobs: ['sports', 'competitions', 'teams', 'players', 'standings'],
    },
    hourly: {
      interval: 60, // 60 minutes
      jobs: ['events', 'results', 'news'],
    },
    live: {
      interval: 10, // 10 seconds for active events only
      maxConcurrent: 5,
    },
  },

  // Feature Flags
  features: {
    mockData: process.env.MOCK_DATA === 'true',
    livePolling: process.env.LIVE_POLLING !== 'false',
    predictions: process.env.PREDICTIONS_ENABLED !== 'false',
    gamification: process.env.GAMIFICATION_ENABLED !== 'false',
  },

  // API Configuration
  api: {
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      credentials: true,
    },
    requestTimeout: 30000, // 30 seconds
    maxBodySize: '1mb',
  },
}

export type Config = typeof config
