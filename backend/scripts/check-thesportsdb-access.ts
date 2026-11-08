import {config} from '../src/config'
import {db} from '../src/database/init'
async function main(){
 for(const endpoint of ['eventspastleague.php?id=4328','lookupeventstats.php?id=2494098']){const r=await fetch(`${config.providers.thesportsdb.baseUrl}/${config.providers.thesportsdb.apiKey}/${endpoint}`);const t=await r.text();let data:any;try{data=JSON.parse(t)}catch{}console.log({endpoint,http:r.status,keys:data?Object.keys(data):[],count:data?.events?.length||data?.eventstats?.length||0,usesPublicTestKey:config.providers.thesportsdb.apiKey==='123'})}
 console.log(await db.prepare("SELECT e.id,e.start_time,hn.name home,an.name away,c.slug FROM events e JOIN competitions c ON c.id=e.competition_id LEFT JOIN team_translations hn ON hn.team_id=e.home_team_id AND hn.language='en' LEFT JOIN team_translations an ON an.team_id=e.away_team_id AND an.language='en' WHERE c.slug='premier-league' AND date(e.start_time)='2026-11-07'").all())
}
main().catch(e=>console.log(e.message)).finally(()=>setTimeout(()=>process.exit(0),50))
