import { db } from '../../database/init'
import { quotaManager } from '../quota/quotaManager'
import { getProvider } from '../provider/providerManager'
import { generatePoissonPrediction } from '../normalization/predictionNormalizer'

export interface PredictionSyncResult {
  success: boolean
  inserted: number
  updated: number
  duration: number
  error?: string
}

export async function syncPredictionsForFixtures(fixtureIds: number[]): Promise<PredictionSyncResult> {
  const startTime = Date.now()

  try {
    let inserted = 0
    let updated = 0

    for (const fixtureId of fixtureIds) {
      if (!quotaManager.canRequest('P3')) break

      try {
        quotaManager.consumeRequest()

        // Get fixture details
        const fixture = await new Promise<any>((resolve) => {
          db.get(
            'SELECT id FROM events WHERE id = ?',
            [fixtureId],
            (err, row) => resolve(row)
          )
        })

        if (!fixture) continue

        // Generate Poisson prediction
        const prediction = generatePoissonPrediction(fixtureId, {}, {})

        const exists = await new Promise<any>((resolve) => {
          db.get(
            'SELECT id FROM predictions WHERE event_id = ? AND provider = ?',
            [fixtureId, 'wagerline-ml'],
            (err, row) => resolve(row)
          )
        })

        if (exists) {
          updated++
        } else {
          await new Promise<void>((resolve) => {
            db.run(
              `INSERT INTO predictions (
                event_id, provider, home_probability, draw_probability, away_probability,
                predicted_home_score, predicted_away_score, confidence, created_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
              [
                fixtureId,
                'wagerline-ml',
                prediction.homeWinProbability,
                prediction.drawProbability,
                prediction.awayWinProbability,
                prediction.expectedHomeGoals,
                prediction.expectedAwayGoals,
                prediction.confidence,
              ],
              () => {
                inserted++
                resolve()
              }
            )
          })
        }
      } catch (error) {
        console.warn(`Error syncing predictions for fixture ${fixtureId}:`, (error as any).message)
      }
    }

    return {
      success: true,
      inserted,
      updated,
      duration: Date.now() - startTime,
    }
  } catch (error) {
    return {
      success: false,
      inserted: 0,
      updated: 0,
      error: (error as any).message,
      duration: Date.now() - startTime,
    }
  }
}
