import {Errors} from "@/constants/errors"
import {WebSocket} from "ws"
import {logger} from "@/shared/logger"
import {formatError, formatResponse} from "@/shared/messages/formatters"
import {getSeatTypes} from "../services"

import type {Message} from "@/shared/types"

const handlers: Record<string, (ws: WebSocket, message: Message) => Promise<void>> = {
  "seat_types.get_all": async (ws, message) => {
    try {
      const seatTypes = await getSeatTypes()
      ws.send(formatResponse({eid: message.eid, type: message.type, data: seatTypes}))
    } catch (error) {
      logger.error("Failed to get seat types", {error: error.message})
      ws.send(formatError({eid: message.eid, type: message.type, error: Errors.SeatTypesFetchFailed}))
    }
  },
}

export async function handleSeatMessages(ws: WebSocket, message: Message) {
  const handler = handlers[message.type]

  if (!handler) {
    ws.send(formatError({eid: message.eid, type: message.type, error: Errors.UnknownMessageType}))
    return
  }

  await handler(ws, message)
}
