import {db} from '../src/database/init'
import {parseSportscoreDetails} from '../src/services/sportscore-details'
import fs from 'fs'
import assert from 'node:assert/strict'
async function main(){
 const record=await db.prepare("SELECT p.*,e.home_team_id,e.away_team_id,e.start_time FROM provider_event_records p JOIN events e ON e.id=p.event_id WHERE p.provider='sportscore' AND p.event_id=22874").get()
 const html=fs.readFileSync('../artifacts/sportscore-page-match.html','utf8')
 const data=parseSportscoreDetails(html,record)
 console.log(Object.fromEntries(Object.entries(data).map(([k,v])=>[k,Array.isArray(v)?v.length:v])))
 for(const key of ['statistics','timeline','lineups','h2h','odds','performers'] as const)assert(data[key].length>0,key)
 assert.throws(()=>parseSportscoreDetails(html,{...record,start_time:'2020-01-01'}),/identity/)
 assert.throws(()=>parseSportscoreDetails(html,{...record,payload_json:JSON.stringify({home:'Wrong team',away:'Other team'})}),/identity/)
 assert(data.h2h.every(r=>Date.parse(r.start_time)<Date.parse(record.start_time)))
 assert(data.performers.every(p=>p.rating===undefined))
 console.log('PASS: all six modules, match identity, cutoff, no invented ratings')
}
main().catch(e=>{console.error(e.message);process.exitCode=1}).finally(()=>setTimeout(()=>process.exit(process.exitCode||0),50))
