import {getCinemas} from "../services/cinema"
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
