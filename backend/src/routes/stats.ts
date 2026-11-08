import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { db } from '../database/init'



/**
 * Statistics Routes
 * GET /api/v1/stats/team/:team_id
 * GET /api/v1/stats/player/:player_id
 * GET /api/v1/stats/competition/:competition_id
 */

export async function statsRoutes(fastify: FastifyInstance) {
  // GET /api/v1/stats/team/:team_id - Team statistics
  fastify.get('/team/:team_id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { team_id } = request.params as any
    let { season_id } = request.query as any
    if(!season_id){const current=await db.prepare('SELECT s.id FROM seasons s JOIN events e ON e.season_id=s.id WHERE (e.home_team_id=? OR e.away_team_id=?) ORDER BY s.is_current DESC,s.id DESC LIMIT 1').get((request.params as any).team_id,(request.params as any).team_id);season_id=current?.id||null}

    try {
      const team = (await db.prepare(
        'SELECT id, slug FROM teams WHERE id = ?'
      ).get(team_id))

      if (!team) {
        return reply.status(404).send({ error: 'Team not found' })
      }

      const teamName = (await db.prepare(
        'SELECT name FROM team_translations WHERE team_id = ? AND language = "en" LIMIT 1'
      ).get(team_id))

      // Get standing
      const standing = (await db.prepare(`
        SELECT
          s.position, s.played, s.wins, s.draws, s.losses,
          s.goals_for, s.goals_against, (COALESCE(s.wins,0) * 3 + COALESCE(s.draws,0)) AS points
        FROM standings s
        WHERE s.team_id = ? AND s.season_id = ?
      `).get(team_id, season_id))

      // Calculate statistics
      const stats = (await db.prepare(`
        SELECT
          COUNT(CASE WHEN (e.home_team_id = ? OR e.away_team_id = ?) AND e.status = 'finished' THEN 1 END) as matches_played,
          ROUND(AVG(
            CASE
              WHEN e.home_team_id = ? THEN (SELECT score FROM event_scores WHERE event_id = e.id AND participant_id = ?)
              WHEN e.away_team_id = ? THEN (SELECT score FROM event_scores WHERE event_id = e.id AND participant_id = ?)
            END
          ), 2) as avg_goals_for,
          ROUND(AVG(
            CASE
              WHEN e.home_team_id = ? THEN (SELECT score FROM event_scores WHERE event_id = e.id AND participant_id = (SELECT away_team_id FROM events WHERE id = e.id))
              WHEN e.away_team_id = ? THEN (SELECT score FROM event_scores WHERE event_id = e.id AND participant_id = (SELECT home_team_id FROM events WHERE id = e.id))
            END
          ), 2) as avg_goals_against,
          ROUND(100.0 * SUM(CASE WHEN (e.home_team_id = ? AND (SELECT score FROM event_scores WHERE event_id = e.id AND participant_id = ?) > (SELECT score FROM event_scores WHERE event_id = e.id AND participant_id = (SELECT away_team_id FROM events WHERE id = e.id)))
                           OR (e.away_team_id = ? AND (SELECT score FROM event_scores WHERE event_id = e.id AND participant_id = ?) > (SELECT score FROM event_scores WHERE event_id = e.id AND participant_id = (SELECT home_team_id FROM events WHERE id = e.id))) THEN 1 ELSE 0 END)
            / NULLIF(COUNT(CASE WHEN (e.home_team_id = ? OR e.away_team_id = ?) AND e.status = 'finished' THEN 1 END), 0), 2) as win_percentage
        FROM events e
        WHERE (e.home_team_id = ? OR e.away_team_id = ?) AND e.season_id = ?
      `).get(team_id, team_id, team_id, team_id, team_id, team_id, team_id, team_id, team_id, team_id, team_id, team_id, team_id, team_id, team_id, team_id, season_id))

      // Top scorers
      const topScorers = (await db.prepare(`
        SELECT
          p.id,
          pt.name,
          COALESCE(SUM(es.goals), 0) as goals,
          COALESCE(SUM(es.assists), 0) as assists
        FROM players p
        LEFT JOIN player_translations pt ON p.id = pt.player_id AND pt.language = 'en'
        LEFT JOIN player_team_assignments pta ON p.id = pta.player_id AND pta.season_id = ?
        JOIN player_season_stats es ON p.id = es.player_id AND es.season_id = pta.season_id AND es.team_id = pta.team_id
        WHERE pta.team_id = ?
        GROUP BY p.id
        ORDER BY goals DESC
        LIMIT 5
      `).all(season_id, team_id))

      reply.send({
        team: {
          id: team.id,
          slug: team.slug,
          name: teamName?.name || 'Team'
        },
        season: season_id,
        standing: standing || { position: null, played: 0, points: 0 },
        statistics: {
          matches_played: stats?.matches_played || 0,
          avg_goals_for: stats?.avg_goals_for || 0,
          avg_goals_against: stats?.avg_goals_against || 0,
          win_percentage: stats?.win_percentage || 0
        },
        top_scorers: topScorers
      })
    } catch (error) {
      reply.status(500).send({ error: 'Failed to fetch team statistics' })
    }
  })

  // GET /api/v1/stats/competition/:competition_id - Competition statistics
  fastify.get('/competition/:competition_id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { competition_id } = request.params as any
    let { season_id } = request.query as any
    if(!season_id){const season=await db.prepare('SELECT s.id FROM seasons s JOIN competitions c ON c.id=s.competition_id WHERE c.id=? OR c.slug=? ORDER BY s.is_current DESC,s.id DESC LIMIT 1').get(competition_id,competition_id);season_id=season?.id||null}

    try {
      const competition = (await db.prepare(
        'SELECT id, slug, name_key FROM competitions WHERE id = ? OR slug = ?'
      ).get(competition_id, competition_id))

      if (!competition) {
        return reply.status(404).send({ error: 'Competition not found' })
      }

      // Total stats
      const totalStats = (await db.prepare(`
        SELECT
          COUNT(*) as total_matches,
          SUM(
            (SELECT score FROM event_scores WHERE event_id = e.id AND participant_id = e.home_team_id) +
            (SELECT score FROM event_scores WHERE event_id = e.id AND participant_id = e.away_team_id)
          ) * 1.0 / NULLIF(COUNT(*), 0) as avg_goals_per_match,
          MAX(
            (SELECT score FROM event_scores WHERE event_id = e.id AND participant_id = e.home_team_id) +
            (SELECT score FROM event_scores WHERE event_id = e.id AND participant_id = e.away_team_id)
          ) as max_goals_in_match
        FROM events e
        WHERE e.competition_id = ? AND e.season_id = ? AND e.status = 'finished'
      `).get(competition.id, season_id))

      // Top scorers in competition
      const topScorers = (await db.prepare(`
        SELECT
          p.id,
          pt.name,
          t.id as team_id,
          tt.name as team_name,
          COALESCE(SUM(es.goals), 0) as goals,
          SUM(es.appearances) as appearances
        FROM players p
        LEFT JOIN player_translations pt ON p.id = pt.player_id AND pt.language = 'en'
        LEFT JOIN player_team_assignments pta ON p.id = pta.player_id
        LEFT JOIN teams t ON pta.team_id = t.id
        LEFT JOIN team_translations tt ON t.id = tt.team_id AND tt.language = 'en'
        JOIN player_season_stats es ON p.id = es.player_id AND es.season_id = pta.season_id AND es.team_id = pta.team_id
        WHERE EXISTS (
          SELECT 1 FROM events e
          WHERE e.competition_id = ? AND (e.home_team_id = pta.team_id OR e.away_team_id = pta.team_id)
          AND es.season_id = e.season_id
        )
        GROUP BY p.id
        ORDER BY goals DESC
        LIMIT 10
      `).all(competition.id))

      reply.send({
        competition: {
          id: competition.id,
          slug: competition.slug,
          name: competition.name_key
        },
        season: season_id,
        statistics: {
          total_matches: totalStats?.total_matches || 0,
          avg_goals_per_match: totalStats?.avg_goals_per_match || 0,
          max_goals_in_match: totalStats?.max_goals_in_match || 0
        },
        top_scorers: topScorers
      })
    } catch (error) {
      reply.status(500).send({ error: 'Failed to fetch competition statistics' })
    }
  })
}
