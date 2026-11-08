import { FastifyInstance } from 'fastify'
import { db } from '../database/init'

export const sportsRoutes = async (app: FastifyInstance) => {
  // GET /api/v1/sports
  app.get('/', async (request, reply) => {
    const language = (request.query as any)?.lang || 'en'

    return new Promise((resolve) => {
      db.all(`
        SELECT
          id,
          slug,
          name_key,
          icon,
          status
        FROM sports
        WHERE status = 'active'
        ORDER BY id
      `, [], (err: any, sports: any) => {
        if (err) {
          resolve({
            data: [],
            meta: {
              language,
              total: 0,
              timestamp: new Date().toISOString(),
            },
          })
          return
        }

        resolve({
          data: sports || [],
          meta: {
            language,
            total: (sports || []).length,
            timestamp: new Date().toISOString(),
          },
        })
      })
    })
  })

  // GET /api/v1/sports/:slug
  app.get('/:slug', async (request, reply) => {
    const { slug } = request.params as { slug: string }
    const language = (request.query as any)?.lang || 'en'

    const sport = (await db.prepare(`
      SELECT
        s.id,
        s.slug,
        s.name_key,
        s.icon,
        s.status,
        COUNT(DISTINCT c.id) as competition_count,
        COUNT(DISTINCT t.id) as team_count
      FROM sports s
      LEFT JOIN competitions c ON s.id = c.sport_id
      LEFT JOIN teams t ON s.id = t.sport_id
      WHERE s.slug = ?
      GROUP BY s.id
    `).get(slug))

    if (!sport) {
      return reply.code(404).send({
        error: {
          code: 'SPORT_NOT_FOUND',
          message: 'Sport not found',
        },
      })
    }

    return {
      data: sport,
      meta: {
        language,
        timestamp: new Date().toISOString(),
      },
    }
  })
}
