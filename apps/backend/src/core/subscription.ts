import {Errors} from "@seats-sync/constants/errors"
import {publisher} from "@/core/pubsub"
import {formatError} from "@/core/ws/messages"

import type {SubscriptionHandler} from "@/core/pubsub"
import type {IWebSocketClient} from "@/core/ws"
import type {Subscription as SubscriptionType} from "@seats-sync/constants/subscriptions"
import type {MessageRequest} from "@seats-sync/types/websocket"

export function createSubscription<T = any>(name: SubscriptionType, prepareSnapshot: SubscriptionHandler<T>["prepareSnapshot"]) {
  const subscription = publisher.register({name, prepareSnapshot})

  function subscribe(ws: IWebSocketClient, message: MessageRequest<T>) {
    return subscription.subscribe(ws, message)
  }

  function unsubscribe(ws: IWebSocketClient, message?: MessageRequest<{sub_eid?: string}>) {
    if (!message) {
      subscription.unsubscribe(ws.context.id)
      return
    }

    if (!message.data.sub_eid) {
      ws.send(formatError({eid: message.eid, error: Errors.SubscriptionNotFound}))
    } else {
      subscription.unsubscribe(ws.context.id, message.data.sub_eid)
    }
  }

  function notify<T = any>(data: T) {
    subscription.notify("update", data)
  }

  return {subscribe, unsubscribe, notify}
}
