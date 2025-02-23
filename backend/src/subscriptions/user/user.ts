import {UserStatus} from "model/user"
import {publisher} from "@/core/pubsub"
import {IWebSocketClient} from "@/core/ws"
import {Subscription} from "@/constants/messageTypes"
import {MessageRequest} from "@/shared/messages/types"

const userSubscription = publisher.register({
  name: "user.subscribe",

  async prepareSnapshot(ws: IWebSocketClient) {
    const isAuthenticated = ws.context.isAuthenticated()
    const username = ws.context.username()

    return serialize(isAuthenticated ? "user" : "guest", username)
  },
})

export function subscribe(ws: IWebSocketClient, message: MessageRequest<Subscription>) {
  return userSubscription.subscribe(ws, message)
}

export function unsubscribe(ws: IWebSocketClient, eid?: string) {
  userSubscription.unsubscribe(ws.context.id, eid)
}

export function notifyUpdate({status, username}: {status: UserStatus; username?: string}) {
  userSubscription.notify("update", serialize(status, username))
}

function serialize(status: UserStatus, username: string) {
  return status === "user" ? {status, username} : {status}
}
