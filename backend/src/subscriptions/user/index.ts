import {notifyUpdate, subscribe, unsubscribe} from "./user"
import {IWebSocketClient} from "@/core/ws"
import {Errors} from "@/constants/errors"
import {Subscription, Subscriptions} from "@/constants/messageTypes"
import {formatError} from "@/shared/messages/formatters"
import {MessageRequest} from "@/shared/messages/types"

export {notifyUpdate, unsubscribe}

export function handleSubscription(ws: IWebSocketClient, message: MessageRequest<Subscription>) {
  switch (message.type) {
    case Subscriptions["user.subscribe"]:
      return subscribe(ws, message)
    case Subscriptions["user.unsubscribe"]:
      return unsubscribe(ws, message)
    default: {
      ws.send(formatError({eid: message.eid, error: Errors.UnknownMessageType}))
    }
  }
}
