import {Errors} from "@seats-sync/constants/errors"
import {publisher} from "@/core/pubsub"
import {formatError} from "@/core/ws/messages"
import * as CinemaService from "./cinema.service"

import type {IWebSocketClient} from "@/core/ws"
import type {Cinema} from "@seats-sync/types/cinema"
import type {MessageRequest} from "@seats-sync/types/websocket"
import type {PartialDeep} from "type-fest"

const subscription = publisher.register({
  name: "cinemas.subscribe",

  async prepareSnapshot() {
    const cinemas = await CinemaService.getCinemas()
    return cinemas
  },
})

export function subscribe(ws: IWebSocketClient, message: MessageRequest<{id: number}>) {
  return subscription.subscribe(ws, message)
}

export function unsubscribe(ws: IWebSocketClient, message?: MessageRequest<{sub_eid?: string}>) {
  if (!message) {
    subscription.unsubscribe(ws.context.id)
    return
  }

  if (!message.data.sub_eid) ws.send(formatError({eid: message.eid, error: Errors.SubscriptionNotFound}))
  else subscription.unsubscribe(ws.context.id, message.data.sub_eid)
}

export function notifyUpdate(cinema: PartialDeep<Cinema>) {
  subscription.notify("update", cinema)
}
