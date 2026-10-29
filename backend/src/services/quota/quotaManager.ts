interface QuotaState {
  dailyLimit: number
  dailyUsed: number
  minuteLimit: number
  minuteUsed: number
  minuteResetAt: number
  lastRequestAt: number
}

enum SafeMode {
  NORMAL = 'normal',      // > 50 remaining
  CONSERVATIVE = 'conservative', // 20-50
  CRITICAL = 'critical',  // 5-20
  EMERGENCY = 'emergency' // < 5
}

class QuotaManager {
  private state: QuotaState = {
    dailyLimit: 100,
    dailyUsed: 0,
    minuteLimit: 10,
    minuteUsed: 0,
    minuteResetAt: Date.now() + 60000,
    lastRequestAt: 0,
  }

  canRequest(priority: string = 'P5'): boolean {
    this.resetIfNeeded()

    const dailyRemaining = this.state.dailyLimit - this.state.dailyUsed
    const minuteRemaining = this.state.minuteLimit - this.state.minuteUsed
    const mode = this.getSafeMode()

    if (minuteRemaining <= 0) return false
    if (dailyRemaining <= 0) return false

    // Emergency mode: only allow P0, P1
    if (mode === SafeMode.EMERGENCY) {
      return ['P0', 'P1'].includes(priority)
    }

    // Critical mode: P0, P1, P2
    if (mode === SafeMode.CRITICAL) {
      return ['P0', 'P1', 'P2'].includes(priority)
    }

    return true
  }

  consumeRequest(): void {
    this.state.dailyUsed++
    this.state.minuteUsed++
    this.state.lastRequestAt = Date.now()
  }

  updateFromHeaders(headers: any): void {
    const limit = parseInt(headers['x-ratelimit-requests-limit'] || headers['X-RateLimit-Limit'] || '100')
    const remaining = parseInt(headers['x-ratelimit-requests-remaining'] || headers['X-RateLimit-Remaining'] || '0')

    if (limit > 0) {
      this.state.dailyLimit = limit
      this.state.dailyUsed = limit - remaining
    }
  }

  getDailyRemaining(): number {
    return Math.max(0, this.state.dailyLimit - this.state.dailyUsed)
  }

  getMinuteRemaining(): number {
    this.resetIfNeeded()
    return Math.max(0, this.state.minuteLimit - this.state.minuteUsed)
  }

  getSafeMode(): SafeMode {
    const remaining = this.getDailyRemaining()

    if (remaining > 50) return SafeMode.NORMAL
    if (remaining > 20) return SafeMode.CONSERVATIVE
    if (remaining > 5) return SafeMode.CRITICAL
    return SafeMode.EMERGENCY
  }

  shouldEnterSafeMode(): boolean {
    return this.getSafeMode() !== SafeMode.NORMAL
  }

  resetIfNeeded(): void {
    if (Date.now() >= this.state.minuteResetAt) {
      this.state.minuteUsed = 0
      this.state.minuteResetAt = Date.now() + 60000
    }
  }

  getStatus() {
    return {
      dailyUsed: this.state.dailyUsed,
      dailyLimit: this.state.dailyLimit,
      dailyRemaining: this.getDailyRemaining(),
      minuteUsed: this.state.minuteUsed,
      minuteLimit: this.state.minuteLimit,
      minuteRemaining: this.getMinuteRemaining(),
      safeMode: this.getSafeMode(),
      lastRequest: new Date(this.state.lastRequestAt).toISOString(),
    }
  }
}

export const quotaManager = new QuotaManager()
