type ClearFn<T = any> = (...args: T[]) => void

export class Events {
  private subscriptions: Map<string, EventSubscription>

  constructor() {
    this.subscriptions = new Map()
  }

  isEmpty(): boolean {
    return this.subscriptions.size === 0
  }

  destroy(): void {
    this.subscriptions.forEach((subscription) => subscription.destroy())
    this.subscriptions.clear()
  }

  on<T = any>(event: string, cb: ClearFn<T>): () => void {
    if (!this.subscriptions.has(event)) {
      this.subscriptions.set(event, new EventSubscription(event))
    }

    const subscription = this.subscriptions.get(event)!

    const off = subscription.addSubscriber(cb)

    return () => off()
  }

  once<T = any>(event: string, cb: ClearFn<T>): void {
    let off: null | (() => void) = this.on(event, (data: T) => {
      off?.()
      off = null

      cb(data)
    })
  }

  off<T = any>(event: string, cb?: ClearFn<T>): void {
    const subscription = this.subscriptions.get(event)
    if (!subscription) return

    if (cb) {
      subscription.removeSubscriber(cb)
    } else {
      subscription.destroy()
    }

    if (subscription.isEmpty) {
      this.subscriptions.delete(event)
    }
  }

  notify<T = any>(event: string, ...data: T[]): void {
    const subscription = this.subscriptions.get(event)

    if (!subscription) return

    subscription.subscribers.forEach((callback) => callback(...data))
  }
}

class EventSubscription {
  public type: string
  public subscribers: Set<ClearFn>

  constructor(type: string) {
    this.type = type
    this.subscribers = new Set()
  }

  get isEmpty(): boolean {
    return this.subscribers.size === 0
  }

  addSubscriber(subscriber: ClearFn): () => void {
    this.subscribers.add(subscriber)

    return () => this.removeSubscriber(subscriber)
  }

  removeSubscriber(subscriber: ClearFn): void {
    this.subscribers.delete(subscriber)
  }

  destroy(): void {
    this.subscribers.clear()
  }
}
