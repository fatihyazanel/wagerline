import {shopAdminRoutes} from './routes/shop'
import {startRefreshes} from './services/refresh-supervisor'
import {dataHealthRoutes} from './routes/data-health'
import {adminRecordsRoutes} from './routes/admin-records'
import {discoveryRoutes} from './routes/discovery'
import {recordAnalysisRoutes} from './routes/record-analysis'
import {refreshEspnTennis} from './jobs/syncEspnTennis'
import {refreshTennis} from './jobs/syncIndividualSports'
import {individualRoutes} from './routes/individual'
import {registerGuards} from './services/operations-guard'
import {startJobs} from './services/operation-jobs'
import {refreshSportscore,sportscoreStatus} from './services/sportscore-refresh'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { initDatabase } from './database/init'
import { sportsRoutes } from './routes/sports'
import { competitionsRoutes } from './routes/competitions-v2'
import { eventsRoutes } from './routes/events-v2'
import { teamsRoutes } from './routes/teams-v2'
import { providersRoutes } from './routes/providers'
import { newsRoutes } from './routes/news'
import { testRoutes } from './routes/test'
import { playersRoutes } from './routes/players'
import { standingsRoutes } from './routes/standings'
import { headToHeadRoutes } from './routes/head-to-head'
import { statsRoutes } from './routes/stats'
import { predictionsRoutes } from './routes/predictions'
import { healthRoutes } from './routes/health'
import { liveRoutes } from './routes/live'
import { workspaceRoutes } from './routes/workspace'
import { personalRoutes } from './routes/personal'
import {refreshOfficial,officialRefreshStatus} from './services/official-refresh'
import { config } from './config'

console.log('[Server] All imports loaded')

const app = Fastify({
  logger: config.app.env === 'production',
  trustProxy:['127.0.0.1','::1'],
})
registerGuards(app)
app.addHook('onSend',async(_request,reply,payload)=>{
  reply.header('X-Robots-Tag','noindex, nofollow')
  return payload
})
console.log('[Server] Fastify app created')

app.register(cors, {
  origin: config.api.cors.origin === '*' ? '*' : config.api.cors.origin.split(',').map(origin => origin.trim()),
  credentials: config.api.cors.origin !== '*' && config.api.cors.credentials,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Language'],
})

// Routes
console.log('[Server] Registering routes...')
try {
  app.register(adminRecordsRoutes)
  app.register(dataHealthRoutes,{prefix:'/api/v1'})
  app.register(discoveryRoutes,{prefix:'/api/v1/discovery'})
  app.register(recordAnalysisRoutes,{prefix:'/api/v1/discovery'})
  app.register(sportsRoutes, { prefix: '/api/v1/sports' })
  app.register(individualRoutes,{prefix:'/api/v1/workspace'})
  app.register(workspaceRoutes, { prefix: '/api/v1/workspace' })
  app.register(personalRoutes, { prefix: '/api/v1/personal' })
  app.register(shopAdminRoutes)
  console.log('[Server] Sports routes registered')
  app.register(competitionsRoutes, { prefix: '/api/v1/competitions' })
  console.log('[Server] Competitions routes registered')
  app.register(eventsRoutes, { prefix: '/api/v1/events' })
  console.log('[Server] Events routes registered')
  app.register(teamsRoutes, { prefix: '/api/v1/teams' })
  console.log('[Server] Teams routes registered')
  app.register(providersRoutes, { prefix: '/api/v1/providers' })
  console.log('[Server] Providers routes registered')
  app.register(newsRoutes, { prefix: '/api/v1/news' })
  console.log('[Server] News routes registered')
  app.register(playersRoutes, { prefix: '/api/v1/players' })
  console.log('[Server] Players routes registered')
  app.register(standingsRoutes, { prefix: '/api/v1/standings' })
  console.log('[Server] Standings routes registered')
  app.register(headToHeadRoutes, { prefix: '/api/v1/head-to-head' })
  console.log('[Server] Head-to-head routes registered')
  app.register(statsRoutes, { prefix: '/api/v1/stats' })
  console.log('[Server] Stats routes registered')
  app.register(predictionsRoutes, { prefix: '/api/v1/predictions' })
  console.log('[Server] Predictions routes registered')
  app.register(healthRoutes, { prefix: '/api/v1' })
  console.log('[Server] Health routes registered')
  app.register(liveRoutes, { prefix: '/api/v1' })
  console.log('[Server] Live routes registered')
  app.register(testRoutes, { prefix: '/test' })
  console.log('[Server] Test routes registered')
} catch (err) {
  console.error('[Server] Route registration error:', err)
}

// Admin Status Routes
app.get('/api/v1/admin/status', async (request, reply) => {
  return {
    app: {
      version: '1.0.0',
      environment: config.app.env,
      language: config.app.defaultLanguage,
    },
    database: {
      path: config.database.path,
    },
    providers: {
      enabled: config.providers.sportscore.enabled ? ['sportscore'] : [],
      total: Object.values(config.providers).filter(p => p.enabled).length,
    },
    features: config.features,
    cache: config.cache.ttl,
    timestamp: new Date().toISOString(),
  }
})

app.get('/api/v1/integrations/status',async()=>({data:{official:officialRefreshStatus,sportscore:sportscoreStatus}}))
// Health check
app.get('/api/health', async (request, reply) => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }
})

const start = async () => {
  try {
    await initDatabase()
    await startJobs(app)
    await startRefreshes(app)
    console.log('[Server] Starting listen on port', config.app.port)
    await app.listen({ port: config.app.port, host: config.app.host })
    console.log(`✅ WAGERline API running on http://${config.app.host}:${config.app.port}`)
    console.log(`📦 Providers enabled: ${config.providers.sportscore.enabled ? 'SportScore ' : ''}${config.providers.apisports.enabled ? 'API-Sports ' : ''}${config.providers.thesportsdb.enabled ? 'TheSportsDB' : ''}`)
    console.log(`🔄 Live polling: ${config.features.livePolling ? 'enabled' : 'disabled'}`)
  } catch (err) {
    console.error('[Server] Start error:', err)
    process.exit(1)
  }
}

console.log('[Server] Calling start()...')
start().then(() => console.log('[Server] Start completed')).catch(err => console.error('[Server] Start promise error:', err))

for(const signal of ['SIGINT','SIGTERM'] as const)process.once(signal,()=>{void app.close().then(()=>process.exit(0))})
