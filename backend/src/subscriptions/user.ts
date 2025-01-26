import {UserStatus} from "model/user"
import {publisher} from "@/core/pubsub"
import {IWebSocketClient} from "@/core/ws"
import {Errors} from "@/constants/errors"
import {UserSubscriptions} from "@/constants/messageTypes"
import {formatError} from "@/shared/messages/formatters"
import {MessageRequest} from "@/shared/messages/types"

type UserSubscription = keyof typeof UserSubscriptions

const userSubscription = publisher.register({
  name: "user.subscribe",

  async onSnapshot(ws: IWebSocketClient) {
    const isAuthenticated = ws.context.isAuthenticated()
    const username = ws.context.username()

    return serialize(isAuthenticated ? "user" : "guest", username)
  },
})

export function handleUserSubscriptions(ws: IWebSocketClient, message: MessageRequest<UserSubscription>) {
  switch (message.type) {
    case "user.subscribe":
      return userSubscription.onSubscribe(ws, message)
    case "user.unsubscribe":
      return userSubscription.unsubscribe(ws.context.id, message.eid)
    default: {
      ws.send(formatError({eid: message.eid, error: Errors.UnknownMessageType}))
    }
  }
}

export function notifyUserStatusChange(status: UserStatus, username: string) {
  userSubscription.notify("update", serialize(status, username))
}

export function unsubscribeUser(ws: IWebSocketClient, eid?: string) {
  userSubscription.unsubscribe(ws.context.id, eid)
}

function serialize(status: UserStatus, username: string) {
  return status === "user" ? {status, username} : {status}
}
