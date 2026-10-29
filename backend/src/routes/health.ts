import { FastifyInstance } from 'fastify'
import { db } from '../database/init'
import { quotaManager } from '../services/quota/quotaManager'

export const healthRoutes = async (app: FastifyInstance) => {
  // GET /api/v1/health
  app.get('/health', async (request, reply) => {
    try {
      console.log('[Health] Request received')

      let quotaStatus: any = null
      try {
        quotaStatus = quotaManager.getStatus()
        console.log('[Health] Quota status retrieved:', quotaStatus)
      } catch (e) {
        console.error('[Health] Error getting quota status:', e)
        throw e
      }

      // Simple status without database query first
      const status = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: 'connected',
        apiFootball: process.env.API_FOOTBALL_KEY ? 'configured' : 'not-configured',
        theSportsDb: 'available',
        liveEngine: 'ready',
        quota: {
          dailyUsed: quotaStatus.dailyUsed,
          dailyLimit: quotaStatus.dailyLimit,
          dailyRemaining: quotaStatus.dailyRemaining,
          minuteUsed: quotaStatus.minuteUsed,
          minuteLimit: quotaStatus.minuteLimit,
          minuteRemaining: quotaStatus.minuteRemaining,
          safeMode: quotaStatus.safeMode,
        },
        database_stats: {
          teams: 0,
          players: 0,
          events: 0,
          news: 0,
        },
      }

      console.log('[Health] Status object created, about to query database')

      // Try to get database stats without blocking
      try {
        await new Promise<void>((resolve) => {
          const timeout = setTimeout(() => {
            console.log('[Health] Database query timeout')
            resolve()
          }, 2000)
          db.all(
            `SELECT 'teams' as table_name, COUNT(*) as count FROM teams
             UNION ALL SELECT 'players', COUNT(*) FROM players
             UNION ALL SELECT 'events', COUNT(*) FROM events
             UNION ALL SELECT 'news', COUNT(*) FROM news`,
            [],
            (err: any, rows: any) => {
              clearTimeout(timeout)
              console.log('[Health] Database query callback, err:', err, 'rows:', rows ? rows.length : 0)
              if (!err && rows) {
                rows.forEach((row: any) => {
                  (status.database_stats as any)[row.table_name] = row.count
                })
              }
              resolve()
            }
          )
        })
      } catch (dbError) {
        console.error('[Health] Database query error:', dbError)
        // Database query failed, but return what we have
      }

      console.log('[Health] Returning status')
      return status
    } catch (error) {
      console.error('[Health] Error:', error)
      console.error('[Health] Error message:', (error as any).message)
      console.error('[Health] Error stack:', (error as any).stack)
      return reply.code(500).send({
        status: 'error',
        error: (error as any).message,
      })
    }
  })

  // GET /api/v1/admin/quota
  app.get('/admin/quota', async (request, reply) => {
    const quotaStatus = quotaManager.getStatus()
    return {
      data: quotaStatus,
      meta: {
        timestamp: new Date().toISOString(),
      },
    }
  })

  // GET /api/v1/admin/sync-logs
  app.get('/admin/sync-logs', async (request, reply) => {
    return new Promise((resolve) => {
      db.all(
        `SELECT * FROM sync_logs ORDER BY created_at DESC LIMIT 50`,
        [],
        (err, rows) => {
          resolve({
            data: rows || [],
            meta: {
              timestamp: new Date().toISOString(),
            },
          })
        }
      )
    })
  })

  // GET /api/v1/admin/provider-status
  app.get('/admin/provider-status', async (request, reply) => {
    const quotaStatus = quotaManager.getStatus()

    return {
      data: {
        providers: {
          'api-football': {
            status: process.env.API_FOOTBALL_KEY ? 'configured' : 'not-configured',
            quota: quotaStatus,
            next_sync: 'in 60 seconds',
          },
          'thesportsdb': {
            status: 'active',
            limit: '30 requests/minute',
            next_sync: 'in 60 seconds',
          },
          'news': {
            status: 'active',
            sources: ['google-news', 'bloomberg', 'reuters'],
            next_sync: 'in 900 seconds',
          },
        },
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    }
  })
}
