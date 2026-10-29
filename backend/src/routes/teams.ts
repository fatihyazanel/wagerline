import { FastifyInstance } from 'fastify'
import { db } from '../database/init'

export const teamsRoutes = async (app: FastifyInstance) => {
  // GET /api/v1/teams/:slug
  app.get('/:slug', async (request, reply) => {
    const { slug } = request.params as { slug: string }
    const language = (request.query as any)?.lang || 'en'

    const team = db.prepare(`
      SELECT
        t.id,
        t.sport_id,
        t.slug,
        t.logo_url,
        t.country_id,
        tt.name as team_name,
        s.name_key as sport_name
      FROM teams t
      LEFT JOIN team_translations tt ON t.id = tt.team_id AND tt.language = ?
      JOIN sports s ON t.sport_id = s.id
      WHERE t.slug = ?
    `).get(language, slug)

    if (!team) {
      return reply.code(404).send({
        error: {
          code: 'TEAM_NOT_FOUND',
          message: 'Team not found',
        },
      })
    }

    // Get recent matches
    const matches = db.prepare(`
      SELECT
        e.id,
        e.start_time,
        e.status,
        e.competition_id,
        c.name_key as competition_name,
        GROUP_CONCAT(CASE WHEN ep.participant_id = ? THEN 'self' ELSE 'opponent' END) as opponent_info
      FROM events e
      JOIN competitions c ON e.competition_id = c.id
      JOIN event_participants ep ON e.id = ep.event_id
      WHERE ep.participant_id = ?
      AND e.status IN ('finished', 'live')
      ORDER BY e.start_time DESC
      LIMIT 10
    `).all(team.id, team.id)

    return {
      data: {
        ...team,
        recentMatches: matches,
      },
      meta: {
        language,
        timestamp: new Date().toISOString(),
      },
    }
  })

  // GET /api/v1/teams
  app.get('/', async (request, reply) => {
    const language = (request.query as any)?.lang || 'en'
    const competitionId = (request.query as any)?.competition_id

    let query = `
      SELECT
        t.id,
        t.slug,
        t.logo_url,
        tt.name as team_name,
        s.name_key as sport_name
      FROM teams t
      LEFT JOIN team_translations tt ON t.id = tt.team_id AND tt.language = ?
      JOIN sports s ON t.sport_id = s.id
      WHERE t.active = 1
    `

    const params: any[] = [language]

    if (competitionId) {
      query += ` AND t.id IN (
        SELECT DISTINCT participant_id
        FROM event_participants
        WHERE event_id IN (
          SELECT id FROM events WHERE competition_id = ?
        )
      )`
      params.push(competitionId)
    }

    query += ` ORDER BY team_name`

    const teams = db.prepare(query).all(...params)

    return {
      data: teams,
      meta: {
        language,
        total: teams.length,
        timestamp: new Date().toISOString(),
      },
    }
  })
}
