import jwt from "jsonwebtoken"
import {WebSocketContext} from "@/core/ws/types"
import {formatError, formatSuccess} from "@/shared/messages/formatters"
import {MessageRequest} from "@/shared/messages/types"
import {findUser} from "./auth.model"
import {AuthMessageType, User} from "./auth.types"

import type {WebSocket} from "ws"

const JWT_SECRET = process.env.JWT_SECRET as string

const handlers: Record<AuthMessageType, (data: any, context: WebSocketContext) => Promise<any>> = {
  "auth.status": async (_, context) => {
    try {
      console.log(context, context.isAuthenticated())
      if (!context?.isAuthenticated()) return {status: "guest", data: null}

      const token = context?.token
      const payload = jwt.verify(token, JWT_SECRET) as {username: string}
      const user = await findUser({username: payload.username})

      return {data: {username: user.username, id: user.id}, status: "user"}
    } catch {
      return {status: "guest", data: null}
    }
  },
}

export async function handleAuthMessages(ws: WebSocket, {data, eid, type}: MessageRequest<AuthMessageType, User>) {
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
