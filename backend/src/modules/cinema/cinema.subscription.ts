import {publisher} from "@/core/pubsub"
import {IWebSocketClient} from "@/core/ws"
import {Errors} from "@/constants/errors"
import {Subscription} from "@/constants/messageTypes"
import {formatError} from "@/shared/messages/formatters"
import {MessageRequest} from "@/shared/messages/types"
import * as CinemaService from "./cinema.service"

import type {PartialDeep} from "type-fest"
import type {Cinema} from "./cinema.types"

const subscription = publisher.register({
  name: "cinemas.subscribe",

  async prepareSnapshot() {
    const cinemas = await CinemaService.getCinemas()
    return cinemas
  },
})

export function subscribe(ws: IWebSocketClient, message: MessageRequest<Subscription, {id: number}>) {
  return subscription.subscribe(ws, message)
}

export function unsubscribe(ws: IWebSocketClient, message?: MessageRequest<Subscription, {sub_eid?: string}>) {
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
