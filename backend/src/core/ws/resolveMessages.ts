import {IWebSocketClient, OnMessageHandler, WebSocketOnMessage} from "./types"
import {Errors} from "@/constants/errors"
import {formatError} from "@/shared/messages/formatters"
import {MessageRequest} from "@/shared/messages/types"

export function resolveMessage(handlers: OnMessageHandler[]): WebSocketOnMessage {
  return (ws: IWebSocketClient, message: MessageRequest<any, any>) => {
    let resolved = false

    for (const handler of handlers) {
      resolved = handler(ws, message)
      if (resolved) break
    }

    if (!resolved) ws.send(formatError({eid: message.eid, type: message.type, error: Errors.UnknownMessageType}))
  }
}
