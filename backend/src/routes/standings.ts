import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { getDb } from '../database/init'

const db = getDb()

/**
 * Standings Routes
 * GET /api/v1/standings - Get standings by competition
 * GET /api/v1/standings/:competition_id - Get standings for specific competition
 */

export async function standingsRoutes(fastify: FastifyInstance) {
  // GET /api/v1/standings - Get all standings
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const { competition_id, season_id = '1' } = request.query as any

    try {
      let query = `
        SELECT
          s.id,
          s.position,
          c.id as competition_id,
          c.slug as competition_slug,
          c.name_key as competition_name,
          t.id as team_id,
          t.slug as team_slug,
          tt.name as team_name,
          t.logo_url as team_logo,
          s.played,
          s.wins,
          s.draws,
          s.losses,
          s.goals_for,
          s.goals_against,
          (s.goals_for - s.goals_against) as goal_difference,
          s.points,
          -- Form: last 5 matches
          (
            SELECT GROUP_CONCAT(
              CASE
                WHEN home_score > away_score THEN 'W'
                WHEN home_score < away_score THEN 'L'
                ELSE 'D'
              END, ''
            )
            FROM (
              SELECT
                e.home_team_id,
                e.away_team_id,
                (SELECT score FROM event_scores WHERE event_id = e.id AND participant_id = e.home_team_id) as home_score,
                (SELECT score FROM event_scores WHERE event_id = e.id AND participant_id = e.away_team_id) as away_score
              FROM events e
              WHERE (e.home_team_id = t.id OR e.away_team_id = t.id)
              AND e.competition_id = c.id
              AND e.status = 'finished'
              ORDER BY e.start_time DESC
              LIMIT 5
            )
          ) as form
        FROM standings s
        JOIN competitions c ON s.competition_id = c.id
        JOIN teams t ON s.team_id = t.id
        LEFT JOIN team_translations tt ON t.id = tt.team_id AND tt.language = 'en'
        WHERE s.season_id = ?
      `

      const params: any[] = [season_id]

      if (competition_id) {
        query += ` AND c.id = ?`
        params.push(competition_id)
      }

      query += ` ORDER BY c.id, s.position ASC`

      const standings = db.prepare(query).all(...params)

      // Group by competition if not filtered
      const grouped = standings.reduce((acc: any, row: any) => {
        const comp = row.competition_slug
        if (!acc[comp]) {
          acc[comp] = {
            competition_id: row.competition_id,
            competition_name: row.competition_name,
            standings: []
          }
        }
        acc[comp].standings.push(row)
        return acc
      }, {})

      reply.send(
        competition_id
          ? { standings: standings, count: standings.length }
          : Object.values(grouped)
      )
    } catch (error) {
      reply.status(500).send({ error: 'Failed to fetch standings' })
    }
  })

  // GET /api/v1/standings/:competition_id - Get standings for specific competition
  fastify.get('/:competition_id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { competition_id } = request.params as any
    const { season_id = '1' } = request.query as any

    try {
      const competition = db.prepare(
        'SELECT id, slug, name_key FROM competitions WHERE id = ? OR slug = ?'
      ).get(competition_id, competition_id)

      if (!competition) {
        return reply.status(404).send({ error: 'Competition not found' })
      }

      const standings = db.prepare(`
        SELECT
          s.id,
          s.position,
          s.played,
          s.wins,
          s.draws,
          s.losses,
          s.goals_for,
          s.goals_against,
          (s.goals_for - s.goals_against) as goal_difference,
          s.points,
          t.id as team_id,
          t.slug as team_slug,
          tt.name as team_name,
          t.logo_url as team_logo,
          c.slug as competition_slug
        FROM standings s
        JOIN teams t ON s.team_id = t.id
        LEFT JOIN team_translations tt ON t.id = tt.team_id AND tt.language = 'en'
        JOIN competitions c ON s.competition_id = c.id
        WHERE s.competition_id = ? AND s.season_id = ?
        ORDER BY s.position ASC
      `).all(competition.id, season_id)

      if (standings.length === 0) {
        return reply.status(404).send({ error: 'No standings found' })
      }

      reply.send({
        competition: {
          id: competition.id,
          slug: competition.slug,
          name: competition.name_key
        },
        season_id,
        standings,
        meta: {
          total_teams: standings.length,
          matches_played: standings[0]?.played || 0
        }
      })
    } catch (error) {
      reply.status(500).send({ error: 'Failed to fetch standings' })
    }
  })

  // GET /api/v1/standings/:competition_id/team/:team_id - Get specific team standing
  fastify.get('/:competition_id/team/:team_id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { competition_id, team_id } = request.params as any
    const { season_id = '1' } = request.query as any

    try {
      const standing = db.prepare(`
        SELECT
          s.id,
          s.position,
          s.played,
          s.wins,
          s.draws,
          s.losses,
          s.goals_for,
          s.goals_against,
          (s.goals_for - s.goals_against) as goal_difference,
          s.points,
          t.id as team_id,
          tt.name as team_name,
          c.slug as competition_slug
        FROM standings s
        JOIN teams t ON s.team_id = t.id
        LEFT JOIN team_translations tt ON t.id = tt.team_id AND tt.language = 'en'
        JOIN competitions c ON s.competition_id = c.id
        WHERE c.id = ? AND t.id = ? AND s.season_id = ?
      `).get(competition_id, team_id, season_id)

      if (!standing) {
        return reply.status(404).send({ error: 'Standing not found' })
      }

      // Get nearest teams (top and bottom)
      const nearbyStandings = db.prepare(`
        SELECT position, tt.name as team_name, s.points
        FROM standings s
        JOIN teams t ON s.team_id = t.id
        LEFT JOIN team_translations tt ON t.id = tt.team_id AND tt.language = 'en'
        WHERE s.competition_id = ? AND s.season_id = ?
        AND s.position >= ? - 2 AND s.position <= ? + 2
        ORDER BY s.position
      `).all(competition_id, season_id, standing.position, standing.position)

      reply.send({
        current_standing: standing,
        nearby_standings: nearbyStandings,
        form: {
          recent_matches: 5,
          wins: standing.wins,
          draws: standing.draws,
          losses: standing.losses
        }
      })
    } catch (error) {
      reply.status(500).send({ error: 'Failed to fetch team standing' })
    }
  })
}
