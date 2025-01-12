import {subscriptionManager} from "@/shared/subscriptions/manager"

import type {IWebSocketClient} from "@/core/ws/types"

export function subscribeToUserStatus(userId: number, ws: IWebSocketClient) {
  const subscriptionKey = `user:${userId}`
  subscriptionManager.subscribe(subscriptionKey, ws)
}

export function unsubscribeFromUserStatus(userId: number, ws: IWebSocketClient) {
  const subscriptionKey = `user:${userId}`
  subscriptionManager.unsubscribe(subscriptionKey, ws)
}
