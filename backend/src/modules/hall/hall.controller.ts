import {IWebSocketClient} from "@/core/ws"
import {MessageRequest} from "@/core/ws/messages"
import {Subscription, Subscriptions} from "@/constants/messageTypes"
import {subscribe, unsubscribe} from "./hall.subscription"

import type {HallMessage} from "./hall.types"

export function onMessage(ws: IWebSocketClient, message: HallMessage) {
  switch (message.type) {
    case Subscriptions["hall.subscribe"]:
      subscribe(ws, message as MessageRequest<Subscription, {id: number}>)
      return true
    case Subscriptions["hall.unsubscribe"]:
      unsubscribe(ws, message)
      return true
    default: {
      return false
    }
  }
}
