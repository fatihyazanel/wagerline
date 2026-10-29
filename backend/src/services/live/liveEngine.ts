import { getDb } from '../../database/init'
import { quotaManager } from '../quota/quotaManager'
import { livePoller } from './livePoller'
import { liveCache } from './liveCache'
import { changeDetector } from './changeDetector'

const db = getDb()

interface LiveMatch {
  fixtureId: number
  status: string
  minute: number
  homeTeamName: string
  awayTeamName: string
  homeScore: number
  awayScore: number
  lastUpdated: string
  incidents: any[]
}

interface LiveEngineConfig {
  adaptivePolling: boolean
  minPollingInterval: number // seconds
  maxPollingInterval: number
  batchSize: number
}

class LiveEngine {
  private config: LiveEngineConfig
  private liveMatches: Map<number, LiveMatch> = new Map()
  private pollingIntervals: Map<number, NodeJS.Timeout> = new Map()
  private isRunning: boolean = false

  constructor(config?: Partial<LiveEngineConfig>) {
    this.config = {
      adaptivePolling: true,
      minPollingInterval: 60, // 1 minute
      maxPollingInterval: 600, // 10 minutes
      batchSize: 5,
      ...config,
    }
  }

  async start(): Promise<void> {
    if (this.isRunning) return

    this.isRunning = true
    console.log('🚀 Live Engine started')

    // Initial load of live matches
    await this.loadLiveMatches()

    // Start polling for each match
    for (const [fixtureId, match] of this.liveMatches) {
      this.startPollingForMatch(fixtureId, match)
    }
  }

  async loadLiveMatches(): Promise<void> {
    try {
      const matches = await new Promise<any[]>((resolve) => {
        db.all(
          `SELECT id, status FROM events WHERE status IN ('LIVE', 'HT')`,
          [],
          (err, rows) => resolve(rows || [])
        )
      })

      for (const match of matches) {
        const liveMatch = await this.fetchLiveMatchData(match.id)
        if (liveMatch) {
          this.liveMatches.set(match.id, liveMatch)
        }
      }

      console.log(`📊 Loaded ${this.liveMatches.size} live matches`)
    } catch (error) {
      console.error('Error loading live matches:', error)
    }
  }

  async fetchLiveMatchData(fixtureId: number): Promise<LiveMatch | null> {
    try {
      if (!quotaManager.canRequest('P0')) {
        console.log('⛔ Quota limit for live data')
        return null
      }

      const fixture = await new Promise<any>((resolve) => {
        db.get(
          `SELECT * FROM events WHERE id = ?`,
          [fixtureId],
          (err, row) => resolve(row)
        )
      })

      if (!fixture) return null

      quotaManager.consumeRequest()

      // Fetch incidents
      const incidents = await new Promise<any[]>((resolve) => {
        db.all(
          `SELECT * FROM event_incidents WHERE event_id = ? ORDER BY elapsed DESC`,
          [fixtureId],
          (err, rows) => resolve(rows || [])
        )
      })

      return {
        fixtureId,
        status: fixture.status,
        minute: fixture.elapsed || 0,
        homeTeamName: fixture.home_team || 'Unknown',
        awayTeamName: fixture.away_team || 'Unknown',
        homeScore: fixture.home_score || 0,
        awayScore: fixture.away_score || 0,
        lastUpdated: new Date().toISOString(),
        incidents,
      }
    } catch (error) {
      console.error(`Error fetching live data for fixture ${fixtureId}:`, error)
      return null
    }
  }

  private startPollingForMatch(fixtureId: number, match: LiveMatch): void {
    const pollInterval = this.calculatePollingInterval(match)

    const timeoutId = setInterval(async () => {
      if (!quotaManager.canRequest('P0')) {
        console.log(`⏸️  Polling paused for fixture ${fixtureId} due to quota`)
        return
      }

      const updatedMatch = await this.fetchLiveMatchData(fixtureId)
      if (!updatedMatch) return

      // Detect changes
      const changes = changeDetector.detectChanges(match, updatedMatch)

      if (changes.length > 0) {
        console.log(`🔄 Fixture ${fixtureId}: ${changes.join(', ')}`)

        // Update cache
        liveCache.set(`fixture:${fixtureId}`, updatedMatch)

        // Update database
        await this.updateMatchInDatabase(fixtureId, updatedMatch)

        // Emit SSE events
        this.emitLiveEvent(fixtureId, changes, updatedMatch)

        // Update local state
        this.liveMatches.set(fixtureId, updatedMatch)
      }

      // Check if match is finished
      if (updatedMatch.status === 'FT' || updatedMatch.status === 'AET' || updatedMatch.status === 'PEN') {
        console.log(`⏹️  Fixture ${fixtureId} finished`)
        this.stopPollingForMatch(fixtureId)
        await this.finalizeMatch(fixtureId)
      }
    }, pollInterval * 1000)

    this.pollingIntervals.set(fixtureId, timeoutId)
  }

  private calculatePollingInterval(match: LiveMatch): number {
    if (!this.config.adaptivePolling) {
      return this.config.minPollingInterval
    }

    // Adaptive polling based on match state
    if (match.status === 'NS') {
      return 600 // 10 min before match
    } else if (match.minute < 10) {
      return 300 // 5 min at start
    } else if (match.status === 'LIVE') {
      return this.config.minPollingInterval // 60 sec during live
    } else if (match.status === 'HT') {
      return 300 // 5 min at halftime
    } else {
      return 600 // 10 min otherwise
    }
  }

  private async updateMatchInDatabase(fixtureId: number, match: LiveMatch): Promise<void> {
    try {
      await new Promise<void>((resolve) => {
        db.run(
          `UPDATE events SET home_score = ?, away_score = ?, status = ?, elapsed = ?, updated_at = datetime('now')
           WHERE id = ?`,
          [match.homeScore, match.awayScore, match.status, match.minute, fixtureId],
          () => resolve()
        )
      })
    } catch (error) {
      console.error('Error updating match in database:', error)
    }
  }

  private emitLiveEvent(fixtureId: number, changes: string[], match: LiveMatch): void {
    // Will be handled by SSE broadcaster
    // For now, just log
    console.log(`📤 SSE Event: Fixture ${fixtureId} -`, changes)
  }

  private stopPollingForMatch(fixtureId: number): void {
    const timeoutId = this.pollingIntervals.get(fixtureId)
    if (timeoutId) {
      clearInterval(timeoutId)
      this.pollingIntervals.delete(fixtureId)
    }
  }

  private async finalizeMatch(fixtureId: number): Promise<void> {
    // Run final sync for match data, statistics, etc.
    console.log(`🏁 Finalizing match ${fixtureId}`)

    this.liveMatches.delete(fixtureId)

    // Additional final sync can be added here
  }

  getActiveLiveMatches(): LiveMatch[] {
    return Array.from(this.liveMatches.values())
  }

  getLiveMatch(fixtureId: number): LiveMatch | undefined {
    return this.liveMatches.get(fixtureId)
  }

  stop(): void {
    this.isRunning = false

    // Clear all polling intervals
    for (const timeoutId of this.pollingIntervals.values()) {
      clearInterval(timeoutId)
    }
    this.pollingIntervals.clear()
    this.liveMatches.clear()

    console.log('🛑 Live Engine stopped')
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      activeLiveMatches: this.liveMatches.size,
      pollingIntervals: this.pollingIntervals.size,
      quotaStatus: quotaManager.getStatus(),
    }
  }
}

export const liveEngine = new LiveEngine({
  adaptivePolling: true,
  minPollingInterval: 60,
  maxPollingInterval: 600,
})
