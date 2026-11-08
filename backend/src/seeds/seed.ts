import { db, initDatabase, closeDatabase } from '../database/init'
import { sports, competitions, teams, seasons, levels } from './data'

export const seedDatabase = async () => {
  console.log('🌱 Seeding database...')

  // Insert sports
  for (const sport of sports) {
    ; (await db.prepare(`
      INSERT OR IGNORE INTO sports (slug, name_key, icon, status)
      VALUES (?, ?, ?, 'active')
    `).run(sport.slug, sport.name_key, sport.icon))
  }
  console.log(`✅ Added ${sports.length} sports`)

  // Insert competitions
  for (const comp of competitions) {
    const sportId = (await db.prepare('SELECT id FROM sports WHERE slug = ?').get(comp.sport_slug))?.id

    if (sportId) {
      ; (await db.prepare(`
        INSERT OR IGNORE INTO competitions
        (sport_id, slug, name_key, external_provider, external_id, active)
        VALUES (?, ?, ?, ?, ?, 1)
      `).run(sportId, comp.slug, comp.name_key, comp.external_provider, comp.external_id))
    }
  }
  console.log(`✅ Added ${competitions.length} competitions`)

  // Insert teams
  for (const team of teams) {
    const sportId = (await db.prepare('SELECT id FROM sports WHERE slug = ?').get(team.sport_slug))?.id

    if (sportId) {
      await db.prepare(`
        INSERT OR IGNORE INTO teams (sport_id, slug, logo_url, active)
        VALUES (?, ?, ?, 1)
      `).run(sportId, team.slug, team.logo_url)
      const teamId = (await db.prepare('SELECT id FROM teams WHERE slug = ? AND sport_id = ?').get(team.slug, sportId))?.id

      if (teamId) {
        // Insert translations
        ; (await db.prepare(`
          INSERT OR IGNORE INTO team_translations (team_id, language, name)
          VALUES (?, 'en', ?)
        `).run(teamId, team.en))

        ; (await db.prepare(`
          INSERT OR IGNORE INTO team_translations (team_id, language, name)
          VALUES (?, 'es', ?)
        `).run(teamId, team.es))

        ; (await db.prepare(`
          INSERT OR IGNORE INTO team_translations (team_id, language, name)
          VALUES (?, 'ar', ?)
        `).run(teamId, team.ar))
      }
    }
  }
  console.log(`✅ Added ${teams.length} teams with translations`)

  // Insert seasons
  for (const season of seasons) {
    const compId = (await db.prepare('SELECT id FROM competitions WHERE slug = ?').get(season.competition_slug))?.id

    if (compId) {
      ; (await db.prepare(`
        INSERT OR IGNORE INTO seasons (competition_id, name, start_date, end_date, is_current)
        VALUES (?, ?, ?, ?, ?)
      `).run(compId, season.name, season.start_date, season.end_date, season.is_current ? 1 : 0))
    }
  }
  console.log(`✅ Added ${seasons.length} seasons`)

  // Insert levels
  for (const level of levels) {
    ; (await db.prepare(`
      INSERT OR IGNORE INTO levels (level_number, name, min_xp, max_xp)
      VALUES (?, ?, ?, ?)
    `).run(level.level_number, level.name, level.min_xp, level.max_xp))
  }
  console.log(`✅ Added ${levels.length} levels`)

  console.log('✨ Database seeded successfully!')
}

// Run if called directly
if (require.main === module) {
  initDatabase().then(seedDatabase).catch(error => {
    console.error('Seed error:', error)
    process.exitCode = 1
  }).finally(closeDatabase)
}
