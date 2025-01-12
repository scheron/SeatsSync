import {Errors} from "@/constants/errors"
import {WebSocket} from "ws"
import {formatError, formatSuccess} from "./formatters"

import type {MessageHandlers, MessageRequest} from "./types"

export function createMessageHandler<T extends string>(handlers: MessageHandlers<T>) {
  return async function handleMessage(ws: IWebSocketClient, message: MessageRequest<T>) {
    const {data = null, eid, type, ts} = message

    try {
      const handler = handlers[type]
      if (!handler) {
        ws.send(formatError({eid, type, error: Errors.UnknownMessageType}))
        return
      }

      try {
        const result = await handler(data, {eid, ts})
        ws.send(formatSuccess({eid, type, data: result}))
      } catch (error) {
        ws.send(formatError({eid, type, error: error.message}))
      }
    } catch (error) {
      ws.send(formatError({eid: null, type: "unknown", error: Errors.InternalServerError}))
    }
  }
}
