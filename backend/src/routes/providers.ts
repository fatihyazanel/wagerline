import {probeProvider} from '../services/provider-probe'
import {enqueueJob} from '../services/operation-jobs'
import { FastifyInstance } from 'fastify'
import { providerService } from '../services/provider.service'
import { config } from '../config'

export const providersRoutes = async (app: FastifyInstance) => {
  // GET /api/v1/providers - List all configured providers
  app.get('/', async (request, reply) => {
    const status = providerService.getProviderStatus()

    return {
      data: {
        total: status.total,
        providers: status.providers.map((p: any) => ({
          name: p.name,
          enabled: p.enabled,
          rateLimitState: p.rateLimitState,
        })),
        priority: config.providerPriority,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    }
  })

  // GET /api/v1/providers/status - Provider health check
  app.get('/status', async (request, reply) => {
    const enabledProviders = providerService.getEnabledProviders()

    return {
      data: {
        total: enabledProviders.length,
        enabled: enabledProviders,
        config: {
          sportdb: config.providers.sportdb.enabled ? 'enabled' : 'disabled',
          sportscore: config.providers.sportscore.enabled ? 'enabled' : 'disabled',
          thesportsdb: config.providers.thesportsdb.enabled ? 'enabled' : 'disabled',
          apisports: config.providers.apisports.enabled ? 'enabled' : 'disabled',
        },
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    }
  })

  // GET /api/v1/providers/:provider/test - Test provider connection
  app.get('/:provider/test',async(req,reply)=>{const name=(req.params as {provider:string}).provider;const result=await probeProvider(name);return result?{data:result}:reply.code(404).send({error:'Unknown provider'})})

  // POST /api/v1/providers/sync - Trigger manual sync
  app.post('/sync', async (request, reply) => {
    const kind=(request.body as {kind?:string})?.kind||'sportdb'
    try{return reply.code(202).send({data:{id:await enqueueJob(kind),status:'queued'}})}catch{return reply.code(400).send({error:'Unsupported job kind'})}
  })
}
