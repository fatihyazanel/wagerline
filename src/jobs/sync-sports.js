const db = require('../database/db');
const ProviderManager = require('../providers/provider-manager');

const SPORTS_DATA = [
  { slug: 'football', nameKey: 'sports.football', icon: '⚽' },
  { slug: 'basketball', nameKey: 'sports.basketball', icon: '🏀' },
  { slug: 'american-football', nameKey: 'sports.american_football', icon: '🏈' },
  { slug: 'ice-hockey', nameKey: 'sports.ice_hockey', icon: '🏒' },
  { slug: 'formula-1', nameKey: 'sports.formula_1', icon: '🏎️' }
];

const COMPETITIONS_DATA = [
  // Football
  { sportSlug: 'football', slug: 'premier-league', nameKey: 'competitions.premier_league', external: 'pl' },
  { sportSlug: 'football', slug: 'la-liga', nameKey: 'competitions.la_liga', external: 'la' },
  { sportSlug: 'football', slug: 'serie-a', nameKey: 'competitions.serie_a', external: 'sa' },
  { sportSlug: 'football', slug: 'bundesliga', nameKey: 'competitions.bundesliga', external: 'bl1' },
  { sportSlug: 'football', slug: 'ligue-1', nameKey: 'competitions.ligue_1', external: 'fl1' },
  { sportSlug: 'football', slug: 'super-lig', nameKey: 'competitions.super_lig', external: 'tr1' },
  // Basketball
  { sportSlug: 'basketball', slug: 'nba', nameKey: 'competitions.nba', external: 'nba' },
  // American Football
  { sportSlug: 'american-football', slug: 'nfl', nameKey: 'competitions.nfl', external: 'nfl' },
  // Ice Hockey
  { sportSlug: 'ice-hockey', slug: 'nhl', nameKey: 'competitions.nhl', external: 'nhl' },
  // Formula 1
  { sportSlug: 'formula-1', slug: 'formula-1', nameKey: 'competitions.formula_1', external: 'f1' }
];

async function createSyncJob(jobType) {
  const result = await db.run(
    `INSERT INTO sync_jobs (job_type, status) VALUES (?, ?)`,
    [jobType, 'running']
  );
  return result.id;
}

async function updateSyncJob(jobId, status, meta = {}) {
  await db.run(
    `UPDATE sync_jobs SET status = ?, finished_at = CURRENT_TIMESTAMP,
     records_processed = ?, records_created = ?, records_updated = ?, errors = ?
     WHERE id = ?`,
    [
      status,
      meta.processed || 0,
      meta.created || 0,
      meta.updated || 0,
      meta.errors || null,
      jobId
    ]
  );
}

async function syncSports() {
  console.log('Starting sports sync...');
  const jobId = await createSyncJob('sync_sports');

  try {
    let created = 0;
    for (const sport of SPORTS_DATA) {
      const existing = await db.get('SELECT id FROM sports WHERE slug = ?', [sport.slug]);

      if (!existing) {
        await db.run(
          'INSERT INTO sports (slug, name_key, icon, status) VALUES (?, ?, ?, ?)',
          [sport.slug, sport.nameKey, sport.icon, 'active']
        );
        created++;
        console.log(`✓ Created sport: ${sport.slug}`);
      }
    }

    await updateSyncJob(jobId, 'completed', {
      processed: SPORTS_DATA.length,
      created
    });
    console.log(`Sports sync completed: ${created} new records`);
  } catch (error) {
    await updateSyncJob(jobId, 'failed', { errors: error.message });
    console.error('Sports sync failed:', error);
  }
}

async function syncCompetitions() {
  console.log('Starting competitions sync...');
  const jobId = await createSyncJob('sync_competitions');

  try {
    let created = 0;
    for (const comp of COMPETITIONS_DATA) {
      const sport = await db.get('SELECT id FROM sports WHERE slug = ?', [comp.sportSlug]);
      if (!sport) continue;

      const existing = await db.get('SELECT id FROM competitions WHERE slug = ?', [comp.slug]);
      if (!existing) {
        await db.run(
          `INSERT INTO competitions (sport_id, slug, name_key, external_provider, external_id, active)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [sport.id, comp.slug, comp.nameKey, 'api-sports', comp.external, 1]
        );
        created++;
        console.log(`✓ Created competition: ${comp.slug}`);
      }
    }

    await updateSyncJob(jobId, 'completed', {
      processed: COMPETITIONS_DATA.length,
      created
    });
    console.log(`Competitions sync completed: ${created} new records`);
  } catch (error) {
    await updateSyncJob(jobId, 'failed', { errors: error.message });
    console.error('Competitions sync failed:', error);
  }
}

async function syncSeasons() {
  console.log('Starting seasons sync...');
  const jobId = await createSyncJob('sync_seasons');

  try {
    const competitions = await db.all(
      'SELECT id, external_id, external_provider FROM competitions WHERE active = 1'
    );

    let created = 0;
    const providerManager = new ProviderManager({
      apisportsKey: process.env.API_SPORTS_KEY || 'demo'
    });

    for (const comp of competitions) {
      try {
        const result = await providerManager.executeWithFallback(
          'getSeasons',
          [comp.external_id]
        );

        if (result.data) {
          for (const season of result.data) {
            const existing = await db.get(
              'SELECT id FROM seasons WHERE competition_id = ? AND external_id = ?',
              [comp.id, season.externalId]
            );

            if (!existing) {
              await db.run(
                `INSERT INTO seasons (competition_id, external_id, name, is_current)
                 VALUES (?, ?, ?, ?)`,
                [comp.id, season.externalId, season.name, season.isCurrent ? 1 : 0]
              );
              created++;
            }
          }
        }
      } catch (error) {
        console.error(`Failed to sync seasons for competition ${comp.id}:`, error.message);
      }
    }

    await updateSyncJob(jobId, 'completed', {
      processed: competitions.length,
      created
    });
    console.log(`Seasons sync completed: ${created} new records`);
  } catch (error) {
    await updateSyncJob(jobId, 'failed', { errors: error.message });
    console.error('Seasons sync failed:', error);
  }
}

async function main() {
  try {
    await db.init();
    await db.runSchema();

    await syncSports();
    await syncCompetitions();
    await syncSeasons();

    console.log('\n✓ All sync jobs completed');
    await db.close();
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { syncSports, syncCompetitions, syncSeasons };
