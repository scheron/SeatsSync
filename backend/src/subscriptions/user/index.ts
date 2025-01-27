import {notifyUserUpdate, subscribeUser, unsubscribeUser} from "./user"
import {IWebSocketClient} from "@/core/ws"
import {Errors} from "@/constants/errors"
import {UserSubscriptions} from "@/constants/messageTypes"
import {formatError} from "@/shared/messages/formatters"
import {MessageRequest} from "@/shared/messages/types"

type UserSubscription = keyof typeof UserSubscriptions

export {notifyUserUpdate, unsubscribeUser}

export function handleUserSubscriptions(ws: IWebSocketClient, message: MessageRequest<UserSubscription>) {
  switch (message.type) {
    case "user.subscribe":
      return subscribeUser(ws, message)
    case "user.unsubscribe":
      return unsubscribeUser(ws, message.eid)
    default: {
      ws.send(formatError({eid: message.eid, error: Errors.UnknownMessageType}))
    }
  }
}
