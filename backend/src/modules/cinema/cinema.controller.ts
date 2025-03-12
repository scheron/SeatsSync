import {IWebSocketClient} from "@/core/ws"
import {Methods, Subscription, Subscriptions} from "@/constants/messageTypes"
import {MessageRequest} from "@/shared/messages/types"
import {getCinemas} from "./cinema.methods"
import {subscribe, unsubscribe} from "./cinema.subscription"

import type {CinemaMessage} from "./cinema.types"

export function onMessage(ws: IWebSocketClient, message: CinemaMessage) {
  switch (message.type) {
    case Methods["cinema.get_cinemas"]:
      getCinemas(ws, message)
      return true
    case Subscriptions["cinemas.subscribe"]:
      subscribe(ws, message as MessageRequest<Subscription, {id: number}>)
      return true
    case Subscriptions["cinemas.unsubscribe"]:
      unsubscribe(ws, message)
      return true
    default: {
      return false
    }
  }
}
