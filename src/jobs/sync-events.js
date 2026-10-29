const db = require('../database/db');
const ProviderManager = require('../providers/provider-manager');

async function createSyncJob(jobType, provider, sport) {
  const result = await db.run(
    `INSERT INTO sync_jobs (job_type, provider, sport, status) VALUES (?, ?, ?, ?)`,
    [jobType, provider, sport, 'running']
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

async function syncEventParticipants(eventId, homeTeamId, awayTeamId) {
  // Home participant
  await db.run(
    `INSERT INTO event_participants (event_id, participant_type, participant_id, role)
     VALUES (?, ?, ?, ?)`,
    [eventId, 'team', homeTeamId, 'HOME']
  );

  // Away participant
  await db.run(
    `INSERT INTO event_participants (event_id, participant_type, participant_id, role)
     VALUES (?, ?, ?, ?)`,
    [eventId, 'team', awayTeamId, 'AWAY']
  );
}

async function syncEventScores(eventId, homeScore, awayScore, participantIds) {
  if (participantIds.home && homeScore !== null) {
    await db.run(
      `INSERT OR REPLACE INTO event_scores (event_id, participant_id, score, period)
       VALUES (?, ?, ?, ?)`,
      [eventId, participantIds.home, homeScore, 0]
    );
  }

  if (participantIds.away && awayScore !== null) {
    await db.run(
      `INSERT OR REPLACE INTO event_scores (event_id, participant_id, score, period)
       VALUES (?, ?, ?, ?)`,
      [eventId, participantIds.away, awayScore, 0]
    );
  }
}

async function syncEventsForCompetition(competitionId, season) {
  console.log(`Syncing events for competition ${competitionId}, season ${season}...`);
  const jobId = await createSyncJob('sync_events', 'api-sports', 'football');

  try {
    const providerManager = new ProviderManager({
      apisportsKey: process.env.API_SPORTS_KEY || 'demo'
    });

    const competition = await db.get(
      'SELECT id, external_id, external_provider FROM competitions WHERE id = ?',
      [competitionId]
    );

    if (!competition) {
      throw new Error(`Competition ${competitionId} not found`);
    }

    const result = await providerManager.executeWithFallback(
      'getEvents',
      [competition.external_id, season]
    );

    if (!result.data) {
      throw new Error('No data returned from provider');
    }

    let created = 0, updated = 0;

    for (const eventData of result.data) {
      // Get or create teams
      let homeTeam = await db.get(
        'SELECT id FROM teams WHERE external_id = ?',
        [eventData.homeTeamId]
      );

      if (!homeTeam) {
        const teamResult = await db.run(
          `INSERT INTO teams (sport_id, external_id, slug, active)
           VALUES (1, ?, ?, 1)`,
          [eventData.homeTeamId, `team-${eventData.homeTeamId}`]
        );
        homeTeam = { id: teamResult.id };
      }

      let awayTeam = await db.get(
        'SELECT id FROM teams WHERE external_id = ?',
        [eventData.awayTeamId]
      );

      if (!awayTeam) {
        const teamResult = await db.run(
          `INSERT INTO teams (sport_id, external_id, slug, active)
           VALUES (1, ?, ?, 1)`,
          [eventData.awayTeamId, `team-${eventData.awayTeamId}`]
        );
        awayTeam = { id: teamResult.id };
      }

      // Get or create event
      let event = await db.get(
        'SELECT id FROM events WHERE external_id = ? AND competition_id = ?',
        [eventData.externalId, competitionId]
      );

      if (!event) {
        const eventResult = await db.run(
          `INSERT INTO events (sport_id, competition_id, external_id, event_type, start_time, status)
           VALUES (1, ?, ?, ?, ?, ?)`,
          [competitionId, eventData.externalId, 'match', eventData.startTime, eventData.status]
        );
        event = { id: eventResult.id };
        created++;

        // Add participants and scores
        await syncEventParticipants(event.id, homeTeam.id, awayTeam.id);

        if (eventData.homeScore !== null && eventData.awayScore !== null) {
          await syncEventScores(event.id, eventData.homeScore, eventData.awayScore, {
            home: homeTeam.id,
            away: awayTeam.id
          });
        }
      } else {
        // Update existing event
        await db.run(
          'UPDATE events SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [eventData.status, event.id]
        );
        updated++;

        // Update scores if available
        if (eventData.homeScore !== null && eventData.awayScore !== null) {
          await syncEventScores(event.id, eventData.homeScore, eventData.awayScore, {
            home: homeTeam.id,
            away: awayTeam.id
          });
        }
      }
    }

    await updateSyncJob(jobId, 'completed', {
      processed: result.data.length,
      created,
      updated
    });

    console.log(`Events sync completed: ${created} created, ${updated} updated`);
  } catch (error) {
    await updateSyncJob(jobId, 'failed', { errors: error.message });
    console.error('Events sync failed:', error);
  }
}

async function syncAllEvents() {
  try {
    await db.init();
    await db.runSchema();

    const competitions = await db.all(
      'SELECT id FROM competitions WHERE active = 1 LIMIT 3'
    );

    const season = new Date().getFullYear();

    for (const comp of competitions) {
      await syncEventsForCompetition(comp.id, season);
    }

    await db.close();
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  syncAllEvents();
}

module.exports = { syncEventsForCompetition, syncAllEvents };
