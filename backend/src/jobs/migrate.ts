import { initDatabase, closeDatabase } from '../database/init'

initDatabase().catch(error => {
  console.error(error)
  process.exitCode = 1
}).finally(closeDatabase)
