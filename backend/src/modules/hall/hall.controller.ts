import {Subscriptions} from "@/shared/constants/messageTypes"
import {subscribe, unsubscribe} from "./hall.subscription"

import type {IWebSocketClient} from "@/core/ws"
import type {MessageRequest} from "@/core/ws/messages"
import type {Subscription} from "@/shared/constants/messageTypes"
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
