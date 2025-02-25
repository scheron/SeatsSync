import {notifyUpdate, subscribe, unsubscribe} from "./user"
import {IWebSocketClient} from "@/core/ws"
import {Subscription, Subscriptions} from "@/constants/messageTypes"
import {MessageRequest} from "@/shared/messages/types"

export {notifyUpdate, unsubscribe}

export function onMessage(ws: IWebSocketClient, message: MessageRequest<Subscription>) {
  switch (message.type) {
    case Subscriptions["user.subscribe"]:
      subscribe(ws, message)
      return true
    case Subscriptions["user.unsubscribe"]:
      unsubscribe(ws, message)
      return true
    default: {
      return false
    }
  }
}
