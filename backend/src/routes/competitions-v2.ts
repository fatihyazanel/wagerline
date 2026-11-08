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
        SELECT c.id,c.slug,c.name_key,c.external_provider,c.external_id,(SELECT logo_url FROM competition_assets WHERE competition_id=c.id) AS logo_url
        FROM competitions c JOIN sports s ON s.id=c.sport_id
        WHERE c.active=1 AND s.slug=?
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
      const supplied=season?await db.prepare('SELECT payload_json,source,fetched_at FROM provider_standings WHERE competition_id=? AND season_id=?').get(competition.id,season.id):null
      const standings = supplied?JSON.parse(supplied.payload_json):competition.sport === 'football' ? calculatedStandings(matches) : []
      return { data: {
        ...publicCompetition(competition), season, standings,latest_result:matches.filter(m=>m.status==='finished').map(m=>m.start_time).sort().slice(-1)[0]||null, standings_source:supplied?.source||(competition.sport==='football'?'Calculated from recorded results':'Provider standings unavailable'),standings_updated_at:supplied?.fetched_at, matches:(request.query as any).preview==='1'?matches.slice(0,40):matches, teams,
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
    const supplied=season?await db.prepare('SELECT payload_json FROM provider_standings WHERE competition_id=? AND season_id=?').get(competition.id,season.id):null
    if(supplied)return JSON.parse(supplied.payload_json)
    return competition.sport === 'football' ? calculatedStandings(await competitionMatches(competition.id,season?.id||null,lang)) : []
  })

  app.get('/:slug/fixtures',async(req,reply)=>{const {slug}=req.params as {slug:string},q=req.query as Record<string,string>;const c=await findCompetition(slug);if(!c)return reply.code(404).send({error:'Competition not found'});const season=await currentSeason(c.id),page=Number(q.page)||1,limit=Math.min(100,Number(q.limit)||25);const args:unknown[]=[c.id];let where='e.competition_id=? AND NOT EXISTS(SELECT 1 FROM event_aliases a WHERE a.alias_event_id=e.id)';if(season){where+=' AND e.season_id=?';args.push(season.id)}if(q.status&&q.status!=='all'){if(q.status==='live')where+=" AND e.status IN ('live','halftime','ht','1h','2h','et','period_break')";else{where+=' AND e.status=?';args.push(q.status)}}const count=await db.prepare('SELECT COUNT(*) total FROM events e WHERE '+where).get(...args);const rows=await competitionMatches(c.id,season?.id||null,q.lang||'en',{status:q.status,limit,offset:(page-1)*limit});return {data:rows,meta:{total:count.total,page,pages:Math.ceil(count.total/limit)}}})

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
