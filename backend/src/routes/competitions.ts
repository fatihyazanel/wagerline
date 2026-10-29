import { FastifyInstance } from 'fastify'
import { db } from '../database/init'

export const competitionsRoutes = async (app: FastifyInstance) => {
  // GET /api/v1/competitions
  app.get('/', async (request, reply) => {
    const language = (request.query as any)?.lang || 'en'
    const sportId = (request.query as any)?.sport_id

    let query = `
      SELECT
        c.id,
        c.sport_id,
        c.slug,
        c.name_key,
        s.name_key as sport_name,
        COUNT(DISTINCT t.id) as team_count,
        MAX(e.start_time) as last_event_time
      FROM competitions c
      JOIN sports s ON c.sport_id = s.id
      LEFT JOIN teams t ON c.id = t.id
      LEFT JOIN events e ON c.id = e.competition_id
      WHERE c.active = 1
    `

    const params: any[] = []

    if (sportId) {
      query += ` AND c.sport_id = ?`
      params.push(sportId)
    }

    query += ` GROUP BY c.id ORDER BY c.name_key`

    const competitions = db.prepare(query).all(...params)

    return {
      data: competitions,
      meta: {
        language,
        total: competitions.length,
        timestamp: new Date().toISOString(),
      },
    }
  })

  // GET /api/v1/competitions/:slug
  app.get('/:slug', async (request, reply) => {
    const { slug } = request.params as { slug: string }
    const language = (request.query as any)?.lang || 'en'

    const competition = db.prepare(`
      SELECT
        c.id,
        c.sport_id,
        c.slug,
        c.name_key,
        s.name_key as sport_name,
        c.country_id,
        c.active,
        COUNT(DISTINCT t.id) as team_count,
        COUNT(DISTINCT e.id) as event_count
      FROM competitions c
      JOIN sports s ON c.sport_id = s.id
      LEFT JOIN teams t ON c.id = t.id
      LEFT JOIN events e ON c.id = e.competition_id
      WHERE c.slug = ?
      GROUP BY c.id
    `).get(slug)

    if (!competition) {
      return reply.code(404).send({
        error: {
          code: 'COMPETITION_NOT_FOUND',
          message: 'Competition not found',
        },
      })
    }

    return {
      data: competition,
      meta: {
        language,
        timestamp: new Date().toISOString(),
      },
    }
  })

  // GET /api/v1/competitions/:slug/standings
  app.get('/:slug/standings', async (request, reply) => {
    const { slug } = request.params as { slug: string }

    const competition = db.prepare('SELECT id FROM competitions WHERE slug = ?').get(slug) as any

    if (!competition) {
      return reply.code(404).send({
        error: {
          code: 'COMPETITION_NOT_FOUND',
          message: 'Competition not found',
        },
      })
    }

    const standings = db.prepare(`
      SELECT
        se.position,
        se.played,
        se.won,
        se.drawn,
        se.lost,
        se.points,
        t.id as team_id,
        t.slug as team_slug,
        t.logo_url,
        tt.name as team_name
      FROM standing_entries se
      JOIN standings s ON se.standing_id = s.id
      JOIN teams t ON se.team_id = t.id
      LEFT JOIN team_translations tt ON t.id = tt.team_id AND tt.language = ?
      WHERE s.competition_id = ?
      ORDER BY se.position ASC
    `).all('en', competition.id)

    return {
      data: standings,
      meta: {
        timestamp: new Date().toISOString(),
      },
    }
  })

  // GET /api/v1/competitions/:slug/matches
  app.get('/:slug/matches', async (request, reply) => {
    const { slug } = request.params as { slug: string }
    const limit = Math.min(parseInt((request.query as any)?.limit || '10'), 100)

    const competition = db.prepare('SELECT id FROM competitions WHERE slug = ?').get(slug) as any

    if (!competition) {
      return reply.code(404).send({
        error: {
          code: 'COMPETITION_NOT_FOUND',
          message: 'Competition not found',
        },
      })
    }

    const matches = db.prepare(`
      SELECT
        e.id,
        e.start_time,
        e.status,
        e.round,
        (SELECT participant_id FROM event_participants WHERE event_id = e.id AND role = 'home') as home_team_id,
        (SELECT participant_id FROM event_participants WHERE event_id = e.id AND role = 'away') as away_team_id,
        (SELECT score FROM event_scores WHERE event_id = e.id AND participant_id = (SELECT participant_id FROM event_participants WHERE event_id = e.id AND role = 'home')) as home_score,
        (SELECT score FROM event_scores WHERE event_id = e.id AND participant_id = (SELECT participant_id FROM event_participants WHERE event_id = e.id AND role = 'away')) as away_score
      FROM events e
      WHERE e.competition_id = ?
      ORDER BY e.start_time DESC
      LIMIT ?
    `).all(competition.id, limit)

    return {
      data: matches,
      meta: {
        timestamp: new Date().toISOString(),
        total: matches.length,
      },
    }
  })
}
