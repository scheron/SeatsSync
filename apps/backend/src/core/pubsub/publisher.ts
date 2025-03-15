import {Subscriber} from "./subscriber"

import type {ErrorCode} from "@seats-sync/constants/errors"
import type {Subscription} from "@seats-sync/constants/subscriptions"
import type {ResponseStatus} from "@seats-sync/types/websocket"
import type {SubscriptionHandler} from "./types"

export class Publisher {
  private subscriptions = new Map<string, Subscriber>()

  register<D>(handler: SubscriptionHandler<D>): Subscriber<D> {
    const subscription = new Subscriber(handler)

    this.subscriptions.set(handler.name, subscription)

    return subscription
  }

  get(name: Subscription): Subscriber | null {
    return this.subscriptions.get(name) ?? null
  }

  notify<T>(name: Subscription, status: Extract<ResponseStatus, "update" | "error">, data: T | ErrorCode): boolean {
    const subscription = this.subscriptions.get(name)
    if (!subscription) return false

    subscription.notify(status, data)
    return true
  }
}
