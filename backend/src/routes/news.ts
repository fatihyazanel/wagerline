import { FastifyInstance } from 'fastify'
import { db } from '../database/init'

export const newsRoutes = async (app: FastifyInstance) => {
  // GET /api/v1/news - List all news with pagination
  app.get('/', async (request, reply) => {
    const query = request.query as any
    const language = query.lang || 'en'
    const page = parseInt(query.page) || 1
    const limit = parseInt(query.limit) || 20
    const offset = (page - 1) * limit
    const sport = query.sport
    const source = query.source

    let sql = 'SELECT * FROM news WHERE 1=1'
    const params: any[] = []

    if (sport) {
      sql += ' AND sport_id = (SELECT id FROM sports WHERE slug = ?)'
      params.push(sport)
    }

    if (source) {
      sql += ' AND source = ?'
      params.push(source)
    }

    sql += ' ORDER BY published_at DESC LIMIT ? OFFSET ?'
    params.push(limit, offset)

    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err)
          return
        }

        resolve({
          data: rows || [],
          meta: {
            language,
            page,
            limit,
            total: (rows || []).length,
            timestamp: new Date().toISOString(),
          },
        })
      })
    })
  })

  // GET /api/v1/news/:id - Get single news article
  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const language = (request.query as any)?.lang || 'en'

    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM news WHERE id = ?`,
        [id],
        (err, row) => {
          if (err) {
            reject(err)
            return
          }

          if (!row) {
            return reply.code(404).send({
              error: {
                code: 'NEWS_NOT_FOUND',
                message: 'News article not found',
              },
            })
          }

          resolve({
            data: row,
            meta: {
              language,
              timestamp: new Date().toISOString(),
            },
          })
        }
      )
    })
  })

  // GET /api/v1/news/source/:source - News by source (Guardian, BBC, ESPN)
  app.get('/source/:source', async (request, reply) => {
    const { source } = request.params as { source: string }
    const language = (request.query as any)?.lang || 'en'
    const limit = parseInt((request.query as any)?.limit) || 20

    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM news WHERE source = ? ORDER BY published_at DESC LIMIT ?`,
        [source, limit],
        (err, rows) => {
          if (err) {
            reject(err)
            return
          }

          resolve({
            data: rows || [],
            meta: {
              language,
              source,
              total: (rows || []).length,
              timestamp: new Date().toISOString(),
            },
          })
        }
      )
    })
  })

  // GET /api/v1/news/team/:team_slug - News for specific team
  app.get('/team/:slug', async (request, reply) => {
    const { slug } = request.params as { slug: string }
    const language = (request.query as any)?.lang || 'en'

    return new Promise((resolve, reject) => {
      db.all(
        `SELECT n.* FROM news n
         WHERE n.title LIKE ? OR n.description LIKE ?
         ORDER BY n.published_at DESC LIMIT 20`,
        [`%${slug}%`, `%${slug}%`],
        (err, rows) => {
          if (err) {
            reject(err)
            return
          }

          resolve({
            data: rows || [],
            meta: {
              language,
              team: slug,
              total: (rows || []).length,
              timestamp: new Date().toISOString(),
            },
          })
        }
      )
    })
  })

  // GET /api/v1/news/sport/:sport - News by sport
  app.get('/sport/:sport', async (request, reply) => {
    const { sport } = request.params as { sport: string }
    const language = (request.query as any)?.lang || 'en'
    const limit = parseInt((request.query as any)?.limit) || 30

    return new Promise((resolve, reject) => {
      db.all(
        `SELECT n.* FROM news n
         JOIN sports s ON n.sport_id = s.id
         WHERE s.slug = ?
         ORDER BY n.published_at DESC LIMIT ?`,
        [sport, limit],
        (err, rows) => {
          if (err) {
            reject(err)
            return
          }

          resolve({
            data: rows || [],
            meta: {
              language,
              sport,
              total: (rows || []).length,
              timestamp: new Date().toISOString(),
            },
          })
        }
      )
    })
  })

  // GET /api/v1/news/trending - Trending news (most recent 10)
  app.get('/trending', async (request, reply) => {
    const language = (request.query as any)?.lang || 'en'

    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM news
         ORDER BY published_at DESC
         LIMIT 10`,
        [],
        (err, rows) => {
          if (err) {
            reject(err)
            return
          }

          resolve({
            data: rows || [],
            meta: {
              language,
              category: 'trending',
              total: (rows || []).length,
              timestamp: new Date().toISOString(),
            },
          })
        }
      )
    })
  })

  // GET /api/v1/news/search - Search news
  app.get('/search', async (request, reply) => {
    const query = (request.query as any)?.q || ''
    const language = (request.query as any)?.lang || 'en'

    if (!query || query.length < 2) {
      return reply.code(400).send({
        error: {
          code: 'INVALID_QUERY',
          message: 'Query must be at least 2 characters',
        },
      })
    }

    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM news
         WHERE title LIKE ? OR description LIKE ?
         ORDER BY published_at DESC
         LIMIT 30`,
        [`%${query}%`, `%${query}%`],
        (err, rows) => {
          if (err) {
            reject(err)
            return
          }

          resolve({
            data: rows || [],
            meta: {
              language,
              query,
              total: (rows || []).length,
              timestamp: new Date().toISOString(),
            },
          })
        }
      )
    })
  })

  // GET /api/v1/news/stats - News statistics
  app.get('/stats', async (request, reply) => {
    return new Promise((resolve, reject) => {
      // Total news count
      db.get('SELECT COUNT(*) as total FROM news', [], (err, total) => {
        if (err) {
          reject(err)
          return
        }

        // By source
        db.all(
          `SELECT source, COUNT(*) as count FROM news GROUP BY source`,
          [],
          (err, bySource) => {
            if (err) {
              reject(err)
              return
            }

            // By sport
            db.all(
              `SELECT s.slug, COUNT(*) as count FROM news n
               LEFT JOIN sports s ON n.sport_id = s.id
               GROUP BY n.sport_id`,
              [],
              (err, bySport) => {
                if (err) {
                  reject(err)
                  return
                }

                // Latest
                db.get(
                  `SELECT published_at FROM news ORDER BY published_at DESC LIMIT 1`,
                  [],
                  (err, latest) => {
                    if (err) {
                      reject(err)
                      return
                    }

                    resolve({
                      data: {
                        total: total?.total || 0,
                        by_source: bySource || [],
                        by_sport: bySport || [],
                        latest_article: latest?.published_at,
                      },
                      meta: {
                        timestamp: new Date().toISOString(),
                      },
                    })
                  }
                )
              }
            )
          }
        )
      })
    })
  })
}
