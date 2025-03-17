import {createSubscription} from "@/core/subscription"
import {logger} from "@/shared/lib/logger"

import type {IWebSocketClient} from "@/core/ws"
import type {UserStatus} from "@/models/user/types"

const _userSubscription = createSubscription("user.subscribe", async (ws: IWebSocketClient) => {
  try {
    const isAuthenticated = ws.context.isAuthenticated()
    const username = ws.context.username()

    return serialize(isAuthenticated ? "user" : "guest", username)
  } catch (error) {
    logger.error({message: "Failed to fetch user status", error})
    return serialize("guest", "")
  }
})

function notify(data: {status: UserStatus; username?: string}) {
  _userSubscription.notify(serialize(data.status, data.username))
}

export const userSubscription = {
  subscribe: _userSubscription.subscribe,
  unsubscribe: _userSubscription.unsubscribe,
  notify,
}

function serialize(status: UserStatus, username: string) {
  return status === "user" ? {status, username} : {status}
}
