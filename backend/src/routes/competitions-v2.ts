import { FastifyInstance } from 'fastify'
import { db } from '../database/init'
import {
  calculatedStandings,
  competitionMatches,
  competitionTeams,
  currentSeason,
  findCompetition,
  publicCompetition,
  Competition,
} from '../services/competition-overview.service'

export const competitionsRoutes = async (app: FastifyInstance) => {
  app.get('/', async (request, reply) => {
    const { sport = 'football' } = request.query as { sport?: string }
    try {
      const competitions = await db.prepare(`
        SELECT c.id,c.slug,c.name_key,c.external_provider,c.external_id
        FROM competitions c JOIN sports s ON s.id=c.sport_id
        WHERE c.active=1 AND s.slug=? AND EXISTS (SELECT 1 FROM events e WHERE e.competition_id=c.id)
        ORDER BY c.id
      `).all(sport) as Competition[]
      return { data: competitions.map(publicCompetition), meta: { total: competitions.length } }
    } catch (error) {
      request.log.error(error)
      return reply.status(500).send({ error: 'Failed to fetch competitions' })
    }
  })

  app.get('/:slug/overview', async (request, reply) => {
    const { slug } = request.params as { slug: string }
    const { lang = 'en' } = request.query as { lang?: string }
    try {
      const competition = await findCompetition(slug)
      if (!competition) return reply.status(404).send({ error: 'Competition not found' })
      const season = await currentSeason(competition.id)
      const [matches, teams] = await Promise.all([
        competitionMatches(competition.id, season?.id || null, lang),
        competitionTeams(competition.id, season?.id || null, lang),
      ])
      const standings = calculatedStandings(matches)
      return { data: {
        ...publicCompetition(competition), season, standings, matches, teams,
        coverage: {
          teams: teams.length,
          teams_with_rosters: teams.filter((team:any)=>Number(team.roster_size)>0).length,
          players: teams.reduce((sum:number,team:any)=>sum+Number(team.roster_size||0),0),
          matches: matches.length,
        },
      } }
    } catch (error) {
      request.log.error(error)
      return reply.status(500).send({ error: 'Failed to fetch competition overview' })
    }
  })

  app.get('/:slug/standings', async (request, reply) => {
    const { slug } = request.params as { slug:string }
    const { lang = 'en' } = request.query as { lang?:string }
    const competition=await findCompetition(slug)
    if (!competition) return reply.status(404).send({ error:'Competition not found' })
    const season=await currentSeason(competition.id)
    return calculatedStandings(await competitionMatches(competition.id,season?.id||null,lang))
  })

  app.get('/:slug/matches', async (request, reply) => {
    const { slug } = request.params as { slug:string }
    const { lang = 'en' } = request.query as { lang?:string }
    const competition=await findCompetition(slug)
    if (!competition) return reply.status(404).send({ error:'Competition not found' })
    const season=await currentSeason(competition.id)
    return competitionMatches(competition.id,season?.id||null,lang)
  })

  app.get('/:slug', async (request, reply) => {
    const { slug } = request.params as { slug:string }
    const competition=await findCompetition(slug)
    if (!competition) return reply.status(404).send({ error:'Competition not found' })
    return { data: { ...publicCompetition(competition), season:await currentSeason(competition.id) } }
  })
}
