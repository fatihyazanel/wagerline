import {initPlayerSnapshots} from '../services/espn-player-data'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { db } from '../database/init'

type PlayerQuery = { team_id?: string; position?: string; lang?: string; page?: string; limit?: string }

export async function playersRoutes(fastify: FastifyInstance) {
  await initPlayerSnapshots()
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const { team_id: teamId, position, lang = 'en', page = '1', limit = '50' } = request.query as PlayerQuery
    const conditions = ['p.active = 1']
    const params: any[] = []
    if (teamId) { conditions.push('p.team_id = ?'); params.push(teamId) }
    if (position) { conditions.push('LOWER(p.position) LIKE LOWER(?)'); params.push(`%${position}%`) }

    const pageNumber = Math.max(1, Number.parseInt(page, 10) || 1)
    const pageSize = Math.min(100, Math.max(1, Number.parseInt(limit, 10) || 50))
    const where = conditions.join(' AND ')

    try {
      const players = await db.prepare(`
        SELECT p.id, p.external_id, p.slug, COALESCE(pt.name, p.slug) AS name,
          p.position, COALESCE(pei.cutout_image_url, p.image_url) AS image_url,
          p.team_id, t.slug AS team_slug, COALESCE(tt.name, t.slug) AS team_name,
          t.logo_url AS team_logo, pei.height, pei.weight, pei.date_of_birth, pei.nationality,
          (SELECT pta.shirt_number FROM player_team_assignments pta
           WHERE pta.player_id=p.id AND pta.team_id=p.team_id
           ORDER BY pta.season_id DESC, pta.id DESC LIMIT 1) AS shirt_number
        FROM players p
        LEFT JOIN player_translations pt ON pt.player_id=p.id AND pt.language=?
        LEFT JOIN teams t ON t.id=p.team_id
        LEFT JOIN team_translations tt ON tt.team_id=t.id AND tt.language=?
        LEFT JOIN player_extended_info pei ON pei.player_id=p.id
        WHERE ${where}
        ORDER BY COALESCE(pt.name, p.slug)
        LIMIT ? OFFSET ?
      `).all(lang, lang, ...params, pageSize, (pageNumber - 1) * pageSize)

      const count = await db.prepare(`SELECT COUNT(*) AS total FROM players p WHERE ${where}`).get(...params) as { total: number }
      return reply.send({ data: players, pagination: { page: pageNumber, limit: pageSize, total: count.total, pages: Math.ceil(count.total / pageSize) } })
    } catch (error) {
      request.log.error(error)
      return reply.status(500).send({ error: 'Failed to fetch players' })
    }
  })

  fastify.get('/:id/stats', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string }
    const { season_id: seasonId } = request.query as { season_id?: string }
    try {
      const player = await db.prepare('SELECT id FROM players WHERE id=? AND active=1').get(id)
      if (!player) return reply.status(404).send({ error: 'Player not found' })
      const params: any[] = [id]
      const seasonFilter = seasonId ? ' AND pss.season_id=?' : ''
      if (seasonId) params.push(seasonId)
      const stats = await db.prepare(`
        SELECT pss.season_id, s.name AS season_name, pss.team_id,
          COALESCE(tt.name,t.slug) AS team_name, pss.appearances AS appearances,
          pss.goals AS goals, pss.assists AS assists,
          pss.minutes_played AS minutes_played,
          pss.yellow_cards AS yellow_cards, pss.red_cards AS red_cards
        FROM player_season_stats pss
        JOIN seasons s ON s.id=pss.season_id JOIN teams t ON t.id=pss.team_id
        LEFT JOIN team_translations tt ON tt.team_id=t.id AND tt.language='en'
        WHERE pss.player_id=?${seasonFilter} ORDER BY pss.season_id DESC
      `).all(...params)
      const summary = stats.reduce((sum: any, row: any) => ({
        appearances: sum.appearances + row.appearances, goals: sum.goals + row.goals,
        assists: sum.assists + row.assists, minutes: sum.minutes + row.minutes_played,
      }), { appearances: 0, goals: 0, assists: 0, minutes: 0 })
      const sourceStats=await db.prepare('SELECT provider,competition_key,season_name,payload_json,fetched_at FROM provider_player_snapshots WHERE player_id=? ORDER BY season_year DESC,competition_key').all(id)
      return reply.send({ player_id: Number(id), season_stats: stats, summary, source_stats:sourceStats.map(s=>({...s,payload:JSON.parse(s.payload_json),payload_json:undefined})) })
    } catch (error) {
      request.log.error(error)
      return reply.status(500).send({ error: 'Failed to fetch player stats' })
    }
  })

  fastify.get('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string }
    const { lang = 'en' } = request.query as { lang?: string }
    try {
      const player = await db.prepare(`
        SELECT p.id,p.external_id,p.slug,COALESCE(pt.name,p.slug) AS name,p.position,
          COALESCE(pei.cutout_image_url,p.image_url) AS image_url,p.team_id,t.slug AS team_slug,
          COALESCE(tt.name,t.slug) AS team_name,t.logo_url AS team_logo,
          pei.height,pei.weight,pei.date_of_birth,pei.nationality,pei.preferred_foot
        FROM players p LEFT JOIN player_translations pt ON pt.player_id=p.id AND pt.language=?
        LEFT JOIN teams t ON t.id=p.team_id
        LEFT JOIN team_translations tt ON tt.team_id=t.id AND tt.language=?
        LEFT JOIN player_extended_info pei ON pei.player_id=p.id
        WHERE p.id=? AND p.active=1
      `).get(lang, lang, id)
      if (!player) return reply.status(404).send({ error: 'Player not found' })
      const sources=await db.prepare('SELECT DISTINCT provider FROM provider_player_ids WHERE player_id=? ORDER BY provider').all(id)
      return reply.send({ data: {...player,sources:sources.map(s=>s.provider),indexable:sources.length>0} })
    } catch (error) {
      request.log.error(error)
      return reply.status(500).send({ error: 'Failed to fetch player' })
    }
  })
}
