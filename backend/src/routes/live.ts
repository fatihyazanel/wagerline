import { FastifyInstance } from 'fastify'
import { liveEngine } from '../services/live/liveEngine'
import { liveCache } from '../services/live/liveCache'
import { getDb } from '../database/init'

const db = getDb()

// Store active SSE connections
const sseConnections: Set<any> = new Set()

export const liveRoutes = async (app: FastifyInstance) => {
  // GET /api/v1/live - Get all live matches (snapshot)
  app.get('/live', async (request, reply) => {
    try {
      const matches = liveEngine.getActiveLiveMatches()

      return {
        success: true,
        data: matches,
        meta: {
          count: matches.length,
          timestamp: new Date().toISOString(),
          source: 'live-engine',
          cacheStatus: liveCache.getStatus(),
        },
      }
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: (error as any).message,
      })
    }
  })

  // GET /api/v1/live/:eventId - Get specific live match
  app.get<{ Params: { eventId: string } }>('/live/:eventId', async (request, reply) => {
    try {
      const { eventId } = request.params
      const fixtureId = parseInt(eventId)

      // Check cache first
      const cached = liveCache.get(`fixture:${fixtureId}`)
      if (cached) {
        return {
          success: true,
          data: cached,
          meta: {
            timestamp: new Date().toISOString(),
            source: 'cache',
            freshness: liveCache.isFresh(`fixture:${fixtureId}`) ? 'fresh' : 'stale',
          },
        }
      }

      // Get from engine
      const match = liveEngine.getLiveMatch(fixtureId)
      if (!match) {
        return reply.code(404).send({
          success: false,
          error: 'Match not found',
        })
      }

      return {
        success: true,
        data: match,
        meta: {
          timestamp: new Date().toISOString(),
          source: 'live-engine',
        },
      }
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: (error as any).message,
      })
    }
  })

  // GET /api/v1/live/stream - SSE Stream for real-time updates
  app.get('/live/stream', async (request, reply) => {
    try {
      // Set SSE headers
      reply.header('Content-Type', 'text/event-stream')
      reply.header('Cache-Control', 'no-cache')
      reply.header('Connection', 'keep-alive')
      reply.header('X-Accel-Buffering', 'no')

      const connection = {
        id: Math.random().toString(36),
        reply: reply,
        createdAt: new Date(),
      }

      sseConnections.add(connection)

      // Send initial data
      const matches = liveEngine.getActiveLiveMatches()
      const initialEvent = {
        event: 'live.matches.init',
        data: JSON.stringify({
          matches,
          count: matches.length,
          timestamp: new Date().toISOString(),
        }),
      }

      reply.send(`event: ${initialEvent.event}\n`)
      reply.send(`data: ${initialEvent.data}\n\n`)

      // Send heartbeat every 30 seconds
      const heartbeatInterval = setInterval(() => {
        try {
          reply.send(`: heartbeat at ${new Date().toISOString()}\n\n`)
        } catch (error) {
          clearInterval(heartbeatInterval)
          sseConnections.delete(connection)
        }
      }, 30000)

      // Clean up on connection close
      request.raw.on('close', () => {
        clearInterval(heartbeatInterval)
        sseConnections.delete(connection)
        console.log(`🔌 SSE connection closed (${sseConnections.size} remaining)`)
      })

      request.raw.on('error', () => {
        clearInterval(heartbeatInterval)
        sseConnections.delete(connection)
      })

      console.log(`✅ SSE connection established (${sseConnections.size} total)`)
    } catch (error) {
      console.error('SSE connection error:', error)
      return reply.code(500).send({
        success: false,
        error: (error as any).message,
      })
    }
  })

  // POST /api/v1/live/broadcast - Internal endpoint to broadcast events
  app.post<{ Body: any }>('/live/broadcast', async (request, reply) => {
    try {
      const { event, data } = request.body

      broadcastToAllClients(event, data)

      return {
        success: true,
        broadcastTo: sseConnections.size,
      }
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: (error as any).message,
      })
    }
  })

  // GET /api/v1/live/health - Live system health
  app.get('/live/health', async (request, reply) => {
    const engineStatus = liveEngine.getStatus()
    const cacheStatus = liveCache.getStatus()

    return {
      success: true,
      data: {
        engine: engineStatus,
        cache: cacheStatus,
        sseConnections: sseConnections.size,
        timestamp: new Date().toISOString(),
      },
    }
  })
}

/**
 * Broadcast event to all connected SSE clients
 */
export function broadcastToAllClients(event: string, data: any): void {
  const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`

  for (const connection of sseConnections) {
    try {
      connection.reply.send(message)
    } catch (error) {
      // Connection likely closed
      sseConnections.delete(connection)
    }
  }
}

/**
 * Broadcast specific match event
 */
export function broadcastMatchEvent(
  fixtureId: number,
  eventType: 'goal' | 'card' | 'substitution' | 'var' | 'status',
  data: any
): void {
  broadcastToAllClients(`live.match.${eventType}`, {
    fixtureId,
    eventType,
    data,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Broadcast score update
 */
export function broadcastScoreUpdate(fixtureId: number, homeScore: number, awayScore: number): void {
  broadcastToAllClients('live.score.updated', {
    fixtureId,
    homeScore,
    awayScore,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Broadcast match finished
 */
export function broadcastMatchFinished(fixtureId: number, homeScore: number, awayScore: number): void {
  broadcastToAllClients('match.finished', {
    fixtureId,
    finalScore: `${homeScore}-${awayScore}`,
    timestamp: new Date().toISOString(),
  })
}
