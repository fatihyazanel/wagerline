import axios from 'axios'
import { getDb } from '../database/init'

const db = getDb()

/**
 * CANLI MAÇ GÜNCELLEME SİSTEMİ
 * Her 30-60 saniyede çalışır
 * Live score, stats, match events'i güncelleyen
 */

async function fetchLiveMatches() {
  console.log(`\n⚡ [${new Date().toLocaleTimeString()}] Canlı maçlar kontrol ediliyor...`)

  return new Promise<void>((resolve) => {
    db.all(
      `SELECT e.id, e.home_team_id, e.away_team_id, e.competition_id
       FROM events e
       WHERE e.status = 'live' OR (e.status = 'scheduled' AND e.start_time < datetime('now', '+1 hour') AND e.start_time > datetime('now', '-2 hours'))
       ORDER BY e.start_time DESC`,
      async (err, events: any[]) => {
        if (!events || events.length === 0) {
          console.log('  📭 Şu anda canlı maç yok')
          resolve()
          return
        }

        console.log(`  📊 ${events.length} maç takip ediliyor`)

        for (const event of events) {
          // Simulate live score update
          const homeScore = Math.floor(Math.random() * 5)
          const awayScore = Math.floor(Math.random() * 5)
          const elapsed = Math.floor(Math.random() * 90)

          await new Promise<void>((resolve) => {
            db.run(
              `INSERT OR REPLACE INTO live_events
               (event_id, status, elapsed, current_home_score, current_away_score, last_update)
               VALUES (?, ?, ?, ?, ?, ?)`,
              [event.id, elapsed > 45 ? 'live' : 'live', elapsed, homeScore, awayScore, new Date().toISOString()],
              () => {
                // Update main scores
                db.run(
                  `UPDATE event_scores SET score = ? WHERE event_id = ? AND participant_id = ?`,
                  [homeScore, event.id, event.home_team_id],
                  () => {
                    db.run(
                      `UPDATE event_scores SET score = ? WHERE event_id = ? AND participant_id = ?`,
                      [awayScore, event.id, event.away_team_id],
                      () => resolve()
                    )
                  }
                )
              }
            )
          })
        }

        console.log(`  ✅ ${events.length} maç güncellendi`)
        resolve()
      }
    )
  })
}

async function startLivePolling(intervalMs: number = 60000) {
  console.log('\n' + '='.repeat(70))
  console.log('  CANLI MAÇ POLLING BAŞLANDI')
  console.log(`  Güncelleme Aralığı: ${intervalMs / 1000} saniye`)
  console.log('='.repeat(70))

  // İlk çalıştırma
  await fetchLiveMatches()

  // Tekrarlayan polling
  setInterval(async () => {
    try {
      await fetchLiveMatches()
    } catch (error) {
      console.error('❌ Live polling error:', error)
    }
  }, intervalMs)

  console.log('\n✨ Canlı sistem aktif ve çalışıyor...')
}

// Test mode
if (process.argv[2] === 'test') {
  startLivePolling(10000).catch(console.error)
} else {
  // Production mode - 60 second interval
  startLivePolling(60000).catch(console.error)
}
