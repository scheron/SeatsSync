import {getCinemas} from "./getCinemas"
import {IWebSocketClient} from "@/core/ws"
import {Methods} from "@/constants/messageTypes"
import {MessageRequest} from "@/shared/messages/types"

import type {Method} from "@/constants/messageTypes"

export function onMessage(ws: IWebSocketClient, message: MessageRequest<Method>) {
  switch (message.type) {
    case Methods["cinema.get_cinemas"]:
      getCinemas(ws, message)
      return true
    default:
      return false
  }
}
