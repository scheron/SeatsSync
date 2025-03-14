import {Methods, Subscriptions} from "@/shared/constants/messageTypes"
import {getCinemas} from "./cinema.methods"
import {subscribe, unsubscribe} from "./cinema.subscription"

import type {IWebSocketClient} from "@/core/ws"
import type {MessageRequest} from "@/core/ws/messages"
import type {Subscription} from "@/shared/constants/messageTypes"
import type {CinemaMessage} from "./cinema.types"

export function onMessage(ws: IWebSocketClient, message: CinemaMessage) {
  switch (message.type) {
    case Methods["cinemas.get_cinemas"]:
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
