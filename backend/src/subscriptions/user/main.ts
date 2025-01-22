import {UserStatus} from "model/user"
import {publisher} from "@/core/pubsub"
import {IWebSocketClient} from "@/core/ws"

export const userMain = publisher.register({
  name: "user.subscribe",

  async onSnapshot(ws: IWebSocketClient) {
    const isAuthenticated = ws.context.isAuthenticated()

    return {
      status: isAuthenticated ? "user" : "guest",
    }
  },
})

export function notifyUserStatusChange(status: UserStatus) {
  publisher.notify("user.subscribe", "update", {status})
}
