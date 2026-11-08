import fs from 'fs'
import assert from 'node:assert/strict'
import {db} from '../src/database/init'
import {parseTheSportsDbDetails,ensureTheSportsDbDetails,refreshTheSportsDbDetails} from '../src/services/thesportsdb-details'
async function main(){
 const read=(name:string)=>JSON.parse(fs.readFileSync(`../artifacts/tsdb-football-${name}.json`,'utf8'))
 const parts={stats:read('lookupeventstats'),timeline:read('lookuptimeline'),lineups:read('lookuplineup')}
 const parsed=parseTheSportsDbDetails({idEvent:'2494098'},1,2,parts)
 assert(parsed.statistics.length>0);assert.equal(parsed.lineups.length,2);assert(parsed.timeline.length>0)
 const wrong=parseTheSportsDbDetails({idEvent:'wrong'},1,2,parts);assert.equal(wrong.statistics.length+wrong.lineups.length+wrong.timeline.length,0)
 const empty=parseTheSportsDbDetails({idEvent:'2494098'},1,2,{});assert.equal(empty.statistics.length,0)
 console.log('Parser tests passed',JSON.stringify({statistics:parsed.statistics.length,timeline:parsed.timeline.length,lineups:parsed.lineups.length}))
 if(!process.argv.includes('--online'))return
 console.log('Online refresh',await refreshTheSportsDbDetails())
 const rows=await db.prepare('SELECT event_id,payload_json FROM thesportsdb_match_details').all()
 const report=rows.map(r=>{const d=JSON.parse(r.payload_json);return {id:r.event_id,statistics:d.statistics.length,timeline:d.timeline.length,lineups:d.lineups.length,checks:d.checks}})
 fs.writeFileSync('../artifacts/thesportsdb-details-acceptance.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report))
}
main().catch(e=>{console.error(e.message);process.exitCode=1}).finally(()=>setTimeout(()=>process.exit(process.exitCode||0),50))
