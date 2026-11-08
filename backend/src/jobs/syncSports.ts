import { initDatabase, closeDatabase } from '../database/init'
import { dataSyncService } from '../services/data-sync.service'

async function main() {
  await initDatabase()
  const sports = await dataSyncService.syncSports()
  const competitions = await dataSyncService.syncCompetitions()
  console.log({ sports, competitions })
  if (!sports.success || !competitions.success) process.exitCode = 1
}
main().catch(error => { console.error(error); process.exitCode = 1 }).finally(closeDatabase)
