import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { db } from '../database/init'



/**
 * Head-to-Head Routes
 * GET /api/v1/head-to-head?team_1=id&team_2=id
 */

export async function headToHeadRoutes(fastify: FastifyInstance) {
  // GET /api/v1/head-to-head - Get head-to-head between two teams
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const { team_1, team_2, limit = '10' } = request.query as any

    if (!team_1 || !team_2) {
      return reply.status(400).send({ error: 'team_1 and team_2 parameters required' })
    }

    if (team_1 === team_2) {
      return reply.status(400).send({ error: 'team_1 and team_2 must be different' })
    }

    try {
      const limitNum = Math.min(100, Math.max(1, parseInt(limit)))

      // Get all matches between the two teams
      const matches = (await db.prepare(`
        SELECT
          e.id as event_id,
          e.start_time,
          ht.id as home_team_id,
          ht_t.name as home_team,
          at.id as away_team_id,
          at_t.name as away_team,
          (SELECT score FROM event_scores WHERE event_id = e.id AND participant_id = ht.id) as home_score,
          (SELECT score FROM event_scores WHERE event_id = e.id AND participant_id = at.id) as away_score,
          e.status,
          c.slug as competition
        FROM events e
        JOIN teams ht ON e.home_team_id = ht.id
        JOIN teams at ON e.away_team_id = at.id
        LEFT JOIN team_translations ht_t ON ht.id = ht_t.team_id AND ht_t.language = 'en'
        LEFT JOIN team_translations at_t ON at.id = at_t.team_id AND at_t.language = 'en'
        JOIN competitions c ON e.competition_id = c.id
        WHERE (
          (ht.id = ? AND at.id = ?) OR
          (ht.id = ? AND at.id = ?)
        )
        AND e.status='finished' AND datetime(e.start_time)<datetime('now') AND NOT EXISTS(SELECT 1 FROM event_aliases WHERE alias_event_id=e.id) AND EXISTS(SELECT 1 FROM event_scores WHERE event_id=e.id AND participant_id=e.home_team_id) AND EXISTS(SELECT 1 FROM event_scores WHERE event_id=e.id AND participant_id=e.away_team_id)
        ORDER BY e.start_time DESC
        LIMIT ?
      `).all(team_1, team_2, team_2, team_1, limitNum))

      // Calculate statistics
      let team1Wins = 0
      let team2Wins = 0
      let draws = 0
      let team1Goals = 0
      let team2Goals = 0

      matches.forEach((match: any) => {
        if (match.status === 'finished' && match.home_score !== null) {
          const isTeam1Home = match.home_team_id === parseInt(team_1)

          if (isTeam1Home) {
            team1Goals += match.home_score
            team2Goals += match.away_score

            if (match.home_score > match.away_score) {
              team1Wins++
            } else if (match.home_score < match.away_score) {
              team2Wins++
            } else {
              draws++
            }
          } else {
            team2Goals += match.home_score
            team1Goals += match.away_score

            if (match.away_score > match.home_score) {
              team1Wins++
            } else if (match.away_score < match.home_score) {
              team2Wins++
            } else {
              draws++
            }
          }
        }
      })

      // Get team info
      const team1Info = (await db.prepare(
        'SELECT id, slug, logo_url FROM teams WHERE id = ?'
      ).get(team_1))

      const team2Info = (await db.prepare(
        'SELECT id, slug, logo_url FROM teams WHERE id = ?'
      ).get(team_2))

      const team1Name = (await db.prepare(
        'SELECT name FROM team_translations WHERE team_id = ? AND language = "en" LIMIT 1'
      ).get(team_1))

      const team2Name = (await db.prepare(
        'SELECT name FROM team_translations WHERE team_id = ? AND language = "en" LIMIT 1'
      ).get(team_2))

      reply.send({
        teams: {
          team_1: {
            id: team1Info?.id,
            name: team1Name?.name || 'Team 1',
            logo: team1Info?.logo_url,
            slug: team1Info?.slug
          },
          team_2: {
            id: team2Info?.id,
            name: team2Name?.name || 'Team 2',
            logo: team2Info?.logo_url,
            slug: team2Info?.slug
          }
        },
        statistics: {
          team_1_wins: team1Wins,
          team_2_wins: team2Wins,
          draws,
          team_1_goals: team1Goals,
          team_2_goals: team2Goals,
          total_matches: matches.length,
          team_1_win_percentage: matches.length > 0 ? Math.round((team1Wins / matches.length) * 100) : 0,
          team_2_win_percentage: matches.length > 0 ? Math.round((team2Wins / matches.length) * 100) : 0
        },
        recent_matches: matches.slice(0, 10)
      })
    } catch (error) {
      reply.status(500).send({ error: 'Failed to fetch head-to-head' })
    }
  })
}
