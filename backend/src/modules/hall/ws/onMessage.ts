import {Errors} from "@/constants/errors"
import {WebSocket} from "ws"
import {logger} from "@/shared/logger"
import {formatError, formatResponse} from "@/shared/messages/formatters"
import {getHallPlan} from "../services/hall"

import type {Message} from "@/shared/types"

export async function handleGetHallPlan(ws: WebSocket, message: Message) {
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
}
