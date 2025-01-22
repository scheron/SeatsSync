import {notifyUserStatusChange, userMain} from "./main"
import {IWebSocketClient} from "@/core/ws"
import {Errors} from "@/constants/errors"
import {UserSubscriptions} from "@/constants/messageTypes"
import {formatError} from "@/shared/messages/formatters"
import {MessageRequest} from "@/shared/messages/types"

type UserSubscription = keyof typeof UserSubscriptions

export {notifyUserStatusChange}

export function handleUserMessages(ws: IWebSocketClient, message: MessageRequest<UserSubscription>) {
  switch (message.type) {
    case "user.subscribe":
      return userMain.onSubscribe(ws, message)
    default:
      ws.send(formatError({eid: message.eid, error: Errors.UnknownMessageType}))
  }
}
