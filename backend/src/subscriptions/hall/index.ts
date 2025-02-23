import {notifyUpdate, subscribe, unsubscribe} from "./hall"
import {IWebSocketClient} from "@/core/ws"
import {Errors} from "@/constants/errors"
import {Subscription, Subscriptions} from "@/constants/messageTypes"
import {formatError} from "@/shared/messages/formatters"
import {MessageRequest} from "@/shared/messages/types"

export {notifyUpdate, unsubscribe}

export function handleSubscriptions(ws: IWebSocketClient, message: MessageRequest<Subscription>) {
  switch (message.type) {
    case Subscriptions["hall.subscribe"]:
      return subscribe(ws, message as MessageRequest<Subscription, {hall_id: number}>)
    case Subscriptions["hall.unsubscribe"]:
      return unsubscribe(ws, message)
    default: {
      ws.send(formatError({eid: message.eid, error: Errors.UnknownMessageType}))
    }
  }
}
