import {publisher} from "@/core/pubsub"
import {IWebSocketClient} from "@/core/ws"
import {Errors} from "@/constants/errors"
import {Subscription} from "@/constants/messageTypes"
import {formatError} from "@/shared/messages/formatters"
import {MessageRequest} from "@/shared/messages/types"
import * as HallService from "./hall.service"

import type {PartialDeep} from "type-fest"
import type {Hall} from "./hall.types"

const subscription = publisher.register({
  name: "hall.subscribe",

  async prepareSnapshot(_, message: MessageRequest<Subscription, {id: number}>) {
    const {id} = message.data

    const hall = await HallService.getHall(id)

    return hall
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

export function notifyUpdate(hall: PartialDeep<Hall>) {
  subscription.notify("update", hall)
}
