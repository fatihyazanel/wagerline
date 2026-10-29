import axios from 'axios'
import { db } from '../database/init'
import { config } from '../config'

interface SyncResult {
  success: boolean
  created: number
  updated: number
  errors: string[]
  duration: number
}

class DataSyncService {
  private sportscore = axios.create({
    baseURL: 'https://sportscore.com/api/widget',
    headers: {
      'Authorization': `Bearer ${config.providers.sportscore.apiKey}`,
    },
    timeout: 10000,
  })

  private sportdb = axios.create({
    baseURL: 'https://api.sportdb.dev/api',
    headers: {
      'X-API-Key': config.providers.sportdb.apiKey,
    },
    timeout: 10000,
  })

  private thesportsdb = axios.create({
    baseURL: 'https://www.thesportsdb.com/api/v1/json/123',
    timeout: 10000,
  })

  async syncSports(): Promise<SyncResult> {
    console.log('🔄 Syncing sports...')
    const start = Date.now()
    const errors: string[] = []
    let created = 0

    const SPORTS = [
      { slug: 'football', name_key: 'sports.football', icon: '⚽' },
      { slug: 'basketball', name_key: 'sports.basketball', icon: '🏀' },
      { slug: 'american-football', name_key: 'sports.american_football', icon: '🏈' },
      { slug: 'ice-hockey', name_key: 'sports.ice_hockey', icon: '🏒' },
      { slug: 'formula-1', name_key: 'sports.formula_1', icon: '🏎️' },
    ]

    try {
      for (const sport of SPORTS) {
        await new Promise<void>((resolve, reject) => {
          db.get('SELECT id FROM sports WHERE slug = ?', [sport.slug], (err, existing) => {
            if (err) {
              reject(err)
              return
            }
            if (!existing) {
              db.run(
                'INSERT INTO sports (slug, name_key, icon, status) VALUES (?, ?, ?, ?)',
                [sport.slug, sport.name_key, sport.icon, 'active'],
                (err) => {
                  if (!err) {
                    created++
                    console.log(`  ✅ ${sport.slug}`)
                  }
                  resolve()
                }
              )
            } else {
              resolve()
            }
          })
        })
      }
    } catch (error) {
      errors.push(`Sports sync: ${error instanceof Error ? error.message : 'Unknown'}`)
    }

    return {
      success: errors.length === 0,
      created,
      updated: 0,
      errors,
      duration: Date.now() - start,
    }
  }

  async syncCompetitions(): Promise<SyncResult> {
    console.log('🔄 Syncing competitions...')
    const start = Date.now()
    const errors: string[] = []
    let created = 0

    const COMPETITIONS = [
      // Football
      { sport_slug: 'football', slug: 'premier-league', name_key: 'competitions.premier_league', external_id: 'pl' },
      { sport_slug: 'football', slug: 'la-liga', name_key: 'competitions.la_liga', external_id: 'es1' },
      { sport_slug: 'football', slug: 'serie-a', name_key: 'competitions.serie_a', external_id: 'it1' },
      { sport_slug: 'football', slug: 'bundesliga', name_key: 'competitions.bundesliga', external_id: 'de1' },
      { sport_slug: 'football', slug: 'ligue-1', name_key: 'competitions.ligue_1', external_id: 'fr1' },
      { sport_slug: 'football', slug: 'super-lig', name_key: 'competitions.super_lig', external_id: 'tr1' },
      // Basketball
      { sport_slug: 'basketball', slug: 'nba', name_key: 'competitions.nba', external_id: 'nba' },
      // American Football
      { sport_slug: 'american-football', slug: 'nfl', name_key: 'competitions.nfl', external_id: 'nfl' },
      // Ice Hockey
      { sport_slug: 'ice-hockey', slug: 'nhl', name_key: 'competitions.nhl', external_id: 'nhl' },
      // Formula 1
      { sport_slug: 'formula-1', slug: 'formula-1', name_key: 'competitions.formula_1', external_id: 'f1' },
    ]

    try {
      for (const comp of COMPETITIONS) {
        const sport = db.prepare('SELECT id FROM sports WHERE slug = ?').get(comp.sport_slug)
        if (!sport) continue

        const existing = db.prepare('SELECT id FROM competitions WHERE slug = ?').get(comp.slug)
        if (!existing) {
          db.prepare(
            `INSERT INTO competitions (sport_id, slug, name_key, external_provider, external_id, active)
             VALUES (?, ?, ?, ?, ?, 1)`
          ).run(sport.id, comp.slug, comp.name_key, 'sportscore', comp.external_id)
          created++
          console.log(`  ✅ ${comp.slug}`)
        }
      }
    } catch (error) {
      errors.push(`Competitions sync: ${error instanceof Error ? error.message : 'Unknown'}`)
    }

    return {
      success: errors.length === 0,
      created,
      updated: 0,
      errors,
      duration: Date.now() - start,
    }
  }

