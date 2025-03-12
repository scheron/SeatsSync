import {DebugHelper} from "./DebugHelper"

import type {CleanUpFn, EventCallback, EventMap} from "./types"

export class EventEmitter<Events extends EventMap = EventMap> {
  private subscriptions: Map<keyof Events, EventSubscription<Events[keyof Events]>>

  private debug: DebugHelper<Events>

  constructor(options: {debug?: boolean} = {}) {
    this.subscriptions = new Map()
    this.debug = new DebugHelper<Events>(options.debug || false)
  }

  isEmpty() {
    return this.subscriptions.size === 0
  }

  destroy() {
    this.debug.log("destroy", {message: `CLEARING ${this.subscriptions.size} EVENT TYPES`})

    this.subscriptions.forEach((subscription) => subscription.destroy())
    this.subscriptions.clear()
  }

  on<E extends keyof Events>(event: E, callback: EventCallback<Events[E]>): CleanUpFn {
    if (!this.subscriptions.has(event)) this.subscriptions.set(event, new EventSubscription<Events[E]>(String(event)))

    const subscription = this.subscriptions.get(event)!
    const off = subscription.addSubscriber(callback)

    this.debug.log("subscribe", {event})

    return () => {
      this.debug.log("unsubscribe", {event})
      off()
    }
  }

  once<E extends keyof Events>(event: E, callback: EventCallback<Events[E]>): void {
    this.debug.log("subscribe", {event})

    let off: null | (() => void) = this.on(event, (data) => {
      this.debug.log("unsubscribe", {event})
      off?.()
      off = null
      callback(data)
    })
  }

  off<E extends keyof Events>(event: E, callback?: EventCallback<Events[E]>): void {
    const subscription = this.subscriptions.get(event)
    if (!subscription) return

    if (callback) {
      this.debug.log("unsubscribe", {event})

      subscription.removeSubscriber(callback)
    } else {
      this.debug.log("unsubscribe_all", {event, message: `REMOVING ${subscription.subscribers.size} SUBSCRIBERS`})
      subscription.destroy()
    }

    if (subscription.isEmpty) this.subscriptions.delete(event)
  }

  notify<E extends keyof Events>(event: E, data: Events[E]): void {
    const subscription = this.subscriptions.get(event)

    if (!subscription) {
      this.debug.log("notify", {event, message: `!!! NO EVENTS "${event.toString()}" FOUND !!!`})
      return
    }

    this.debug.log("notify", {event, data})
    subscription.subscribers.forEach((callback) => callback(data))
  }
}

class EventSubscription<T> {
  public type: string
  public subscribers: Set<EventCallback<T>>

  constructor(type: string) {
    this.type = type
    this.subscribers = new Set()
  }

  get isEmpty(): boolean {
    return this.subscribers.size === 0
  }

  addSubscriber(subscriber: EventCallback<T>): CleanUpFn {
    this.subscribers.add(subscriber)
    return () => this.removeSubscriber(subscriber)
  }

  removeSubscriber(subscriber: EventCallback<T>): void {
    this.subscribers.delete(subscriber)
  }

  destroy(): void {
    this.subscribers.clear()
  }
}
