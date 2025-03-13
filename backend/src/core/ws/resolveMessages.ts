import {formatError, MessageRequest} from "@/core/ws/messages"
import {Errors} from "@/shared/errors"

import type {IWebSocketClient, OnMessageHandler, WebSocketOnMessage} from "./types"

export function resolveMessages(handlers: OnMessageHandler[]): WebSocketOnMessage {
  return (ws: IWebSocketClient, message: MessageRequest<any, any>) => {
    let resolved = false

    for (const handler of handlers) {
      resolved = handler(ws, message)
      if (resolved) break
    }

    if (!resolved) ws.send(formatError({eid: message.eid, type: message.type, error: Errors.UnknownMessageType}))
  }
}
