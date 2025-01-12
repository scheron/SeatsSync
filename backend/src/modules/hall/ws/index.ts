import {Errors} from "@/constants/errors"
import {WebSocket} from "ws"
import {logger} from "@/shared/logger"
import {formatError, formatResponse} from "@/shared/messages/formatters"
import {getHallPlan} from "../services"

import type {Message} from "@/shared/types"

const handlers: Record<string, (ws: WebSocket, message: Message) => Promise<void>> = {
  "halls.get_hall_plan": async (ws, message) => {
    try {
      const hallId = message.data?.hallId
      if (!hallId) {
        ws.send(formatError({eid: message.eid, type: message.type, error: Errors.RequiredHallId}))
        return
      }

      const hallPlan = await getHallPlan(hallId)
      ws.send(formatResponse({eid: message.eid, type: message.type, data: hallPlan}))
    } catch (error) {
      logger.error("Failed to get hall plan", {error: error.message})
      ws.send(formatError({eid: message.eid, type: message.type, error: Errors.HallNotFound}))
    }
  },
}

export async function handleHallMessages(ws: WebSocket, message: Message) {
  const handler = handlers[message.type]

  if (!handler) {
    ws.send(formatError({eid: message.eid, type: message.type, error: Errors.UnknownMessageType}))
    return
  }

  await handler(ws, message)
}
