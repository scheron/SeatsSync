import {getSeatTypes} from "./getSeatTypes"
import {IWebSocketClient} from "@/core/ws"
import {Methods} from "@/constants/messageTypes"
import {MessageRequest} from "@/shared/messages/types"

import type {Method} from "@/constants/messageTypes"

export function onMessage(ws: IWebSocketClient, message: MessageRequest<Method>) {
  switch (message.type) {
    case Methods["seat-type.get_seat_types"]:
      getSeatTypes(ws, message)
      return true
    default:
      return false
  }
}