  async syncLiveMatches(): Promise<SyncResult> {
    console.log('🔄 Syncing live matches from SportScore...')
    const start = Date.now()
    const errors: string[] = []
    let created = 0
    let updated = 0

    try {
      // Get live matches from SportScore
      const response = await this.sportscore.get('/matches', {
        params: {
          sport: 'football',
          status: 'live',
        },
      })

      const matches = response.data?.data || []
      console.log(`  📊 Found ${matches.length} live matches`)

      for (const match of matches) {
        try {
          const existing = db
            .prepare('SELECT id FROM events WHERE external_id = ?')
            .get(match.id)

          if (!existing) {
            // Get competition
            const comp = db
              .prepare('SELECT id FROM competitions WHERE external_id = ?')
              .get(match.competition_id)

            if (!comp) continue

            // Insert event
            const eventId = db
              .prepare(
                `INSERT INTO events (sport_id, competition_id, external_id, event_type, start_time, status)
                 VALUES (1, ?, ?, 'match', ?, 'live')`
              )
              .run(comp.id, match.id, match.startTime).lastID

            // Add participants (teams)
            if (match.home_team_id && match.away_team_id) {
              db.prepare(
                'INSERT INTO event_participants (event_id, participant_type, participant_id, role) VALUES (?, ?, ?, ?)'
              ).run(eventId, 'team', match.home_team_id, 'HOME')

              db.prepare(
                'INSERT INTO event_participants (event_id, participant_type, participant_id, role) VALUES (?, ?, ?, ?)'
              ).run(eventId, 'team', match.away_team_id, 'AWAY')

              // Add scores
              db.prepare(
                'INSERT INTO event_scores (event_id, participant_id, score, period) VALUES (?, ?, ?, 0)'
              ).run(eventId, match.home_team_id, match.home_score || 0)

              db.prepare(
                'INSERT INTO event_scores (event_id, participant_id, score, period) VALUES (?, ?, ?, 0)'
              ).run(eventId, match.away_team_id, match.away_score || 0)
            }

            created++
          } else {
            // Update existing
            db.prepare('UPDATE events SET status = ? WHERE id = ?').run('live', existing.id)
            updated++
          }
        } catch (error) {
          errors.push(`Match ${match.id}: ${error instanceof Error ? error.message : 'Unknown'}`)
        }
      }

      console.log(`  ✅ Created: ${created}, Updated: ${updated}`)
    } catch (error) {
      errors.push(`Live matches sync: ${error instanceof Error ? error.message : 'Unknown'}`)
    }

    return {
      success: errors.length === 0,
      created,
      updated,
      errors,
      duration: Date.now() - start,
    }
  }

