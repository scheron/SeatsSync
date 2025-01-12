export type CacheKey = string | number | symbol | boolean

export class LRU<K = CacheKey, T = unknown> {
  maxSize: number
  private items: Map<K, {value: T; updatedAt: number; ttl: number}>
  private timerMap: Map<K, NodeJS.Timeout>

  constructor(maxSize = 100) {
    if (maxSize <= 0) throw new Error("Cache size must be greater than 0")
    this.maxSize = maxSize
    this.items = new Map()
    this.timerMap = new Map()
  }

  get(key: K): T | null {
    if (!this.items.has(key)) return null

    const item = this.items.get(key)!
    const now = Date.now()

    if (item.ttl > 0 && now - item.updatedAt > item.ttl) {
      this.delete(key)
      return null
    }

    this.items.delete(key)
    this.items.set(key, item)

    return item.value
  }

  set(key: K, value: T, ttl: number): void {
    if (ttl < 0) throw new Error("TTL must be greater than or equal to 0")

    const existingTimer = this.timerMap.get(key)
    if (existingTimer) {
      clearTimeout(existingTimer)
      this.timerMap.delete(key)
    }

    if (this.items.has(key)) {
      this.items.delete(key)
    }

    const updatedAt = Date.now()
    this.items.set(key, {value, updatedAt, ttl})

    if (this.items.size > this.maxSize) {
      const oldestKey = this.items.keys().next().value
      this.delete(oldestKey)
    }

    if (ttl > 0) {
      const timer = setTimeout(() => this.delete(key), ttl)
      this.timerMap.set(key, timer)
    }
  }

  delete(key: K): boolean {
    const timer = this.timerMap.get(key)
    if (timer) {
      clearTimeout(timer)
      this.timerMap.delete(key)
    }

    return this.items.delete(key)
  }

  clear(): void {
    for (const timer of this.timerMap.values()) {
      clearTimeout(timer)
    }

    this.timerMap.clear()
    this.items.clear()
  }

  has(key: K): boolean {
    if (!this.items.has(key)) return false

    const item = this.items.get(key)!
    const now = Date.now()

    if (item.ttl > 0 && now - item.updatedAt > item.ttl) {
      this.delete(key)
      return false
    }

    return true
  }

  keys(): K[] {
    this.gc()
    return Array.from(this.items.keys())
  }

  values(): T[] {
    this.gc()
    return Array.from(this.items.values()).map(({value}) => value)
  }

  entries(): [K, T][] {
    this.gc()
    return Array.from(this.items.entries()).map(([key, {value}]) => [key, value])
  }

  size(): number {
    this.gc()
    return this.items.size
  }

  gc(): void {
    const now = Date.now()
    for (const [key, {updatedAt, ttl}] of this.items.entries()) {
      if (ttl > 0 && now - updatedAt > ttl) {
        this.delete(key)
      }
    }
  }
}
