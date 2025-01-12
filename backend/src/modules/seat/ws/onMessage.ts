import {Errors} from "@/constants/errors"
import {WebSocket} from "ws"
import {logger} from "@/shared/logger"
import {formatError, formatResponse} from "@/shared/messages/formatters"
import {getSeatTypes} from "../services/seat"

import type {Message} from "@/shared/types"

export async function handleGetSeatTypes(ws: WebSocket, message: Message) {
  try {
    const seatTypes = await getSeatTypes()
    ws.send(formatResponse({eid: message.eid, type: message.type, data: seatTypes}))
  } catch (error) {
    logger.error("Failed to get seat types", {error: error.message})
    ws.send(formatError({eid: message.eid, type: message.type, error: Errors.SeatTypesFetchFailed}))
  }
}