  async syncTeams(competitionId?: number): Promise<SyncResult> {
    console.log('🔄 Syncing teams from SportDB...')
    const start = Date.now()
    const errors: string[] = []
    let created = 0

    try {
      // Get competitions to sync
      const competitions = competitionId
        ? [db.prepare('SELECT * FROM competitions WHERE id = ?').get(competitionId)]
        : db.prepare('SELECT * FROM competitions WHERE active = 1 LIMIT 5').all()

      for (const comp of competitions || []) {
        try {
          // Try SportDB Transfermarkt first
          const response = await this.sportdb.get('/transfermarkt/teams', {
            params: { competition_id: comp.external_id },
          })

          const teams = response.data?.data || []

          for (const team of teams) {
            const existing = db
              .prepare('SELECT id FROM teams WHERE external_id = ? AND sport_id = ?')
              .get(team.id, comp.sport_id)

            if (!existing) {
              const teamId = db
                .prepare(
                  `INSERT INTO teams (sport_id, external_id, slug, logo_url, active)
                   VALUES (?, ?, ?, ?, 1)`
                )
                .run(comp.sport_id, team.id, team.slug || team.name.toLowerCase(), team.logo).lastID

              // Add translations
              db.prepare(
                'INSERT INTO team_translations (team_id, language, name) VALUES (?, ?, ?)'
              ).run(teamId, 'en', team.name)

              created++
            }
          }

          console.log(`  ✅ ${comp.slug}: ${teams.length} teams`)
        } catch (error) {
          errors.push(`Competition ${comp.slug}: ${error instanceof Error ? error.message : 'Unknown'}`)
        }
      }
    } catch (error) {
      errors.push(`Teams sync: ${error instanceof Error ? error.message : 'Unknown'}`)
    }

    return {
      success: errors.length === 0,
      created,
      updated: 0,
      errors,
      duration: Date.now() - start,
    }
  }

  async syncUpcomingMatches(): Promise<SyncResult> {
    console.log('🔄 Syncing upcoming matches...')
    const start = Date.now()
    const errors: string[] = []
    let created = 0

    try {
      // Get upcoming matches from SportScore
      const response = await this.sportscore.get('/matches', {
        params: {
          sport: 'football',
          status: 'upcoming',
          limit: 50,
        },
      })

      const matches = response.data?.data || []

      for (const match of matches) {
        try {
          const existing = db
            .prepare('SELECT id FROM events WHERE external_id = ?')
            .get(match.id)

          if (!existing) {
            const comp = db
              .prepare('SELECT id FROM competitions WHERE external_id = ?')
              .get(match.competition_id)

            if (comp) {
              db.prepare(
                `INSERT INTO events (sport_id, competition_id, external_id, event_type, start_time, status)
                 VALUES (1, ?, ?, 'match', ?, 'scheduled')`
              ).run(comp.id, match.id, match.startTime)
              created++
            }
          }
        } catch (error) {
          errors.push(`Upcoming match: ${error instanceof Error ? error.message : 'Unknown'}`)
        }
      }

      console.log(`  ✅ Created ${created} upcoming matches`)
    } catch (error) {
      errors.push(`Upcoming matches sync: ${error instanceof Error ? error.message : 'Unknown'}`)
    }

    return {
      success: errors.length === 0,
      created,
      updated: 0,
      errors,
      duration: Date.now() - start,
    }
  }

  async syncAll(): Promise<void> {
    console.log('\n📦 ====== STARTING FULL DATA SYNC ======\n')

    const results = []

    // 1. Sports (temel)
    results.push(await this.syncSports())

    // 2. Competitions
    results.push(await this.syncCompetitions())

    // 3. Teams
    results.push(await this.syncTeams())

    // 4. Live matches
    results.push(await this.syncLiveMatches())

    // 5. Upcoming matches
    results.push(await this.syncUpcomingMatches())

    console.log('\n📊 ====== SYNC SUMMARY ======\n')
    for (const result of results) {
      console.log(
        `✅ Created: ${result.created} | Updated: ${result.updated} | Errors: ${result.errors.length} | ${result.duration}ms`
      )
    }

    const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0)
    if (totalErrors === 0) {
      console.log('\n✨ All syncs completed successfully!')
    } else {
      console.log(`\n⚠️  ${totalErrors} errors occurred. Check logs above.`)
    }
  }
}

export const dataSyncService = new DataSyncService()
