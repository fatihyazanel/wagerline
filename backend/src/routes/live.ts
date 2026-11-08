import {recordFreshness} from '../services/data-freshness'
import { FastifyInstance } from 'fastify'
import { liveEngine } from '../services/live/liveEngine'
import { liveCache } from '../services/live/liveCache'
import { db as database } from '../database/init'
import {officialRefreshStatus} from '../services/official-refresh'
import {sportscoreStatus} from '../services/sportscore-refresh'

async function readLiveMatches(){return (await database.prepare(`SELECT e.id AS fixtureId,e.status,NULL AS minute,COALESCE(hn.name,h.slug) AS homeTeamName,COALESCE(an.name,a.slug) AS awayTeamName,h.logo_url AS homeLogo,a.logo_url AS awayLogo,
 (SELECT score FROM event_scores WHERE event_id=e.id AND participant_id=h.id ORDER BY id DESC LIMIT 1) AS homeScore,
 (SELECT score FROM event_scores WHERE event_id=e.id AND participant_id=a.id ORDER BY id DESC LIMIT 1) AS awayScore,e.updated_at AS lastUpdated
 FROM events e JOIN teams h ON h.id=e.home_team_id JOIN teams a ON a.id=e.away_team_id LEFT JOIN team_translations hn ON hn.team_id=h.id AND hn.language='en' LEFT JOIN team_translations an ON an.team_id=a.id AND an.language='en'
 WHERE e.status IN ('live','halftime','ht','1h','2h','et','period_break') AND NOT EXISTS(SELECT 1 FROM event_aliases ea WHERE ea.alias_event_id=e.id) ORDER BY e.start_time`).all()).map(m=>({...m,...recordFreshness(m.status,m.lastUpdated)}))}

// Store active SSE connections
const sseConnections: Set<any> = new Set()

export const liveRoutes = async (app: FastifyInstance) => {
  // GET /api/v1/live - Get all live matches (snapshot)
  app.get('/live', async (request, reply) => {
    try {
      reply.header('Cache-Control','no-store')
      const matches = await readLiveMatches()

      return {
        success: true,
        data: matches.map(m=>({...m,...recordFreshness(m.status,m.lastUpdated)})),
        meta: {
          count: matches.length,
          timestamp: new Date().toISOString(),
          source: 'verified-database',
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

      const match=(await readLiveMatches()).find(row=>row.fixtureId===fixtureId)
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
          source: 'verified-database',
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
      reply.header('X-Robots-Tag','noindex, nofollow')

      const connection = {
        id: Math.random().toString(36),
        reply: reply,
        createdAt: new Date(),
      }

      sseConnections.add(connection)

      // Send initial data
      const matches = await readLiveMatches()
      const initialEvent = {
        event: 'live.matches.init',
        data: JSON.stringify({
          matches,
          count: matches.length,
          timestamp: new Date().toISOString(),
        }),
      }

      reply.hijack()
      for (const [name, value] of Object.entries(reply.getHeaders())) {
        if (value !== undefined) reply.raw.setHeader(name, value)
      }
      reply.raw.writeHead(200)
      reply.raw.write(`event: ${initialEvent.event}\ndata: ${initialEvent.data}\n\n`)

      const updateInterval=setInterval(()=>{void readLiveMatches().then(matches=>{if(!reply.raw.destroyed)reply.raw.write('event: live.matches.update\ndata: '+JSON.stringify({matches,count:matches.length,timestamp:new Date().toISOString()})+'\n\n')}).catch(()=>{clearInterval(updateInterval);reply.raw.end()})},15000)
      // Send heartbeat every 30 seconds
      const heartbeatInterval = setInterval(() => {
        try {
          reply.raw.write(`: heartbeat at ${new Date().toISOString()}\n\n`)
        } catch (error) {
          clearInterval(heartbeatInterval)
        clearInterval(updateInterval)
          sseConnections.delete(connection)
        }
      }, 30000)

      // Clean up on connection close
      reply.raw.on('close', () => {
        clearInterval(heartbeatInterval)
        clearInterval(updateInterval)
        sseConnections.delete(connection)
        console.log(`🔌 SSE connection closed (${sseConnections.size} remaining)`)
      })

      request.raw.on('error', () => {
        clearInterval(heartbeatInterval)
        clearInterval(updateInterval)
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
  app.post<{ Body: { event: string; data: unknown } }>('/live/broadcast', { schema: { body: { type: 'object', required: ['event', 'data'], properties: { event: { type: 'string', pattern: '^[a-zA-Z0-9_.-]+$', maxLength: 100 }, data: {} } } } }, async (request, reply) => {
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
    const engineStatus = {official:officialRefreshStatus,sportscore:sportscoreStatus}
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
      connection.reply.raw.write(message)
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
