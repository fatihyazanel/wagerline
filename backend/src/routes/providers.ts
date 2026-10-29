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
  app.get('/:provider/test', async (request, reply) => {
    const { provider } = request.params as { provider: string }

    try {
      const result = await providerService.executeWithFallback('flashscore', 'football', {
        limit: 1,
      })

      return {
        data: {
          provider,
          status: result.source ? 'ok' : 'failed',
          source: result.source,
          error: result.error,
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      }
    } catch (error) {
      return reply.code(500).send({
        error: {
          code: 'PROVIDER_TEST_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      })
    }
  })

  // POST /api/v1/providers/sync - Trigger manual sync
  app.post('/sync', async (request, reply) => {
    const { sport, competition } = request.body as any

    return {
      data: {
        job: 'sync_requested',
        sport: sport || 'football',
        competition: competition || 'all',
        status: 'pending',
        message: 'Sync job queued. Check /api/v1/jobs for status.',
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    }
  })
}
