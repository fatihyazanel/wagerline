/**
 * Generic lightweight sequential throttle for free/unlimited real APIs (NHL, MLB Stats,
 * Jolpica F1) that must NOT share the global quotaManager — that manager's 100/day + 10/min
 * budget is tuned for API-Football and gets exhausted almost instantly by these APIs' higher
 * call volumes (e.g. per-team roster/schedule fetches), silently starving unrelated sports.
 */
export class SimpleRateLimiter {
  private lastRequestAt = 0

  constructor(private readonly minIntervalMs: number) {}

  async throttle(): Promise<void> {
    const elapsed = Date.now() - this.lastRequestAt
    const wait = this.minIntervalMs - elapsed
    if (wait > 0) {
      await new Promise((resolve) => setTimeout(resolve, wait))
    }
    this.lastRequestAt = Date.now()
  }
}
