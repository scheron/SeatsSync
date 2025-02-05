import {notifyUserUpdate, subscribeUser, unsubscribeUser} from "./user"
import {IWebSocketClient} from "@/core/ws"
import {Errors} from "@/constants/errors"
import {Subscription, Subscriptions} from "@/constants/messageTypes"
import {formatError} from "@/shared/messages/formatters"
import {MessageRequest} from "@/shared/messages/types"

export {notifyUserUpdate, unsubscribeUser}

export function handleUserSubscriptions(ws: IWebSocketClient, message: MessageRequest<Subscription>) {
  switch (message.type) {
    case Subscriptions["user.subscribe"]:
      return subscribeUser(ws, message)
    case Subscriptions["user.unsubscribe"]:
      return unsubscribeUser(ws, message.eid)
    default: {
      ws.send(formatError({eid: message.eid, error: Errors.UnknownMessageType}))
    }
  }
}
