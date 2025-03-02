import {notifyUpdate, subscribe, unsubscribe} from "./cinema"
import {IWebSocketClient} from "@/core/ws"
import {Subscription, Subscriptions} from "@/constants/messageTypes"
import {MessageRequest} from "@/shared/messages/types"

export {notifyUpdate, unsubscribe}

export function onMessage(ws: IWebSocketClient, message: MessageRequest<Subscription>) {
  switch (message.type) {
    case Subscriptions["cinemas.subscribe"]:
      subscribe(ws, message as MessageRequest<Subscription, {id: number}>)
      return true
    case Subscriptions["cinemas.unsubscribe"]:
      unsubscribe(ws, message)
      return true
    default: {
      return false
    }
  }
}
