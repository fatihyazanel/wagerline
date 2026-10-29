import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { getDb } from '../database/init'

const db = getDb()

/**
 * Predictions Routes
 * GET /api/v1/predictions - Get predictions for upcoming matches
 * GET /api/v1/predictions/:event_id - Get prediction for specific match
 *
 * NOTE: ML Model placeholder
 * Real implementation would use:
 * - XGBoost for win probability
 * - Poisson regression for score prediction
 * - Features from team/player stats
 */

export async function predictionsRoutes(fastify: FastifyInstance) {
  // GET /api/v1/predictions - Get predictions for upcoming matches
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const { limit = '10', competition_id } = request.query as any

    try {
      const limitNum = Math.min(100, Math.max(1, parseInt(limit)))

      let query = `
        SELECT
          e.id as event_id,
          e.start_time,
          ht.id as home_team_id,
          ht_t.name as home_team,
          at.id as away_team_id,
          at_t.name as away_team,
          ht.logo_url as home_team_logo,
          at.logo_url as away_team_logo,
          c.slug as competition_slug,
          c.name_key as competition_name,
          -- Current standings
          (SELECT position FROM standings WHERE team_id = ht.id AND season_id = 1) as home_team_position,
          (SELECT position FROM standings WHERE team_id = at.id AND season_id = 1) as away_team_position,
          (SELECT points FROM standings WHERE team_id = ht.id AND season_id = 1) as home_team_points,
          (SELECT points FROM standings WHERE team_id = at.id AND season_id = 1) as away_team_points
        FROM events e
        JOIN teams ht ON e.home_team_id = ht.id
        JOIN teams at ON e.away_team_id = at.id
        LEFT JOIN team_translations ht_t ON ht.id = ht_t.team_id AND ht_t.language = 'en'
        LEFT JOIN team_translations at_t ON at.id = at_t.team_id AND at_t.language = 'en'
        JOIN competitions c ON e.competition_id = c.id
        WHERE e.status = 'scheduled'
      `

      const params: any[] = []

      if (competition_id) {
        query += ` AND c.id = ?`
        params.push(competition_id)
      }

      query += ` ORDER BY e.start_time ASC LIMIT ?`
      params.push(limitNum)

      const matches = db.prepare(query).all(...params)

      // Add predictions (placeholder)
      const predictions = matches.map((match: any) => {
        // TODO: Replace with actual ML predictions
        // For now, use simple heuristic based on standings position
        const homeAdvantage = 0.05
        const positionDiff = (match.away_team_position || 15) - (match.home_team_position || 15)
        const pointsDiff = (match.home_team_points || 0) - (match.away_team_points || 0)

        // Simple win probability calculation (placeholder)
        let homeWinProb = 0.45 + (pointsDiff * 0.01) + homeAdvantage
        homeWinProb = Math.max(0.2, Math.min(0.8, homeWinProb)) // Clamp between 0.2 and 0.8

        const drawProb = 0.25
        const awayWinProb = 1 - homeWinProb - drawProb

        return {
          ...match,
          prediction: {
            home_win_probability: parseFloat((homeWinProb).toFixed(3)),
            draw_probability: parseFloat((drawProb).toFixed(3)),
            away_win_probability: parseFloat((awayWinProb).toFixed(3)),
            predicted_home_score: Math.random() > 0.5 ? 2 : 1,
            predicted_away_score: Math.random() > 0.5 ? 1 : 0,
            confidence: 0.65,
            model_version: 'v0.1-placeholder'
          },
          recommendation: homeWinProb > 0.55 ? 'Home' : awayWinProb > 0.55 ? 'Away' : 'Draw'
        }
      })

      reply.send({
        data: predictions,
        meta: {
          count: predictions.length,
          model: 'placeholder-v0.1',
          note: 'Replace with actual ML model (XGBoost + Poisson regression)'
        }
      })
    } catch (error) {
      reply.status(500).send({ error: 'Failed to fetch predictions' })
    }
  })

  // GET /api/v1/predictions/:event_id - Get prediction for specific match
  fastify.get('/:event_id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { event_id } = request.params as any

    try {
      const event = db.prepare(`
        SELECT
          e.id as event_id,
          e.start_time,
          ht.id as home_team_id,
          ht_t.name as home_team,
          at.id as away_team_id,
          at_t.name as away_team,
          ht.logo_url as home_team_logo,
          at.logo_url as away_team_logo,
          c.slug as competition_slug
        FROM events e
        JOIN teams ht ON e.home_team_id = ht.id
        JOIN teams at ON e.away_team_id = at.id
        LEFT JOIN team_translations ht_t ON ht.id = ht_t.team_id AND ht_t.language = 'en'
        LEFT JOIN team_translations at_t ON at.id = at_t.team_id AND at_t.language = 'en'
        JOIN competitions c ON e.competition_id = c.id
        WHERE e.id = ?
      `).get(event_id)

      if (!event) {
        return reply.status(404).send({ error: 'Event not found' })
      }

      // Get team form (last 5 matches)
      const homeForm = db.prepare(`
        SELECT
          CASE
            WHEN (SELECT score FROM event_scores WHERE event_id = e.id AND participant_id = ?) > (SELECT score FROM event_scores WHERE event_id = e.id AND participant_id != ?) THEN 'W'
            WHEN (SELECT score FROM event_scores WHERE event_id = e.id AND participant_id = ?) < (SELECT score FROM event_scores WHERE event_id = e.id AND participant_id != ?) THEN 'L'
            ELSE 'D'
          END as result
        FROM events e
        WHERE e.home_team_id = ? AND e.status = 'finished'
        ORDER BY e.start_time DESC
        LIMIT 5
      `).all(event.home_team_id, event.home_team_id, event.home_team_id, event.home_team_id, event.home_team_id)

      const awayForm = db.prepare(`
        SELECT
          CASE
            WHEN (SELECT score FROM event_scores WHERE event_id = e.id AND participant_id = ?) > (SELECT score FROM event_scores WHERE event_id = e.id AND participant_id != ?) THEN 'W'
            WHEN (SELECT score FROM event_scores WHERE event_id = e.id AND participant_id = ?) < (SELECT score FROM event_scores WHERE event_id = e.id AND participant_id != ?) THEN 'L'
            ELSE 'D'
          END as result
        FROM events e
        WHERE e.away_team_id = ? AND e.status = 'finished'
        ORDER BY e.start_time DESC
        LIMIT 5
      `).all(event.away_team_id, event.away_team_id, event.away_team_id, event.away_team_id, event.away_team_id)

      // Placeholder prediction
      const prediction = {
        home_win_probability: 0.48,
        draw_probability: 0.27,
        away_win_probability: 0.25,
        predicted_home_score: 1,
        predicted_away_score: 1,
        confidence: 0.68,
        expected_goals_home: 1.5,
        expected_goals_away: 1.1
      }

      reply.send({
        event,
        form: {
          home_team_form: homeForm.map((f: any) => f.result).join(''),
          away_team_form: awayForm.map((f: any) => f.result).join('')
        },
        prediction,
        model_info: {
          version: 'v0.1-placeholder',
          note: 'This is a placeholder. Replace with actual ML model.',
          required_ml_models: [
            'XGBoost classifier for win/draw/loss prediction',
            'Poisson regression for goal count prediction',
            'Player performance model',
            'Injury impact model'
          ]
        }
      })
    } catch (error) {
      reply.status(500).send({ error: 'Failed to fetch prediction' })
    }
  })
}
