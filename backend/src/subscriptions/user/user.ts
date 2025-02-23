import {UserStatus} from "model/user"
import {publisher} from "@/core/pubsub"
import {IWebSocketClient} from "@/core/ws"
import {Errors} from "@/constants/errors"
import {Subscription} from "@/constants/messageTypes"
import {formatError} from "@/shared/messages/formatters"
import {MessageRequest} from "@/shared/messages/types"

const subscription = publisher.register({
  name: "user.subscribe",

  async prepareSnapshot(ws: IWebSocketClient) {
    const isAuthenticated = ws.context.isAuthenticated()
    const username = ws.context.username()

    return serialize(isAuthenticated ? "user" : "guest", username)
  },
})

export function subscribe(ws: IWebSocketClient, message: MessageRequest<Subscription>) {
  return subscription.subscribe(ws, message)
}

export function unsubscribe(ws: IWebSocketClient, message: MessageRequest<Subscription, {sub_eid?: string}>) {
  if (!message) {
    subscription.unsubscribe(ws.context.id)
    return
  }

  if (!message?.data?.sub_eid) ws.send(formatError({eid: message?.eid, error: Errors.SubscriptionNotFound}))
  else subscription.unsubscribe(ws.context.id, message.data.sub_eid)
}

export function notifyUpdate({status, username}: {status: UserStatus; username?: string}) {
  subscription.notify("update", serialize(status, username))
}

function serialize(status: UserStatus, username: string) {
  return status === "user" ? {status, username} : {status}
}
