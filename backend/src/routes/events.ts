import { FastifyInstance } from 'fastify'
import { db } from '../database/init'

export const eventsRoutes = async (app: FastifyInstance) => {
  // GET /api/v1/events/today
  app.get('/today', async (request, reply) => {
    const language = (request.query as any)?.lang || 'en'

    const today = new Date().toISOString().split('T')[0]
    const tomorrow = new Date(new Date().getTime() + 86400000).toISOString().split('T')[0]

    const events = (await db.prepare(`
      SELECT
        e.id,
        e.sport_id,
        e.competition_id,
        e.start_time,
        e.status,
        s.name_key as sport_name,
        c.name_key as competition_name,
        GROUP_CONCAT(t.id) as team_ids
      FROM events e
      JOIN sports s ON e.sport_id = s.id
      JOIN competitions c ON e.competition_id = c.id
      LEFT JOIN event_participants ep ON e.id = ep.event_id
      LEFT JOIN teams t ON ep.participant_id = t.id
      WHERE DATE(e.start_time) = ?
      GROUP BY e.id
      ORDER BY e.start_time
    `).all(today))

    return {
      data: events,
      meta: {
        language,
        date: today,
        total: events.length,
        timestamp: new Date().toISOString(),
      },
    }
  })

  // GET /api/v1/events/live
  app.get('/live', async (request, reply) => {
    const language = (request.query as any)?.lang || 'en'

    const liveEvents = (await db.prepare(`
      SELECT
        e.id,
        e.sport_id,
        e.competition_id,
        e.start_time,
        e.status,
        s.name_key as sport_name,
        c.name_key as competition_name,
        GROUP_CONCAT(t.id) as team_ids
      FROM events e
      JOIN sports s ON e.sport_id = s.id
      JOIN competitions c ON e.competition_id = c.id
      LEFT JOIN event_participants ep ON e.id = ep.event_id
      LEFT JOIN teams t ON ep.participant_id = t.id
      WHERE e.status IN ('live', 'halftime', 'period_break')
      GROUP BY e.id
      ORDER BY e.start_time
    `).all())

    return {
      data: liveEvents,
      meta: {
        language,
        total: liveEvents.length,
        timestamp: new Date().toISOString(),
      },
    }
  })

  // GET /api/v1/events/:id
  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const language = (request.query as any)?.lang || 'en'

    const event = (await db.prepare(`
      SELECT
        e.id,
        e.sport_id,
        e.competition_id,
        e.start_time,
        e.status,
        e.event_type,
        s.name_key as sport_name,
        c.name_key as competition_name,
        c.slug as competition_slug
      FROM events e
      JOIN sports s ON e.sport_id = s.id
      JOIN competitions c ON e.competition_id = c.id
      WHERE e.id = ?
    `).get(id))

    if (!event) {
      return reply.code(404).send({
        error: {
          code: 'EVENT_NOT_FOUND',
          message: 'Event not found',
        },
      })
    }

    // Get participants
    const participants = (await db.prepare(`
      SELECT
        ep.id,
        ep.role,
        t.id as team_id,
        t.slug,
        t.logo_url
      FROM event_participants ep
      LEFT JOIN teams t ON ep.participant_id = t.id
      WHERE ep.event_id = ?
    `).all(id))

    // Get scores
    const scores = (await db.prepare(`
      SELECT
        participant_id,
        score,
        period
      FROM event_scores
      WHERE event_id = ?
      ORDER BY period DESC
    `).all(id))

    // Get prediction
    const prediction = (await db.prepare(`
      SELECT
        home_probability,
        draw_probability,
        away_probability,
        confidence
      FROM predictions
      WHERE event_id = ?
      LIMIT 1
    `).get(id))

    return {
      data: {
        ...event,
        participants,
        scores,
        prediction,
      },
      meta: {
        language,
        timestamp: new Date().toISOString(),
      },
    }
  })

  // GET /api/v1/events/:id/statistics
  app.get('/:id/statistics', async (request, reply) => {
    const { id } = request.params as { id: string }
    const language = (request.query as any)?.lang || 'en'

    const stats = (await db.prepare(`
      SELECT
        participant_id,
        metric,
        value,
        period
      FROM event_statistics
      WHERE event_id = ?
      ORDER BY period, metric
    `).all(id))

    return {
      data: stats,
      meta: {
        language,
        total: stats.length,
        timestamp: new Date().toISOString(),
      },
    }
  })
}
