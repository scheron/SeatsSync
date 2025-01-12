import {subscriptionManager} from "@/shared/subscriptions/manager"

import type {IWebSocketClient} from "@/core/ws/types"
import type {CinemaSubscriptionRequest} from "../types"

export function subscribeToCinema(data: CinemaSubscriptionRequest, ws: IWebSocketClient) {
  const subscriptionKey = `cinema:${data.cinemaId}`
  subscriptionManager.subscribe(subscriptionKey, ws)
}

export function unsubscribeFromCinema(data: CinemaSubscriptionRequest, ws: IWebSocketClient) {
  const subscriptionKey = `cinema:${data.cinemaId}`
  subscriptionManager.unsubscribe(subscriptionKey, ws)
}
