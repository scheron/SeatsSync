import {Methods} from "@seats-sync/constants/methods"
import {Subscriptions} from "@seats-sync/constants/subscriptions"
import {authReset, authStart, checkStatus, login, logout, register, saveRecoveryPhrase} from "./user.methods"
import {subscribe, unsubscribe} from "./user.subscription"

import type {IWebSocketClient} from "@/core/ws"
import type {MessageRequest} from "@seats-sync/types/websocket"
import type {Router} from "express"

export function onMessage(ws: IWebSocketClient, message: MessageRequest<any>) {
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
  router.post(Methods["user.status"], checkStatus)
}
