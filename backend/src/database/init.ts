import sqlite3 from 'sqlite3'
import fs from 'fs'
import path from 'path'
import { config } from '../config'
import {withSqliteRetry} from './retry'

const dbPath = config.database.path
const dataDir = path.dirname(dbPath)
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

let dbInstance: sqlite3.Database | null = null

export const getDb = () => {
  if (!dbInstance) {
    dbInstance = new sqlite3.Database(dbPath, error => {
      if (error) console.error('Database connection error:', error)
      else {
        dbInstance!.run('PRAGMA journal_mode = WAL')
        dbInstance!.run('PRAGMA foreign_keys = ON')
        console.log('Database connected')
      }
    })
    dbInstance.configure('busyTimeout', 10000)
  }
  return dbInstance
}

const sqliteDb = getDb()

export const db = {
  prepare: (sql: string) => ({
    all: (...params: any[]) => withSqliteRetry(()=>new Promise<any[]>((resolve, reject) => {
      sqliteDb.all(sql, params, (error, rows) => error ? reject(error) : resolve(rows || []))
    })),
    get: (...params: any[]) => withSqliteRetry(()=>new Promise<any>((resolve, reject) => {
      sqliteDb.get(sql, params, (error, row) => error ? reject(error) : resolve(row || null))
    })),
    run: (...params: any[]) => withSqliteRetry(()=>new Promise<{ lastID: number; changes: number }>((resolve, reject) => {
      sqliteDb.run(sql, params, function(error) {
        if (error) reject(error)
        else resolve({ lastID: this.lastID, changes: this.changes })
      })
    })),
  }),
  all: (sql: string, params: any[] = [], callback?: (error: Error | null, rows: any[]) => void) => {
    return sqliteDb.all(sql, params, callback)
  },
  get: (sql: string, params: any[] = [], callback?: (error: Error | null, row: any) => void) => {
    return sqliteDb.get(sql, params, callback)
  },
  run: (sql: string, params: any[] = [], callback?: (this: sqlite3.RunResult, error: Error | null) => void) => {
    return sqliteDb.run(sql, params, callback)
  },
}

const run = (database: sqlite3.Database, sql: string) => new Promise<void>((resolve, reject) => {
  database.run(sql, error => error ? reject(error) : resolve())
})

const all = <T>(database: sqlite3.Database, sql: string) => new Promise<T[]>((resolve, reject) => {
  database.all(sql, (error, rows) => error ? reject(error) : resolve(rows as T[]))
})

async function ensurePlayerTeamRelation(database: sqlite3.Database) {
  const columns = await all<{ name: string }>(database, 'PRAGMA table_info(players)')
  if (!columns.some(column => column.name === 'team_id')) {
    await run(database, 'ALTER TABLE players ADD COLUMN team_id INTEGER REFERENCES teams(id) ON DELETE SET NULL')
  }
  await run(database, 'CREATE INDEX IF NOT EXISTS idx_players_team ON players(team_id)')

  const tables = await all<{ name: string }>(database, "SELECT name FROM sqlite_master WHERE type='table' AND name='player_team_assignments'")
  if (tables.length) {
    await run(database, `
      UPDATE players SET team_id = (
        SELECT pta.team_id FROM player_team_assignments pta
        JOIN teams valid_team ON valid_team.id = pta.team_id
        WHERE pta.player_id = players.id
        ORDER BY COALESCE(pta.is_active, 1) DESC, pta.season_id DESC, pta.id DESC LIMIT 1
      )
      WHERE team_id IS NULL
        AND EXISTS (
          SELECT 1 FROM player_team_assignments pta
          JOIN teams valid_team ON valid_team.id = pta.team_id
          WHERE pta.player_id = players.id
        )
    `)
  }
}

export const initDatabase = async () => {
  const database = getDb()
  let schemaPath = path.join(__dirname, 'schema.sql')
  if (!fs.existsSync(schemaPath)) schemaPath = path.join(__dirname, '..', '..', 'src', 'database', 'schema.sql')
  if (!fs.existsSync(schemaPath)) schemaPath = path.join(process.cwd(), 'src', 'database', 'schema.sql')
  if (!fs.existsSync(schemaPath)) throw new Error(`Schema file not found at ${schemaPath}`)

  const statements = fs.readFileSync(schemaPath, 'utf-8').split(';').filter(statement => statement.trim())
  for (const statement of statements) await run(database, statement)
  await ensurePlayerTeamRelation(database)
  console.log('Database initialized')
}

export const closeDatabase = () => new Promise<void>((resolve, reject) => {
  if (!dbInstance) return resolve()
  dbInstance.close(error => error ? reject(error) : resolve())
})
