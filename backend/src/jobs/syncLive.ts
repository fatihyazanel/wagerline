import { config } from '../config'
import { db, initDatabase, closeDatabase } from '../database/init'
import axios from 'axios'
import { quotaManager } from '../services/quota/quotaManager'

// Only update provider-mapped fixtures. Never synthesize scores or infer results.
async function syncLive() {
  const apiKey = config.providers.apisports.apiKey || process.env.API_FOOTBALL_KEY
  if (!apiKey || /your_|placeholder/i.test(apiKey)) throw new Error('Configure API_SPORTS_KEY or API_FOOTBALL_KEY before live synchronization.')
  await initDatabase()
  if (!quotaManager.canRequest('P0')) throw new Error('Live provider quota exhausted')
  quotaManager.consumeRequest()
  const { data } = await axios.get('https://v3.football.api-sports.io/fixtures', {
    params: { live: 'all' }, headers: { 'x-apisports-key': apiKey }, timeout: 15000,
  })
  if (Object.keys(data.errors || {}).length || !Array.isArray(data.response)) throw new Error('Live provider returned an invalid response')
  let updated = 0
  for (const fixture of data.response) {
    const event = await db.prepare(`SELECT e.id, e.home_team_id, e.away_team_id
      FROM events e JOIN competitions c ON c.id=e.competition_id
      WHERE e.external_id=? AND c.external_provider IN ('api-football','apisports','api-sports')`).get(String(fixture.fixture.id))
    if (!event || !event.home_team_id || !event.away_team_id) continue
    const home = fixture.goals.home, away = fixture.goals.away
    if (!Number.isInteger(home) || !Number.isInteger(away) || home < 0 || away < 0) continue
    await db.prepare('BEGIN IMMEDIATE').run()
    try {
      await db.prepare("UPDATE events SET status=?, updated_at=CURRENT_TIMESTAMP WHERE id=?").run(fixture.fixture.status.short === 'HT' ? 'halftime' : 'live', event.id)
      for (const [team, score] of [[event.home_team_id, home], [event.away_team_id, away]]) {
        await db.prepare(`INSERT INTO event_scores (event_id,participant_id,score,period) VALUES (?,?,?,0)
          ON CONFLICT(event_id,participant_id) DO UPDATE SET score=excluded.score`).run(event.id,team,score)
      }
      await db.prepare('COMMIT').run()
      updated++
    } catch (error) { await db.prepare('ROLLBACK').run(); throw error }
  }
  console.log({ received: data.response.length, updated, unmapped: data.response.length - updated })
}
syncLive().catch(error => { console.error(error instanceof Error ? error.message : 'Live synchronization failed'); process.exitCode=1 }).finally(closeDatabase)
