import axios from 'axios'
import {createHash} from 'crypto'
import {db} from '../database/init'
import {config} from '../config'
const slug=(s:string)=>s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
const digest=(s:string)=>createHash('sha256').update(s).digest('hex').slice(0,12)
const aliases:Record<string,string>={'english-premier-league':'premier-league','spanish-la-liga':'la-liga','italian-serie-a':'serie-a','german-bundesliga':'bundesliga','french-ligue-1':'ligue-1','turkish-super-league':'super-lig','netherlands-eredivisie':'eredivisie'}
export const sportscoreStatus={configured:config.providers.sportscore.enabled,running:false,last_attempt:null as string|null,last_success:null as string|null,received:0,imported:0,skipped:0,error:null as string|null,interval_seconds:120}
export function validSportscoreMatch(m:any){return m&&['home','away','competition','url','time'].every(k=>typeof m[k]==='string'&&m[k].length>0)&&m.home!==m.away&&m.url.startsWith('/football/match/')&&Number.isFinite(Date.parse(m.time))&&['scheduled','notstarted','upcoming','live','halftime','finished'].includes(m.status)&&(['scheduled','notstarted','upcoming'].includes(m.status)||[m.home_score,m.away_score].every(s=>/^\d+$/.test(String(s))))}
async function team(name:string,logo:string|null,sport:number){
 const normalized=slug(name),rows=await db.prepare("SELECT DISTINCT t.id FROM teams t LEFT JOIN team_translations n ON n.team_id=t.id AND n.language='en' WHERE t.active=1 AND t.sport_id=? AND (t.slug=? OR lower(n.name)=lower(?) OR EXISTS(SELECT 1 FROM team_aliases a WHERE a.team_id=t.id AND lower(a.alias)=lower(?)))").all(sport,normalized,name,name)
 if(rows.length>1)throw Error('Ambiguous team identity')
 if(rows.length)return rows[0].id as number
 const id=(await db.prepare('INSERT INTO teams(sport_id,external_id,slug,logo_url) VALUES(?,?,?,?)').run(sport,`sportscore-name:${name}`,`${normalized}-${digest(name)}`,logo)).lastID
 await db.prepare("INSERT INTO team_translations(team_id,language,name) VALUES(?,'en',?)").run(id,name);return id
}
export async function refreshSportscore(){
 if(sportscoreStatus.running||!sportscoreStatus.configured)return
 Object.assign(sportscoreStatus,{running:true,last_attempt:new Date().toISOString(),received:0,imported:0,skipped:0,error:null})
 try{
  await db.prepare('CREATE TABLE IF NOT EXISTS provider_event_records(provider TEXT,external_id TEXT,event_id INTEGER REFERENCES events(id),payload_json TEXT,updated_at TEXT DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY(provider,external_id))').run()
  const {data}=await axios.get(`${config.providers.sportscore.baseUrl}/matches`,{headers:{Authorization:`Bearer ${config.providers.sportscore.apiKey}`},params:{sport:'football',limit:200},timeout:20000})
  if(!Array.isArray(data.matches)||data.sport!=='football')throw Error('Unexpected SportScore response schema')
  sportscoreStatus.received=data.matches.length
  const sport=await db.prepare("SELECT id FROM sports WHERE slug='football'").get()
  for(const m of data.matches){
   if(!validSportscoreMatch(m)){sportscoreStatus.skipped++;continue}
   try{
    const compSlug=aliases[slug(m.competition)]||slug(m.competition)
    let c=await db.prepare('SELECT id FROM competitions WHERE sport_id=? AND slug=?').get(sport.id,compSlug)
    if(!c){const id=(await db.prepare('INSERT INTO competitions(sport_id,external_provider,external_id,slug,name_key) VALUES(?,?,?,?,?)').run(sport.id,'sportscore',m.competition,compSlug||`competition-${digest(m.competition)}`,m.competition)).lastID;c={id}}
    const logo=(url:unknown)=>typeof url==='string'&&url.startsWith('https://')?url:null
    if(logo(m.competition_logo))await db.prepare('INSERT OR IGNORE INTO competition_assets(competition_id,logo_url,source_url) VALUES(?,?,?)').run(c.id,m.competition_logo,m.competition_logo)
    const home=await team(m.home,logo(m.home_logo),sport.id),away=await team(m.away,logo(m.away_logo),sport.id),external=`sportscore:${m.url}`
    let e=await db.prepare('SELECT event_id AS id FROM provider_event_records WHERE provider=? AND external_id=?').get('sportscore',m.url)
    if(!e)e=await db.prepare("SELECT id FROM events WHERE external_id=? OR (competition_id=? AND home_team_id=? AND away_team_id=? AND ABS(julianday(start_time)-julianday(?))<0.0035)").get(external,c.id,home,away,m.time)
    const start=new Date(m.time).toISOString(),state=['notstarted','upcoming'].includes(m.status)?'scheduled':m.status
    if(!e){const season=await db.prepare('SELECT id FROM seasons WHERE competition_id=? AND is_current=1 ORDER BY id DESC LIMIT 1').get(c.id);e={id:(await db.prepare("INSERT INTO events(sport_id,competition_id,season_id,external_id,event_type,start_time,status,home_team_id,away_team_id) VALUES(?,?,?,?,'match',?,'scheduled',?,?)").run(sport.id,c.id,season?.id||null,external,start,home,away)).lastID}}
    const alias=await db.prepare('SELECT canonical_event_id FROM event_aliases WHERE alias_event_id=?').get(e.id)
    if(alias)e.id=alias.canonical_event_id
    const stored=await db.prepare('SELECT status FROM events WHERE id=?').get(e.id)
    if((stored?.status==='finished'&&state!=='finished')||(state==='scheduled'&&['live','halftime'].includes(stored?.status))){sportscoreStatus.skipped++;continue}
    for(const [id,role,score]of [[home,'home',m.home_score],[away,'away',m.away_score]]){
     await db.prepare("INSERT INTO event_participants(event_id,participant_type,participant_id,role) SELECT ?,'team',?,? WHERE NOT EXISTS(SELECT 1 FROM event_participants WHERE event_id=? AND participant_id=? AND role=?)").run(e.id,id,role,e.id,id,role)
     if(state!=='scheduled'){const old=await db.prepare('SELECT id FROM event_scores WHERE event_id=? AND participant_id=? ORDER BY id DESC LIMIT 1').get(e.id,id);if(old)await db.prepare('UPDATE event_scores SET score=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').run(Number(score),old.id);else await db.prepare('INSERT INTO event_scores(event_id,participant_id,score,period) VALUES(?,?,?,0)').run(e.id,id,Number(score))}
    }
    await db.prepare('UPDATE events SET status=?,start_time=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').run(state,start,e.id)
    await db.prepare("INSERT INTO provider_event_records(provider,external_id,event_id,payload_json) VALUES('sportscore',?,?,?) ON CONFLICT(provider,external_id) DO UPDATE SET event_id=excluded.event_id,payload_json=excluded.payload_json,updated_at=CURRENT_TIMESTAMP").run(m.url,e.id,JSON.stringify(m));sportscoreStatus.imported++
   }catch{sportscoreStatus.skipped++}
  }
  sportscoreStatus.last_success=new Date().toISOString()
 }catch(e){sportscoreStatus.error=e instanceof Error?e.message:'Provider request failed'}finally{
  sportscoreStatus.running=false
  await db.prepare("INSERT INTO sync_logs(provider,resource,status,request_count) VALUES('sportscore','football-matches',?,1)").run(sportscoreStatus.error?'error':sportscoreStatus.skipped?'partial':'success')
 }
}
