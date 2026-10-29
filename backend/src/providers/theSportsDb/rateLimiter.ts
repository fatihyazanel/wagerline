/**
 * Lightweight sequential throttle for TheSportsDB free-tier calls (~30 req/min undocumented cap).
 * Deliberately NOT routed through quotaManager, which is tuned for API-Football's
 * 100/day + 10/min shape and would misrepresent/contend with TheSportsDB's actual constraint.
 */
class TheSportsDbRateLimiter {
  private lastRequestAt = 0

  constructor(private readonly minIntervalMs: number = 2500) {}

  async throttle(): Promise<void> {
    const elapsed = Date.now() - this.lastRequestAt
    const wait = this.minIntervalMs - elapsed
    if (wait > 0) {
      await new Promise((resolve) => setTimeout(resolve, wait))
    }
    this.lastRequestAt = Date.now()
  }
}

export const theSportsDbRateLimiter = new TheSportsDbRateLimiter(2500)
