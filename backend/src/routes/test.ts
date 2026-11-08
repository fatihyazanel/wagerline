import { FastifyInstance } from 'fastify'
import { db } from '../database/init'

export const testRoutes = async (app: FastifyInstance) => {
  // GET /test/stats - Database statistics
  app.get('/stats', async (request, reply) => {
    const stats = {
      sports: (await db.prepare('SELECT COUNT(*) as count FROM sports').get()),
      competitions: (await db.prepare('SELECT COUNT(*) as count FROM competitions').get()),
      teams: (await db.prepare('SELECT COUNT(*) as count FROM teams').get()),
      events: (await db.prepare('SELECT COUNT(*) as count FROM events').get()),
      live_events: (await db.prepare("SELECT COUNT(*) as count FROM events WHERE status = 'live'").get()),
      teams_with_translations: (await db
        .prepare('SELECT COUNT(DISTINCT team_id) as count FROM team_translations')
        .get()),
    }

    return {
      data: stats,
      meta: {
        timestamp: new Date().toISOString(),
      },
    }
  })

  // GET /test/sample - Sample data from each table
  app.get('/sample', async (request, reply) => {
    const sample = {
      sports: (await db.prepare('SELECT * FROM sports LIMIT 3').all()),
      competitions: (await db.prepare('SELECT * FROM competitions LIMIT 3').all()),
      teams: (await db
        .prepare(`
          SELECT t.*, GROUP_CONCAT(tt.name) as names
          FROM teams t
          LEFT JOIN team_translations tt ON t.id = tt.team_id
          GROUP BY t.id
          LIMIT 3
        `)
        .all()),
      events: (await db.prepare('SELECT * FROM events LIMIT 3').all()),
      live_events: (await db
        .prepare(
          `
          SELECT e.* FROM events e
          WHERE e.status IN ('live', 'halftime')
          LIMIT 3
        `
        )
        .all()),
    }

    return {
      data: sample,
      meta: {
        timestamp: new Date().toISOString(),
      },
    }
  })

  // GET /test/schema - Show database schema
  app.get('/schema', async (request, reply) => {
    const tables = (await db
      .prepare("SELECT name FROM sqlite_master WHERE type='table'")
      .all())

    const schema: Record<string, any> = {}

    for (const table of tables) {
      const columns = (await db.prepare(`PRAGMA table_info(${table.name})`).all())
      schema[table.name] = columns
    }

    return {
      data: {
        total_tables: tables.length,
        tables: schema,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    }
  })
}
