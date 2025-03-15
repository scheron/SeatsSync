import {Errors} from "@seats-sync/constants/errors"
import {publisher} from "@/core/pubsub"
import {formatError} from "@/core/ws/messages"
import * as HallService from "./hall.service"

import type {IWebSocketClient} from "@/core/ws"
import type {Hall} from "@seats-sync/types/cinema"
import type {MessageRequest} from "@seats-sync/types/websocket"
import type {PartialDeep} from "type-fest"

const subscription = publisher.register({
  name: "hall.subscribe",

  async prepareSnapshot(_, message: MessageRequest<{id: number}>) {
    const {id} = message.data

    const hall = await HallService.getHall(id)

    return hall
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

export function notifyUpdate(hall: PartialDeep<Hall>) {
  subscription.notify("update", hall)
}
