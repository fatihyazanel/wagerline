import { FastifyInstance } from 'fastify'
import { db } from '../database/init'

const getTeamName = (teamId: number, language: string = 'en'): Promise<string> => {
  return new Promise((resolve) => {
    db.get(`
      SELECT name FROM team_translations
      WHERE team_id = ? AND language = ?
      LIMIT 1
    `, [teamId, language], (err, row: any) => {
      resolve(row?.name || 'Unknown Team')
    })
  })
}

const getEventWithDetails = async (eventId: number, language: string = 'en') => {
  return new Promise(async (resolve) => {
    db.get(`
      SELECT
        e.id, e.start_time, e.status, e.created_at, e.round,
        e.home_team_id, e.away_team_id, e.competition_id,
        h.slug as home_team_slug, a.slug as away_team_slug, h.logo_url as home_logo, a.logo_url as away_logo,
        c.slug as competition_slug
      FROM events e
      LEFT JOIN teams h ON e.home_team_id = h.id
      LEFT JOIN teams a ON e.away_team_id = a.id
      LEFT JOIN competitions c ON e.competition_id = c.id
      WHERE e.id = ?
    `, [eventId], async (err, event: any) => {
      if (!event) {
        resolve(null)
        return
      }

      const homeTeamName = await getTeamName(event.home_team_id, language)
      const awayTeamName = await getTeamName(event.away_team_id, language)

      db.all(`
        SELECT score, participant_id FROM event_scores
        WHERE event_id = ?
      `, [eventId], (err, scores: any[]) => {
        const homeScore = scores?.find((s: any) => s.participant_id === event.home_team_id)?.score || 0
        const awayScore = scores?.find((s: any) => s.participant_id === event.away_team_id)?.score || 0

        resolve({
          ...event,
          home_team_name: homeTeamName,
          away_team_name: awayTeamName,
          home_score: homeScore,
          away_score: awayScore,
        })
      })
    })
  })
}

export const eventsRoutes = async (app: FastifyInstance) => {
  // GET /api/v1/events - List all events
  app.get('/', async (request, reply) => {
    const language = (request.query as any)?.lang || 'en'
    const status = (request.query as any)?.status || 'scheduled'
    const limit = parseInt((request.query as any)?.limit) || 20

    return new Promise((resolve) => {
      db.all(`
        SELECT
          e.id, e.start_time, e.status, e.created_at, e.round,
          e.home_team_id, e.away_team_id, e.competition_id,
          h.slug as home_team_slug, a.slug as away_team_slug, h.logo_url as home_logo, a.logo_url as away_logo,
          c.slug as competition_slug
        FROM events e
        LEFT JOIN teams h ON e.home_team_id = h.id
        LEFT JOIN teams a ON e.away_team_id = a.id
        LEFT JOIN competitions c ON e.competition_id = c.id
        WHERE e.status = ?
        ORDER BY e.start_time
        LIMIT ?
      `, [status, limit], async (err, rows: any[]) => {
        if (!rows || rows.length === 0) {
          resolve({
            data: [],
            meta: { language, status, total: 0, timestamp: new Date().toISOString() },
          })
          return
        }

        const enrichedRows = await Promise.all(
          rows.map(async (row) => ({
            ...row,
            home_team_name: await getTeamName(row.home_team_id, language),
            away_team_name: await getTeamName(row.away_team_id, language),
          }))
        )

        resolve({
          data: enrichedRows,
          meta: { language, status, total: enrichedRows.length, timestamp: new Date().toISOString() },
        })
      })
    })
  })

  // GET /api/v1/events/live - Get live events only
  app.get('/live', async (request, reply) => {
    const language = (request.query as any)?.lang || 'en'

    return new Promise((resolve) => {
      db.all(`
        SELECT
          e.id, e.start_time, e.status, e.created_at, e.round,
          e.home_team_id, e.away_team_id, e.competition_id,
          h.slug as home_team_slug, a.slug as away_team_slug, h.logo_url as home_logo, a.logo_url as away_logo,
          c.slug as competition_slug
        FROM events e
        LEFT JOIN teams h ON e.home_team_id = h.id
        LEFT JOIN teams a ON e.away_team_id = a.id
        LEFT JOIN competitions c ON e.competition_id = c.id
        WHERE e.status IN ('live', 'scheduled')
        ORDER BY e.start_time
        LIMIT 50
      `, [], async (err, rows: any[]) => {
        if (!rows || rows.length === 0) {
          resolve({
            data: [],
            meta: { language, category: 'live', total: 0, timestamp: new Date().toISOString() },
          })
          return
        }

        const enrichedRows = await Promise.all(
          rows.map(async (row) => ({
            ...row,
            home_team_name: await getTeamName(row.home_team_id, language),
            away_team_name: await getTeamName(row.away_team_id, language),
          }))
        )

        resolve({
          data: enrichedRows,
          meta: { language, category: 'live', total: enrichedRows.length, timestamp: new Date().toISOString() },
        })
      })
    })
  })

  // GET /api/v1/events/:id - Get single event with details
  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const language = (request.query as any)?.lang || 'en'

    const event = await getEventWithDetails(parseInt(id), language)
    if (!event) {
      return {
        error: { code: 'NOT_FOUND', message: 'Event not found' },
        statusCode: 404,
      }
    }

    return {
      data: event,
      meta: { language, timestamp: new Date().toISOString() },
    }
  })

  // GET /api/v1/events/competition/:competitionSlug - Get events by competition
  app.get('/competition/:competitionSlug', async (request, reply) => {
    const { competitionSlug } = request.params as { competitionSlug: string }
    const language = (request.query as any)?.lang || 'en'
    const status = (request.query as any)?.status || 'scheduled'
    const limit = parseInt((request.query as any)?.limit) || 50

    return new Promise((resolve) => {
      db.all(`
        SELECT
          e.id, e.start_time, e.status, e.created_at, e.round,
          e.home_team_id, e.away_team_id, e.competition_id,
          h.slug as home_team_slug, a.slug as away_team_slug, h.logo_url as home_logo, a.logo_url as away_logo,
          c.slug as competition_slug
        FROM events e
        LEFT JOIN teams h ON e.home_team_id = h.id
        LEFT JOIN teams a ON e.away_team_id = a.id
        LEFT JOIN competitions c ON e.competition_id = c.id
        WHERE c.slug = ? AND (e.status = ? OR ? = 'all')
        ORDER BY e.start_time
        LIMIT ?
      `, [competitionSlug, status, status, limit], async (err, rows: any[]) => {
        if (!rows || rows.length === 0) {
          resolve({
            data: [],
            meta: { language, competition: competitionSlug, status, total: 0, timestamp: new Date().toISOString() },
          })
          return
        }

        const enrichedRows = await Promise.all(
          rows.map(async (row) => ({
            ...row,
            home_team_name: await getTeamName(row.home_team_id, language),
            away_team_name: await getTeamName(row.away_team_id, language),
          }))
        )

        resolve({
          data: enrichedRows,
          meta: { language, competition: competitionSlug, status, total: enrichedRows.length, timestamp: new Date().toISOString() },
        })
      })
    })
  })
}
