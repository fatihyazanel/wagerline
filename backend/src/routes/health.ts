import {config} from '../config'
import {sportscoreStatus} from '../services/sportscore-refresh'
import { FastifyInstance } from 'fastify'
import { db } from '../database/init'
import {officialRefreshStatus} from '../services/official-refresh'
import { quotaManager } from '../services/quota/quotaManager'

export const healthRoutes = async (app: FastifyInstance) => {
  await db.prepare('CREATE TABLE IF NOT EXISTS provider_checks(provider TEXT PRIMARY KEY,status TEXT,http_status INTEGER,checked_at TEXT,latency_ms INTEGER)').run()
  // GET /api/v1/health
  app.get('/health', async (request, reply) => {
    try {
      const rows = await db.prepare(`SELECT 'teams' AS name, COUNT(*) AS count FROM teams WHERE active=1
        UNION ALL SELECT 'players', COUNT(*) FROM players WHERE active=1
        UNION ALL SELECT 'events', COUNT(*) FROM events e WHERE NOT EXISTS(SELECT 1 FROM event_aliases WHERE alias_event_id=e.id)
        UNION ALL SELECT 'news', COUNT(*) FROM news`).all()
      const freshness = await db.prepare(`SELECT
        (SELECT MAX(updated_at) FROM events) AS events_updated_at,
        (SELECT MAX(published_at) FROM news) AS news_published_at`).get()
      const checks=await db.prepare('SELECT * FROM provider_checks').all();const degraded=checks.some(c=>!['available','not-configured'].includes(c.status)||Date.now()-Date.parse(c.checked_at)>7200000);
      return {
        status: degraded||sportscoreStatus.error||officialRefreshStatus.errors.length?'degraded':'ok', provider_checks:checks, timestamp: new Date().toISOString(), database: 'connected',
        apiFootball: config.providers.apisports.enabled ? 'configured' : 'not-configured',
        theSportsDb: config.providers.thesportsdb.enabled?'configured':'not-configured', sportdb: {configured:config.providers.sportdb.enabled, ...(await db.prepare('SELECT COUNT(*) AS imported_competitions,MAX(fetched_at) AS last_success FROM provider_standings').get())}, sportscore: sportscoreStatus, liveEngine: officialRefreshStatus,
        quota: config.providers.apisports.enabled?quotaManager.getStatus():{status:'not-configured'},
        database_stats: Object.fromEntries(rows.map(row => [row.name, row.count])),
        freshness,
      }
    } catch (error) {
      request.log.error(error)
      return reply.code(503).send({ status: 'error', database: 'unavailable' })
    }
  })

  // GET /api/v1/admin/quota
  app.get('/admin/quota', async (request, reply) => {
    const quotaStatus = quotaManager.getStatus()
    return {
      data: config.providers.apisports.enabled?quotaStatus:{status:'not-configured'},
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
          if (err) { reply.code(503); resolve({ error: 'Sync logs unavailable' }); return }
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
  app.get('/admin/provider-status',async()=>({data:{providers:Object.fromEntries((await db.prepare('SELECT * FROM provider_checks').all()).map(p=>[p.provider,p])),news:{sources:(await db.prepare('SELECT DISTINCT source FROM news WHERE source IS NOT NULL').all()).map(r=>r.source)}},meta:{timestamp:new Date().toISOString()}}))
}
