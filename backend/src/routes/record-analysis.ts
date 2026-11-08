import {FastifyInstance} from 'fastify'
import {db} from '../database/init'
export async function recordAnalysisRoutes(app:FastifyInstance){
 app.get('/analysis/:id',async(req,reply)=>{
  const {id}=req.params as {id:string};const e=await db.prepare('SELECT * FROM events WHERE id=COALESCE((SELECT canonical_event_id FROM event_aliases WHERE alias_event_id=?),?)').get(id,id);
  if(!e)return reply.code(404).send({error:'Match not found'})
  const form=await Promise.all([e.home_team_id,e.away_team_id].map(async team=>{
   const rows=await db.prepare(`SELECT * FROM (SELECT m.id,m.start_time,m.home_team_id,m.away_team_id,(SELECT score FROM event_scores WHERE event_id=m.id AND participant_id=m.home_team_id ORDER BY id DESC LIMIT 1) home_score,(SELECT score FROM event_scores WHERE event_id=m.id AND participant_id=m.away_team_id ORDER BY id DESC LIMIT 1) away_score FROM events m WHERE m.status='finished' AND (m.home_team_id=? OR m.away_team_id=?) AND datetime(m.start_time)<datetime(?) AND NOT EXISTS(SELECT 1 FROM event_aliases a WHERE a.alias_event_id=m.id)) WHERE home_score IS NOT NULL AND away_score IS NOT NULL ORDER BY datetime(start_time) DESC,id DESC LIMIT 5`).all(team,team,e.start_time)
   let wins=0,draws=0,losses=0,scored=0,conceded=0;
   for(const r of rows){const home=r.home_team_id===team,a=Number(home?r.home_score:r.away_score),b=Number(home?r.away_score:r.home_score);scored+=a;conceded+=b;if(a>b)wins++;else if(a===b)draws++;else losses++}
   return {team_id:team,sample:rows.length,wins,draws,losses,scored,conceded,matches:rows}
  }))
  const p=await db.prepare('SELECT home_probability,draw_probability,away_probability,model_version,generated_at FROM predictions WHERE event_id=? ORDER BY generated_at DESC,id DESC LIMIT 1').get(e.id)
  const probabilities=p?[p.home_probability,p.draw_probability,p.away_probability]:[];
  const model=probabilities.length===3&&probabilities.every(n=>typeof n==='number'&&n>=0&&n<=1)&&Math.abs(probabilities.reduce((a,b)=>a+b,0)-1)<0.01?p:null
  return {data:{event_id:e.id,cutoff:e.start_time,form,model,method:'Last five finished canonical matches before this fixture, excluding missing scores. Model probabilities are estimates, not guarantees.',quality:form.every(f=>f.sample>=3)?'form-available':'limited-history'}}
 })
}
