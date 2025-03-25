import {log} from "./DebugHelper"

import type {CleanUpFn, DebugLog, EmitOptions, EventCallback, EventMap, IEventEmitter, IEventSubscription, SubscriberWithPriority} from "./types"

export class EventEmitter<Events extends EventMap = EventMap> implements IEventEmitter<Events> {
  private subscriptions: Map<keyof Events, EventSubscription<Events[keyof Events]>>
  private maxListeners: number
  private debug: DebugLog

  constructor(options: {debug?: DebugLog; maxListeners?: number} = {}) {
    this.debug = options.debug || log
    this.subscriptions = new Map()
    this.maxListeners = options.maxListeners ?? 10
  }

  has(event: keyof Events): boolean {
    return this.subscriptions.has(event)
  }

  get eventNames(): (keyof Events)[] {
    return Array.from(this.subscriptions.keys())
  }

  isEmpty(): boolean {
    return this.subscriptions.size === 0
  }

  destroy(): void {
    this.debug("destroy", {message: `CLEARING ${this.subscriptions.size} EVENT TYPES`})

    this.subscriptions.forEach((subscription) => subscription.destroy())
    this.subscriptions.clear()
  }

  on<E extends keyof Events>(event: E, callback: EventCallback<Events[E]>, priority = 0): CleanUpFn {
    if (!this.subscriptions.has(event)) {
      this.subscriptions.set(event, new EventSubscription<Events[E]>(String(event), this.maxListeners))
    }

    const subscription = this.subscriptions.get(event)!
    const off = subscription.addSubscriber(callback, priority)

    this.debug("subscribe", {event, message: `PRIORITY ${priority}`})

    return () => {
      this.debug("unsubscribe", {event})
      off()
    }
  }

  once<E extends keyof Events>(event: E, callback: EventCallback<Events[E]>, priority = 0): void {
    this.debug("subscribe:once", {event})

    let off: null | (() => void) = this.on(
      event,
      async (data) => {
        this.debug("unsubscribe:once", {event})
        off?.()
        off = null
        await callback(data)
      },
      priority,
    )
  }

  off<E extends keyof Events>(event: E, callback?: EventCallback<Events[E]>): void {
    const subscription = this.subscriptions.get(event)
    if (!subscription) return

    if (callback) {
      this.debug("unsubscribe", {event})
      subscription.removeSubscriber(callback)
    } else {
      this.debug("unsubscribe_all", {
        event,
        message: `REMOVING ${subscription.subscriberCount} SUBSCRIBERS`,
      })
      subscription.destroy()
    }

    if (subscription.isEmpty) this.subscriptions.delete(event)
  }

  async emit<E extends keyof Events>(event: E, data: Events[E], options: EmitOptions = {strategy: "parallel"}): Promise<void> {
    const subscription = this.subscriptions.get(event)

    if (!subscription) {
      this.debug("emit", {event, message: `!!! NO EVENTS "${String(event)}" FOUND !!!`})
      return
    }

    this.debug("emit", {event, data, message: `STRATEGY: ${options.strategy}`})

    if (options.strategy === "sequential") {
      for (const {callback} of subscription.subscribers) {
        try {
          await callback(data)
        } catch (err) {
          console.error(`Error in listener for event "${String(event)}":`, err)
        }
      }
    } else {
      const results: Promise<void>[] = []

      for (const {callback} of subscription.subscribers) {
        try {
          const result = callback(data)
          if (result instanceof Promise) results.push(result)
        } catch (err) {
          console.error(`Error in listener for event "${String(event)}":`, err)
        }
      }

      await Promise.all(results)
    }
  }

  toPromise<E extends keyof Events>(event: E): Promise<Events[E]> {
    return new Promise((resolve) => this.once(event, resolve))
  }
}

class EventSubscription<T> implements IEventSubscription<T> {
  public type: string
  public subscribers: SubscriberWithPriority<T>[]
  private maxListeners: number

  constructor(type: string, maxListeners: number) {
    this.type = type
    this.maxListeners = maxListeners
    this.subscribers = []
  }

  get isEmpty(): boolean {
    return this.subscribers.length === 0
  }

  get subscriberCount(): number {
    return this.subscribers.length
  }

  addSubscriber(callback: EventCallback<T>, priority = 0): CleanUpFn {
    if (this.subscribers.some((s) => s.callback === callback)) {
      console.warn(`Duplicate listener detected for "${this.type}". Skipping.`)
      return () => this.removeSubscriber(callback)
    }

    if (this.subscribers.length >= this.maxListeners) {
      console.warn(
        `MaxListenersExceededWarning: Possible memory leak detected. ` + `More than ${this.maxListeners} listeners for event "${this.type}".`,
      )
    }

    this.subscribers.push({callback, priority})
    this.subscribers.sort((a, b) => b.priority - a.priority)

    return () => this.removeSubscriber(callback)
  }

  removeSubscriber(callback: EventCallback<T>): void {
    this.subscribers = this.subscribers.filter((s) => s.callback !== callback)
  }

  destroy(): void {
    this.subscribers = []
  }
}
