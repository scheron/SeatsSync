import {Methods, Subscriptions} from "@/shared/constants/messageTypes"
import {authReset, authStart, login, logout, register, saveRecoveryPhrase} from "./user.methods"
import {subscribe, unsubscribe} from "./user.subscription"

import type {IWebSocketClient} from "@/core/ws"
import type {MessageRequest} from "@/core/ws/messages"
import type {Subscription} from "@/shared/constants/messageTypes"
import type {Router} from "express"

export function onMessage(ws: IWebSocketClient, message: MessageRequest<Subscription>) {
  switch (message.type) {
    case Subscriptions["user.subscribe"]:
      subscribe(ws, message)
      return true
    case Subscriptions["user.unsubscribe"]:
      unsubscribe(ws, message)
      return true
    default: {
      return false
    }
  }
}

export function initUserMethods(router: Router) {
  router.post(Methods["user.auth_start"], authStart)
  router.post(Methods["user.auth_reset"], authReset)
  router.post(Methods["user.login"], login)
  router.post(Methods["user.logout"], logout)
  router.post(Methods["user.register"], register)
  router.post(Methods["user.save_recovery_phrase"], saveRecoveryPhrase)
}
