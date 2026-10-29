import dotenv from 'dotenv'
import { closeDatabase, getDb, initDatabase } from '../database/init'
import { theSportsDbClient } from '../providers/theSportsDb/client'

dotenv.config()
const database = getDb()

const all = <T>(sql:string,params:any[]=[]):Promise<T[]> => new Promise((resolve,reject) => {
  database.all(sql,params,(error,rows)=>error?reject(error):resolve(rows as T[]))
})
const get = <T>(sql:string,params:any[]=[]):Promise<T|undefined> => new Promise((resolve,reject) => {
  database.get(sql,params,(error,row)=>error?reject(error):resolve(row as T|undefined))
})
const run = (sql:string,params:any[]=[]):Promise<{lastID:number;changes:number}> => new Promise((resolve,reject) => {
  database.run(sql,params,function(error){error?reject(error):resolve({lastID:this.lastID,changes:this.changes})})
})

const slugify = (value:string) => value.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
  .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,60)

async function upsertPlayer(player:any,teamId:number,seasonId:number,sportId:number) {
  const externalId=String(player.idPlayer)
  let existing=await get<{id:number}>('SELECT id FROM players WHERE external_id=?',[externalId])
  let playerId=existing?.id
  const image=player.strCutout||player.strThumb||null

  if (playerId) {
    await run(`UPDATE players SET team_id=?,position=?,image_url=COALESCE(?,image_url),active=1 WHERE id=?`,
      [teamId,player.strPosition||null,image,playerId])
  } else {
    const base=slugify(player.strPlayer)||`player-${externalId}`
    const occupied=await get<{id:number}>('SELECT id FROM players WHERE slug=?',[base])
    const slug=occupied?`${base}-${externalId}`:base
    const result=await run(`INSERT INTO players (sport_id,team_id,external_id,slug,image_url,position,active) VALUES (?,?,?,?,?,?,1)`,
      [sportId,teamId,externalId,slug,image,player.strPosition||null])
    playerId=result.lastID
  }

  await run(`INSERT INTO player_translations (player_id,language,name) VALUES (?,'en',?)
    ON CONFLICT(player_id,language) DO UPDATE SET name=excluded.name`,[playerId,player.strPlayer])
  await run(`INSERT INTO player_extended_info
    (player_id,external_id,date_of_birth,nationality,cutout_image_url,updated_at)
    VALUES (?,?,?,?,?,CURRENT_TIMESTAMP)
    ON CONFLICT(player_id) DO UPDATE SET external_id=excluded.external_id,
      date_of_birth=COALESCE(excluded.date_of_birth,date_of_birth),
      nationality=COALESCE(excluded.nationality,nationality),
      cutout_image_url=COALESCE(excluded.cutout_image_url,cutout_image_url),updated_at=CURRENT_TIMESTAMP`,
    [playerId,externalId,player.dateBorn||null,player.strNationality||null,image])
  await run(`INSERT INTO player_team_assignments
    (player_id,team_id,season_id,shirt_number,position,is_active,updated_at)
    VALUES (?,?,?,?,?,1,CURRENT_TIMESTAMP)
    ON CONFLICT(player_id,team_id,season_id) DO UPDATE SET
      shirt_number=excluded.shirt_number,position=excluded.position,is_active=1,updated_at=CURRENT_TIMESTAMP`,
    [playerId,teamId,seasonId,player.strNumber?Number.parseInt(player.strNumber,10)||null:null,player.strPosition||null])
}

async function main() {
  await initDatabase()
  const competition=await get<{id:number}>("SELECT id FROM competitions WHERE slug='super-lig'")
  if (!competition) throw new Error('super-lig competition not found')
  const season=await get<{id:number}>(`SELECT id FROM seasons WHERE competition_id=? ORDER BY is_current DESC,id DESC LIMIT 1`,[competition.id])
  if (!season) throw new Error('current super-lig season not found')
  const teams=await all<{id:number;external_id:string;name:string}>(`
    SELECT DISTINCT t.id,t.external_id,COALESCE(tt.name,t.slug) AS name
    FROM events e JOIN teams t ON t.id=e.home_team_id OR t.id=e.away_team_id
    LEFT JOIN team_translations tt ON tt.team_id=t.id AND tt.language='en'
    WHERE e.competition_id=? AND e.season_id=? AND t.external_id IS NOT NULL ORDER BY name
  `,[competition.id,season.id])
  const sport=await get<{sport_id:number}>('SELECT sport_id FROM competitions WHERE id=?',[competition.id])

  let synced=0
  for (const team of teams) {
    const players=await theSportsDbClient.getPlayers(Number(team.external_id))
    let teamCount=0
    for (const player of players) {
      if (!player.idPlayer||!player.strPlayer||/coach|manager|staff/i.test(player.strPosition||'')) continue
      await upsertPlayer(player,team.id,season.id,sport!.sport_id)
      synced++; teamCount++
    }
    console.log(`${team.name}: ${teamCount} real players linked`)
  }
  console.log(`Super Lig roster sync complete: ${teams.length} teams, ${synced} players`)
}

main().then(closeDatabase).catch(async error=>{
  console.error(error)
  await closeDatabase().catch(()=>undefined)
  process.exitCode=1
})
