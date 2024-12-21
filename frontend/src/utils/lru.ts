export type CacheKey = string | number | symbol | boolean

export class LRU<K = CacheKey, T = unknown> {
  maxSize: number
  items: Map<K, {value: T; updatedAt: number; ttl: number}>
  timerMap: Map<K, ReturnType<typeof setTimeout>>

  constructor(maxSize = 100) {
    this.maxSize = maxSize
    this.items = new Map()
    this.timerMap = new Map()
  }

  get(key: K): T | null {
    if (!this.items.has(key)) return null

    const item = this.items.get(key)!

    this.items.delete(key)
    this.items.set(key, item)

    return item.value
  }

  set(key: K, value: T, ttl: number): void {
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
      this.delete(oldestKey as any)
    }

    if (ttl > 0) {
      const timer = setTimeout(() => this.delete(key), ttl)
      this.timerMap.set(key, timer)
    }
  }

  delete(key: K) {
    const timer = this.timerMap.get(key)

    if (timer) {
      clearTimeout(timer)
      this.timerMap.delete(key)
    }

    this.items.delete(key)
  }

  clear() {
    for (const timer of this.timerMap.values()) {
      clearTimeout(timer)
    }

    this.timerMap.clear()
    this.items.clear()
  }

  has(key: K) {
    return this.items.has(key)
  }

  keys(): K[] {
    return Array.from(this.items.keys())
  }

  values(): T[] {
    return Array.from(this.items.values()).map(({value}) => value)
  }

  entries(): [K, T][] {
    return Array.from(this.items.entries()).map(([key, {value}]) => [key, value])
  }

  gc() {
    const now = Date.now()
    for (const [key, {updatedAt, ttl}] of this.items.entries()) {
      if (ttl > 0 && now - updatedAt > ttl) {
        this.delete(key)
      }
    }
  }
}
