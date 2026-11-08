import { db } from '../database/init'

export type Competition = { id:number; slug:string; name_key:string; sport?:string; external_provider:string|null; external_id:string|null }
export type MatchRow = {
  id:number; start_time:string; status:string; round:number|null
  home_team_id:number; home_team_name:string; home_team_slug:string; home_logo:string|null
  away_team_id:number; away_team_name:string; away_team_slug:string; away_logo:string|null
  home_score:number|null; away_score:number|null
}

const names: Record<string,string> = {
  'premier-league':'Premier League','la-liga':'La Liga','serie-a':'Serie A',bundesliga:'Bundesliga',
  'ligue-1':'Ligue 1','super-lig':'Süper Lig',eredivisie:'Eredivisie',nba:'NBA',nfl:'NFL',nhl:'NHL',mlb:'MLB','formula-1':'Formula 1',
}
const countries: Record<string,string> = {
  'premier-league':'England','la-liga':'Spain','serie-a':'Italy',bundesliga:'Germany','ligue-1':'France',
  'super-lig':'Türkiye',eredivisie:'Netherlands',nba:'USA',nfl:'USA',nhl:'North America',mlb:'USA','formula-1':'World',
}

export const publicCompetition = (competition: Competition) => ({
  ...competition,
  name: names[competition.slug] || competition.name_key.replace(/^competitions\./,'').replace(/_/g,' '),
  country: countries[competition.slug] || null,
})

export const findCompetition = (slug:string) => db.prepare(`
  SELECT c.id,c.slug,c.name_key,c.external_provider,c.external_id,(SELECT logo_url FROM competition_assets WHERE competition_id=c.id) AS logo_url,s.slug AS sport FROM competitions c JOIN sports s ON s.id=c.sport_id WHERE c.slug=? AND c.active=1
`).get(slug) as Promise<Competition|null>

export const currentSeason = (competitionId:number) => db.prepare(`
  SELECT id,name FROM seasons WHERE competition_id=? ORDER BY is_current DESC,id DESC LIMIT 1
`).get(competitionId) as Promise<{id:number;name:string}|null>

export async function competitionMatches(competitionId:number, seasonId:number|null, lang:string, options?:{status?:string;limit:number;offset:number}) {
  const seasonClause = seasonId ? 'AND e.season_id=?' : ''
  const params = seasonId ? [lang,lang,competitionId,seasonId] : [lang,lang,competitionId]
  let extra='';if(options?.status&&options.status!=='all'){if(options.status==='live')extra=" AND e.status IN ('live','halftime','ht','1h','2h','et','period_break')";else{extra=' AND e.status=?';params.push(options.status)}}
  if(options)params.push(options.limit,options.offset)
  return db.prepare(`
    SELECT e.id,e.start_time,e.status,e.round,
      home.id AS home_team_id,COALESCE(ht.name,home.slug) AS home_team_name,
      home.slug AS home_team_slug,home.logo_url AS home_logo,
      away.id AS away_team_id,COALESCE(at.name,away.slug) AS away_team_name,
      away.slug AS away_team_slug,away.logo_url AS away_logo,
      (SELECT es.score FROM event_scores es WHERE es.event_id=e.id AND es.participant_id=home.id ORDER BY es.id DESC LIMIT 1) AS home_score,
      (SELECT es.score FROM event_scores es WHERE es.event_id=e.id AND es.participant_id=away.id ORDER BY es.id DESC LIMIT 1) AS away_score
    FROM events e JOIN teams home ON home.id=e.home_team_id JOIN teams away ON away.id=e.away_team_id
    LEFT JOIN team_translations ht ON ht.team_id=home.id AND ht.language=?
    LEFT JOIN team_translations at ON at.team_id=away.id AND at.language=?
    WHERE e.competition_id=? ${seasonClause} AND NOT EXISTS(SELECT 1 FROM event_aliases ea WHERE ea.alias_event_id=e.id) ${extra} ORDER BY e.start_time ${options?.status==='scheduled'?'ASC':'DESC'},e.id ${options?'LIMIT ? OFFSET ?':''}
  `).all(...params) as Promise<MatchRow[]>
}

export function calculatedStandings(matches:MatchRow[]) {
  const table = new Map<number,any>()
  const team = (id:number,name:string,slug:string,logo:string|null) => {
    if (!table.has(id)) table.set(id,{team_id:id,team_name:name,team_slug:slug,team_logo:logo,played:0,wins:0,draws:0,losses:0,goals_for:0,goals_against:0,points:0})
    return table.get(id)
  }
  for (const match of matches) {
    const home=team(match.home_team_id,match.home_team_name,match.home_team_slug,match.home_logo)
    const away=team(match.away_team_id,match.away_team_name,match.away_team_slug,match.away_logo)
    if (match.status!=='finished' || match.home_score===null || match.away_score===null) continue
    home.played++; away.played++; home.goals_for+=match.home_score; home.goals_against+=match.away_score
    away.goals_for+=match.away_score; away.goals_against+=match.home_score
    if (match.home_score>match.away_score) { home.wins++; away.losses++; home.points+=3 }
    else if (match.home_score<match.away_score) { away.wins++; home.losses++; away.points+=3 }
    else { home.draws++; away.draws++; home.points++; away.points++ }
  }
  return [...table.values()].map(row=>({...row,goal_difference:row.goals_for-row.goals_against}))
    .sort((a,b)=>b.points-a.points||b.goal_difference-a.goal_difference||b.goals_for-a.goals_for||a.team_name.localeCompare(b.team_name))
    .map((row,index)=>({...row,position:index+1}))
}

export async function competitionTeams(competitionId:number, seasonId:number|null, lang:string) {
  const seasonClause=seasonId?'AND e.season_id=?':''
  const params=seasonId?[lang,competitionId,seasonId]:[lang,competitionId]
  return db.prepare(`
    SELECT t.id,t.external_id,t.slug,t.logo_url,COALESCE(tt.name,t.slug) AS name,COUNT(DISTINCT p.id) AS roster_size
    FROM teams t LEFT JOIN team_translations tt ON tt.team_id=t.id AND tt.language=?
    LEFT JOIN players p ON p.team_id=t.id AND p.active=1
    WHERE EXISTS (SELECT 1 FROM events e WHERE e.competition_id=? ${seasonClause} AND (e.home_team_id=t.id OR e.away_team_id=t.id))
    GROUP BY t.id ORDER BY name
  `).all(...params)
}
