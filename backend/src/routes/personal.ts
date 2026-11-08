import {registerShop} from './shop'
import {registerGoogleLogin} from '../services/google-login'
import {wallet} from '../services/shop-store'
import {accountFor,initAccounts,registerAccounts,setProfileCookie} from '../services/personal-accounts'
import {FastifyInstance,FastifyRequest,FastifyReply} from 'fastify'
import {randomBytes,createHash} from 'crypto'
import {db} from '../database/init'

export async function personalRoutes(app:FastifyInstance){
 await db.prepare(`CREATE TABLE IF NOT EXISTS personal_profiles(id TEXT PRIMARY KEY,name TEXT NOT NULL DEFAULT 'Matchday explorer',created_at TEXT DEFAULT CURRENT_TIMESTAMP)`).run()
 const columns=await db.prepare('PRAGMA table_info(personal_profiles)').all()
 if(!columns.some(c=>c.name==='favorite_team_id'))await db.prepare('ALTER TABLE personal_profiles ADD COLUMN favorite_team_id INTEGER REFERENCES teams(id)').run()
 await db.prepare(`CREATE TABLE IF NOT EXISTS personal_picks(profile_id TEXT REFERENCES personal_profiles(id),event_id INTEGER REFERENCES events(id),outcome TEXT CHECK(outcome IN ('home','draw','away')),created_at TEXT DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY(profile_id,event_id))`).run()
 await db.prepare(`CREATE TABLE IF NOT EXISTS personal_challenges(slug TEXT PRIMARY KEY,name TEXT,description TEXT,target INTEGER,xp INTEGER,icon TEXT)`).run()
 await db.prepare(`CREATE TABLE IF NOT EXISTS personal_claims(profile_id TEXT REFERENCES personal_profiles(id),challenge_slug TEXT REFERENCES personal_challenges(slug),created_at TEXT DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY(profile_id,challenge_slug))`).run()
 for(const c of [['first-call','First call','Save your first pre-match prediction.',1,50,'target'],['matchday-five','Matchday five','Build a journal of five match predictions.',5,150,'flame'],['season-scout','Season scout','Record twenty distinct match predictions.',20,400,'trophy']]) await db.prepare('INSERT OR IGNORE INTO personal_challenges VALUES(?,?,?,?,?,?)').run(...c)
 for(const l of [[1,'Explorer',0,199],[2,'Contender',200,599],[3,'Matchday expert',600,1499],[4,'Club legend',1500,999999]])await db.prepare('INSERT OR IGNORE INTO levels(level_number,name,min_xp,max_xp) VALUES(?,?,?,?)').run(...l)
 await db.prepare('CREATE TABLE IF NOT EXISTS personal_xp_ledger(profile_id TEXT REFERENCES personal_profiles(id) ON DELETE CASCADE,entry_key TEXT,amount INTEGER NOT NULL,updated_at TEXT DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY(profile_id,entry_key))').run()
 await db.prepare('CREATE TABLE IF NOT EXISTS personal_xp_revisions(id INTEGER PRIMARY KEY,profile_id TEXT REFERENCES personal_profiles(id) ON DELETE CASCADE,entry_key TEXT,old_amount INTEGER,new_amount INTEGER,created_at TEXT DEFAULT CURRENT_TIMESTAMP)').run()
 await db.prepare('CREATE TRIGGER IF NOT EXISTS audit_xp_change AFTER UPDATE OF amount ON personal_xp_ledger WHEN OLD.amount<>NEW.amount BEGIN INSERT INTO personal_xp_revisions(profile_id,entry_key,old_amount,new_amount) VALUES(NEW.profile_id,NEW.entry_key,OLD.amount,NEW.amount); END').run()
 await db.prepare('CREATE TABLE IF NOT EXISTS individual_picks(profile_id TEXT REFERENCES personal_profiles(id) ON DELETE CASCADE,contest_id TEXT REFERENCES individual_contests(id),selection TEXT,created_at TEXT DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY(profile_id,contest_id))').run()
 await initAccounts()
 async function identity(req:FastifyRequest,reply:FastifyReply){
  const account=await accountFor(req);if(account)return account.profile_id as string
  let token=req.headers.cookie?.split(';').map(s=>s.trim()).find(s=>s.startsWith('wl_profile='))?.slice(11)
  if(!token||!/^[a-f0-9]{64}$/.test(token)){token=randomBytes(32).toString('hex');reply.header('Set-Cookie',`wl_profile=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000${req.protocol==='https'?'; Secure':''}`)}
  let id=createHash('sha256').update(token).digest('hex')
  if(await db.prepare('SELECT id FROM personal_accounts WHERE profile_id=?').get(id)){token=randomBytes(32).toString('hex');id=createHash('sha256').update(token).digest('hex');setProfileCookie(reply,req,token)}
  await db.prepare('INSERT OR IGNORE INTO personal_profiles(id) VALUES(?)').run(id);return id
 }
 async function snapshot(id:string){
  const rawPicks=await db.prepare(`SELECT e.id AS event_id,p.outcome,p.created_at,COALESCE(hn.name,h.slug) AS home,COALESCE(an.name,a.slug) AS away,h.logo_url AS home_logo,a.logo_url AS away_logo,e.status,e.start_time,
   (SELECT score FROM event_scores WHERE event_id=e.id AND participant_id=h.id ORDER BY id DESC LIMIT 1) AS home_score,
   (SELECT score FROM event_scores WHERE event_id=e.id AND participant_id=a.id ORDER BY id DESC LIMIT 1) AS away_score
   FROM personal_picks p JOIN events e ON e.id=COALESCE((SELECT canonical_event_id FROM event_aliases WHERE alias_event_id=p.event_id),p.event_id) JOIN teams h ON h.id=e.home_team_id JOIN teams a ON a.id=e.away_team_id LEFT JOIN team_translations hn ON hn.team_id=h.id AND hn.language='en' LEFT JOIN team_translations an ON an.team_id=a.id AND an.language='en' WHERE profile_id=? ORDER BY p.created_at DESC`).all(id)
  const individual=await db.prepare('SELECT p.*,c.id canonical_id,c.sport,c.title,c.status,c.start_time,c.payload_json FROM individual_picks p JOIN individual_contests c ON c.id=COALESCE((SELECT canonical_id FROM individual_aliases WHERE alias_id=p.contest_id),p.contest_id) WHERE p.profile_id=? ORDER BY p.created_at DESC').all(id)
  for(const p of individual){const payload=JSON.parse(p.payload_json);let winner:string|null=null;if(p.status==='finished'){if(p.sport==='formula-1')winner=payload.Results?.find((r:any)=>String(r.position)==='1')?.Driver.driverId||null;else if(/^\d+$/.test(String(payload.home_score))&&/^\d+$/.test(String(payload.away_score)))winner=Number(payload.home_score)>Number(payload.away_score)?'home':Number(payload.away_score)>Number(payload.home_score)?'away':null}
   rawPicks.push({event_id:p.canonical_id,outcome:p.selection,created_at:p.created_at,home:p.sport==='tennis'?payload.home:p.title,away:p.sport==='tennis'?payload.away:'Race winner',home_logo:null,away_logo:null,status:p.status,start_time:p.start_time,home_score:null,away_score:null,individual_result:winner?(p.selection===winner?'correct':'incorrect'):null})}
  const picks=rawPicks.filter((p,i)=>rawPicks.findIndex(q=>q.event_id===p.event_id)===i)
  let correct=0,settled=0
  for(const p of picks){if(p.individual_result){p.result=p.individual_result;settled++;if(p.result==='correct')correct++;continue}p.result=['cancelled','canceled','abandoned','void'].includes(p.status)?'void':null;if(p.status==='finished'&&p.home_score!=null&&p.away_score!=null){settled++;p.result=p.outcome===(p.home_score>p.away_score?'home':p.home_score<p.away_score?'away':'draw')?'correct':'incorrect';if(p.result==='correct')correct++}}
  const challenges=await db.prepare('SELECT c.*,EXISTS(SELECT 1 FROM personal_claims p WHERE p.challenge_slug=c.slug AND p.profile_id=?) AS claimed FROM personal_challenges c ORDER BY target').all(id)
  const entries:[string,number][]=[]
  for(const p of picks){entries.push(['pick:'+p.event_id,10],['result:'+p.event_id,p.result==='correct'?25:0])}
  for(const c of challenges)if(c.claimed)entries.push(['challenge:'+c.slug,c.xp])
  for(const [key,amount]of entries)await db.prepare('INSERT INTO personal_xp_ledger(profile_id,entry_key,amount) VALUES(?,?,?) ON CONFLICT(profile_id,entry_key) DO UPDATE SET amount=excluded.amount,updated_at=CURRENT_TIMESTAMP WHERE amount<>excluded.amount').run(id,key,amount)
  const keys=new Set(entries.map(e=>e[0]));for(const old of await db.prepare('SELECT entry_key FROM personal_xp_ledger WHERE profile_id=?').all(id))if(!keys.has(old.entry_key))await db.prepare('UPDATE personal_xp_ledger SET amount=0,updated_at=CURRENT_TIMESTAMP WHERE profile_id=? AND entry_key=? AND amount<>0').run(id,old.entry_key)
  const xp=(await db.prepare('SELECT COALESCE(SUM(amount),0) xp FROM personal_xp_ledger WHERE profile_id=?').get(id)).xp
  return {wallet:await wallet(id),profile:await db.prepare('SELECT name,created_at,favorite_team_id,(SELECT logo_url FROM teams WHERE id=favorite_team_id) AS team_logo FROM personal_profiles WHERE id=?').get(id),picks,challenges,xp,correct,settled,levels:await db.prepare('SELECT * FROM levels ORDER BY min_xp').all()}
 }
 app.addHook('preHandler',async(req,reply)=>{if(req.method!=='GET'&&!req.headers['content-type']?.startsWith('application/json'))return reply.code(415).send({error:'JSON required'})})
 app.addHook('preValidation',async(req,reply)=>{if(!['GET','HEAD','OPTIONS'].includes(req.method)&&req.headers.origin&&req.headers.origin!==(process.env.APP_ORIGIN||'http://localhost:3000'))return reply.code(403).send({error:'Request origin is not allowed'})})
 await registerAccounts(app,identity)
 await registerGoogleLogin(app,identity)
 await registerShop(app,snapshot)
 app.get('/',async(req,reply)=>({data:await snapshot(await identity(req,reply))}))
 app.get('/teams',async()=>({data:await db.prepare("SELECT t.id,COALESCE(n.name,t.slug) AS name,t.logo_url FROM teams t LEFT JOIN team_translations n ON n.team_id=t.id AND n.language='en' WHERE t.logo_url IS NOT NULL AND t.active=1 ORDER BY name").all()}))
 app.put('/favorite-team',async(req,reply)=>{const team=(req.body as {team_id?:unknown})?.team_id;if(team!==null&&(!Number.isInteger(team)||!await db.prepare('SELECT id FROM teams WHERE id=?').get(team)))return reply.code(400).send({error:'Select a valid team'});const id=await identity(req,reply);await db.prepare('UPDATE personal_profiles SET favorite_team_id=? WHERE id=?').run(team,id);return {data:await snapshot(id)}})
 app.put('/profile',async(req,reply)=>{const name=(req.body as {name?:unknown})?.name;if(typeof name!=='string'||!name.trim()||name.length>40)return reply.code(400).send({error:'Name must contain 1–40 characters'});const id=await identity(req,reply);await db.prepare('UPDATE personal_profiles SET name=? WHERE id=?').run(name.trim(),id);return {data:await snapshot(id)}})
 app.put('/individual-picks',async(req,reply)=>{const b=req.body as {contest_id?:string;selection?:string};const c=typeof b?.contest_id==='string'?await db.prepare("SELECT * FROM individual_contests WHERE id=COALESCE((SELECT canonical_id FROM individual_aliases WHERE alias_id=?),?) AND status='scheduled' AND datetime(start_time)>datetime('now')").get(b.contest_id,b.contest_id):null;if(!c)return reply.code(409).send({error:'Predictions close at the start'});const payload=JSON.parse(c.payload_json);let allowed:string[]=['home','away'];if(c.sport==='formula-1'){const list=await db.prepare("SELECT payload_json FROM individual_standings WHERE sport='formula-1' AND category='driverStandings'").get();allowed=list?JSON.parse(list.payload_json).DriverStandings?.map((r:any)=>r.Driver.driverId)||[]:[]}
 if(!b.selection||!allowed.includes(b.selection))return reply.code(400).send({error:'Select a valid participant'});const id=await identity(req,reply);await db.prepare('INSERT INTO individual_picks(profile_id,contest_id,selection) VALUES(?,?,?) ON CONFLICT(profile_id,contest_id) DO UPDATE SET selection=excluded.selection').run(id,c.id,b.selection);return {data:await snapshot(id)}})
 app.put('/picks',async(req,reply)=>{
  const b=req.body as {event_id:number;outcome:string};if(!Number.isInteger(b?.event_id)||!['home','draw','away'].includes(b?.outcome))return reply.code(400).send({error:'Invalid prediction'})
  const id=await identity(req,reply)
  const eventSport=await db.prepare('SELECT s.slug FROM events e JOIN sports s ON s.id=e.sport_id WHERE e.id=?').get(b.event_id)
  if(b.outcome==='draw'&&eventSport&&!['football','american-football'].includes(eventSport.slug))return reply.code(400).send({error:'Draw is not a valid final-result selection for this sport'})
  const alias=await db.prepare('SELECT canonical_event_id FROM event_aliases WHERE alias_event_id=?').get(b.event_id)
  if(alias)b.event_id=alias.canonical_event_id
  const result=await db.prepare(`INSERT INTO personal_picks(profile_id,event_id,outcome) SELECT ?,id,? FROM events WHERE id=? AND status='scheduled' AND datetime(start_time)>datetime('now') ON CONFLICT(profile_id,event_id) DO UPDATE SET outcome=excluded.outcome`).run(id,b.outcome,b.event_id)
  if(!result.changes)return reply.code(409).send({error:'Predictions close at kick-off'})
  return {data:await snapshot(id)}
 })
 app.post('/claims/:slug',async(req,reply)=>{const id=await identity(req,reply);const {slug}=req.params as {slug:string};const result=await db.prepare(`INSERT OR IGNORE INTO personal_claims(profile_id,challenge_slug) SELECT ?,slug FROM personal_challenges WHERE slug=? AND target<=((SELECT COUNT(DISTINCT COALESCE((SELECT canonical_id FROM individual_aliases WHERE alias_id=contest_id),contest_id)) FROM individual_picks WHERE profile_id=?)+(SELECT COUNT(DISTINCT COALESCE((SELECT canonical_event_id FROM event_aliases WHERE alias_event_id=personal_picks.event_id),event_id)) FROM personal_picks WHERE profile_id=?))`).run(id,slug,id,id);if(!result.changes)return reply.code(409).send({error:'Challenge is incomplete or already claimed'});return {data:await snapshot(id)}})
}
