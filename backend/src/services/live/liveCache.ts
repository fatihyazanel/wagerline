interface CacheEntry {
  value: any
  timestamp: number
  ttl: number // seconds
}

class LiveCache {
  private cache: Map<string, CacheEntry> = new Map()
  private readonly DEFAULT_TTL = 60 // 1 minute

  set(key: string, value: any, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl,
    })
  }

  get(key: string): any | null {
    const entry = this.cache.get(key)

    if (!entry) {
      return null
    }

    // Check if expired
    const age = (Date.now() - entry.timestamp) / 1000
    if (age > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.value
  }

  has(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false

    // Check if expired
    const age = (Date.now() - entry.timestamp) / 1000
    if (age > entry.ttl) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  getStatus(): { keys: number; entries: any[] } {
    const entries: any[] = []

    for (const [key, entry] of this.cache) {
      const age = (Date.now() - entry.timestamp) / 1000
      const isExpired = age > entry.ttl

      if (!isExpired) {
        entries.push({
          key,
          age: Math.round(age),
          ttl: entry.ttl,
          expired: false,
        })
      } else {
        this.cache.delete(key)
      }
    }

    return {
      keys: entries.length,
      entries,
    }
  }

  // Get all live matches
  getLiveMatches(): any[] {
    const matches: any[] = []

    for (const [key, entry] of this.cache) {
      if (key.startsWith('fixture:')) {
        const age = (Date.now() - entry.timestamp) / 1000
        if (age <= entry.ttl) {
          matches.push(entry.value)
        } else {
          this.cache.delete(key)
        }
      }
    }

    return matches
  }

  // Check freshness
  isFresh(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false

    const age = (Date.now() - entry.timestamp) / 1000
    return age < 90 // Fresh if < 90 seconds
  }

  isStale(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return true

    const age = (Date.now() - entry.timestamp) / 1000
    return age > 90 && age <= 300 // Stale if 90-300 seconds
  }

  isExpired(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return true

    const age = (Date.now() - entry.timestamp) / 1000
    return age > entry.ttl // Expired if > TTL
  }
}

export const liveCache = new LiveCache()
