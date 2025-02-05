import {getCinemas} from "./getCinemas"
import {IWebSocketClient} from "@/core/ws"
import {Errors} from "@/constants/errors"
import {Methods} from "@/constants/messageTypes"
import {formatError} from "@/shared/messages/formatters"
import {MessageRequest} from "@/shared/messages/types"

import type {Method} from "@/constants/messageTypes"

export function initCinemaMethods(ws: IWebSocketClient, message: MessageRequest<Method>) {
  switch (message.type) {
    case Methods["cinema.get_cinemas"]:
      return getCinemas(ws, message)
    default:
      ws.send(formatError({eid: message.eid, type: message.type, error: Errors.UnknownMessageType}))
  }
}
