import {WebSocket} from "ws"
import {formatError, formatSuccess} from "@/shared/messages/formatters"
import {MessageRequest} from "@/shared/messages/types"
import {AuthMessageType, User} from "../types"
import {handlers} from "./handlers"

export async function onMessage(ws: WebSocket, {data, eid, type}: MessageRequest<AuthMessageType, User>) {
  const handler = handlers[type]

  if (!handler) {
    ws.send(formatError({eid, type, code: 404, error: "Unknown message type"}))
    return
  }

  try {
    const result = await handler(data, ws.context)
    ws.send(formatSuccess({eid, type, data: result, status: "success"}))
  } catch (error) {
    ws.send(formatError({eid, type, error: error.message, code: 555}))
  }
}
