import {getCinemas} from "../services/cinema"
import {getHallPlan} from "../services/hall"
import {getSeatTypes} from "../services/seat"
import {WebSocket} from "ws"
import {Errors} from "@/constants/errors"
import {logger} from "@/shared/logger"
import {formatError, formatResponse} from "@/shared/messages/formatters"

import type {Message} from "@/shared/types"

export async function handleGetAllCinemas(ws: IWebSocketClient, message: Message) {
  try {
    const cinemas = await getCinemas()
    ws.send(formatResponse({eid: message.eid, type: message.type, data: cinemas}))
  } catch (error) {
    logger.error("Failed to get cinemas", {error: error.message})
    ws.send(formatError({eid: message.eid, type: message.type, error: Errors.CinemaFetchFailed}))
  }
}

export async function handleGetHallPlan(ws: IWebSocketClient, message: Message) {
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

export async function handleGetSeatTypes(ws: IWebSocketClient, message: Message) {
  try {
    const seatTypes = await getSeatTypes()
    ws.send(formatResponse({eid: message.eid, type: message.type, data: seatTypes}))
  } catch (error) {
    logger.error("Failed to get seat types", {error: error.message})
    ws.send(formatError({eid: message.eid, type: message.type, error: Errors.SeatTypesFetchFailed}))
  }
}
