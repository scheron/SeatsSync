import {Errors} from "@seats-sync/constants/errors"
import {formatError} from "@/core/ws/messages"

import type {MessageRequest} from "@seats-sync/types/websocket"
import type {IWebSocketClient, OnMessageHandler, WebSocketOnMessage} from "../types"

export function resolveMessages(handlers: OnMessageHandler[]): WebSocketOnMessage {
  return async (ws: IWebSocketClient, message: MessageRequest<any>) => {
    let resolved = false

    for (const handler of handlers) {
      resolved = await handler(ws, message)
      if (resolved) break
    }

    if (!resolved) ws.send(formatError({eid: message.eid, type: message.type, error: Errors.UnknownMessageType}))
  }
}
