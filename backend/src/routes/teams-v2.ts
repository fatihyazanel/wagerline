import { FastifyInstance } from 'fastify'
import { db } from '../database/init'

export const teamsRoutes = async (app: FastifyInstance) => {
  app.get('/', async (request, reply) => {
    const { lang = 'en', sport = 'football', competition_id: competitionId } = request.query as any
    const params: any[] = [lang, sport]
    let competitionFilter = ''
    if (competitionId) {
      competitionFilter = `AND EXISTS (SELECT 1 FROM events e WHERE e.competition_id=? AND (e.home_team_id=t.id OR e.away_team_id=t.id))`
      params.push(competitionId)
    }
    try {
      const teams = await db.prepare(`
        SELECT t.id,t.external_id,t.slug,t.logo_url,COALESCE(tt.name,t.slug) AS name,
          COUNT(p.id) AS roster_size
        FROM teams t JOIN sports s ON s.id=t.sport_id
        LEFT JOIN team_translations tt ON tt.team_id=t.id AND tt.language=?
        LEFT JOIN players p ON p.team_id=t.id AND p.active=1
        WHERE t.active=1 AND s.slug=? ${competitionFilter}
        GROUP BY t.id ORDER BY name
      `).all(...params)
      return { data: teams, meta: { language: lang, total: teams.length } }
    } catch (error) {
      request.log.error(error)
      return reply.status(500).send({ error: 'Failed to fetch teams' })
    }
  })

  app.get('/:slug/players', async (request, reply) => {
    const { slug } = request.params as { slug: string }
    const { lang = 'en' } = request.query as { lang?: string }
    try {
      const team = await db.prepare(`
        SELECT t.id,t.external_id,t.slug,t.logo_url,COALESCE(tt.name,t.slug) AS name
        FROM teams t LEFT JOIN team_translations tt ON tt.team_id=t.id AND tt.language=?
        WHERE t.slug=? AND t.active=1
      `).get(lang, slug) as any
      if (!team) return reply.status(404).send({ error: 'Team not found' })

      const players = await db.prepare(`
        SELECT p.id,p.external_id,p.slug,COALESCE(pt.name,p.slug) AS name,p.position,
          COALESCE(pei.cutout_image_url,p.image_url) AS image_url,pei.date_of_birth,
          pei.nationality,pei.height,pei.weight,
          (SELECT pta.shirt_number FROM player_team_assignments pta
           WHERE pta.player_id=p.id AND pta.team_id=p.team_id
           ORDER BY pta.season_id DESC,pta.id DESC LIMIT 1) AS shirt_number
        FROM players p LEFT JOIN player_translations pt ON pt.player_id=p.id AND pt.language=?
        LEFT JOIN player_extended_info pei ON pei.player_id=p.id
        WHERE p.team_id=? AND p.active=1
        ORDER BY CASE
          WHEN LOWER(p.position) LIKE '%goal%' THEN 1
          WHEN LOWER(p.position) LIKE '%back%' OR LOWER(p.position) LIKE '%defen%' THEN 2
          WHEN LOWER(p.position) LIKE '%mid%' THEN 3
          WHEN LOWER(p.position) LIKE '%wing%' THEN 4
          WHEN LOWER(p.position) LIKE '%forward%' OR LOWER(p.position) LIKE '%strik%' OR LOWER(p.position) LIKE '%attack%' THEN 5
          ELSE 6 END,COALESCE(pt.name,p.slug)
      `).all(lang, team.id)
      return { data: { ...team, players }, meta: { language: lang, total: players.length } }
    } catch (error) {
      request.log.error(error)
      return reply.status(500).send({ error: 'Failed to fetch team roster' })
    }
  })

  app.get('/:slug', async (request, reply) => {
    const { slug } = request.params as { slug: string }
    const { lang = 'en' } = request.query as { lang?: string }
    try {
      const team = await db.prepare(`
        SELECT t.id,t.external_id,t.slug,t.logo_url,COALESCE(tt.name,t.slug) AS name,
          s.slug AS sport,COUNT(p.id) AS roster_size
        FROM teams t JOIN sports s ON s.id=t.sport_id
        LEFT JOIN team_translations tt ON tt.team_id=t.id AND tt.language=?
        LEFT JOIN players p ON p.team_id=t.id AND p.active=1
        WHERE t.slug=? AND t.active=1 GROUP BY t.id
      `).get(lang, slug) as any
      if (!team) return reply.status(404).send({ error: 'Team not found' })
      return { data: team, meta: { language: lang } }
    } catch (error) {
      request.log.error(error)
      return reply.status(500).send({ error: 'Failed to fetch team' })
    }
  })
}
