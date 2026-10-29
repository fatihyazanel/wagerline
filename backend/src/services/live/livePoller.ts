import { getDb } from '../../database/init'
import { quotaManager } from '../quota/quotaManager'

const db = getDb()

class LivePoller {
  private isRunning: boolean = false

  async startPolling(): Promise<void> {
    if (this.isRunning) return
    this.isRunning = true

    console.log('🔄 Live Poller started')

    // Poll every 60 seconds for new live matches
    setInterval(async () => {
      if (!quotaManager.canRequest('P0')) {
        console.log('⛔ Quota limit - skipping live poll')
        return
      }

      await this.pollLiveMatches()
    }, 60000) // 60 seconds
  }

  async pollLiveMatches(): Promise<void> {
    try {
      // Get current live matches
      const liveMatches = await new Promise<any[]>((resolve) => {
        db.all(
          `SELECT id, status FROM events WHERE status IN ('LIVE', 'HT')`,
          [],
          (err, rows) => resolve(rows || [])
        )
      })

      console.log(`📊 Polling ${liveMatches.length} live matches`)

      for (const match of liveMatches) {
        quotaManager.consumeRequest()
        // Live match update would happen here
        // This is handled by liveEngine.fetchLiveMatchData()
      }
    } catch (error) {
      console.error('Error polling live matches:', error)
    }
  }

  stop(): void {
    this.isRunning = false
    console.log('🛑 Live Poller stopped')
  }
}

export const livePoller = new LivePoller()
