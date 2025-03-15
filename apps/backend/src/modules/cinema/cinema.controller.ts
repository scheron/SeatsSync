import {Methods} from "@seats-sync/constants/methods"
import {Subscriptions} from "@seats-sync/constants/subscriptions"
import {getCinemas} from "./cinema.methods"
import {subscribe, unsubscribe} from "./cinema.subscription"

import type {IWebSocketClient} from "@/core/ws"
import type {MessageRequest} from "@seats-sync/types/websocket"

export function onMessage(ws: IWebSocketClient, message: MessageRequest<any>) {
  switch (message.type) {
    case Methods["cinemas.get_cinemas"]:
      getCinemas(ws, message)
      return true
    case Subscriptions["cinemas.subscribe"]:
      subscribe(ws, message as MessageRequest<{id: number}>)
      return true
    case Subscriptions["cinemas.unsubscribe"]:
      unsubscribe(ws, message)
      return true
    default: {
      return false
    }
  }
}
