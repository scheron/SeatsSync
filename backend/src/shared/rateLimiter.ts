import {logger} from "./logger"

type RateLimitEntry = {
  count: number
  resetAt: number
}

export class RateLimiter {
  private entries: Map<string, RateLimitEntry>

  constructor(
    private maxRequests: number,
    private windowMs: number,
    private cleanupIntervalMs: number = 60_000,
  ) {
    this.entries = new Map()
    this.startCleanup()
  }

  increment(key: string | undefined): void {
    if (!key) return

    const now = Date.now()
    const entry = this.entries.get(key)

    if (!entry || now >= entry.resetAt) {
      this.entries.set(key, {
        count: 1,
        resetAt: now + this.windowMs,
      })
      return
    }

    entry.count++
    if (entry.count > this.maxRequests) {
      logger.warn(`Rate limit exceeded for ${key}`)
    }
  }

  isRateLimited(key: string | undefined): boolean {
    if (!key) return false

    const now = Date.now()
    const entry = this.entries.get(key)

    if (!entry || now >= entry.resetAt) {
      return false
    }

    return entry.count >= this.maxRequests
  }

  private startCleanup(): void {
    setInterval(() => {
      const now = Date.now()
      for (const [key, entry] of this.entries.entries()) {
        if (now >= entry.resetAt) {
          this.entries.delete(key)
        }
      }
    }, this.cleanupIntervalMs)
  }

  getRemainingRequests(key: string | undefined): number {
    if (!key) return this.maxRequests

    const now = Date.now()
    const entry = this.entries.get(key)

    if (!entry || now >= entry.resetAt) {
      return this.maxRequests
    }

    return Math.max(0, this.maxRequests - entry.count)
  }

  getResetTime(key: string | undefined): number | null {
    if (!key) return null

    const entry = this.entries.get(key)
    return entry ? entry.resetAt : null
  }
}
