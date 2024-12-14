import WebSocket from "ws"
import {createCinema, getAllCinemas, getCinemaById} from "@/modules/cinema/cinema.model"
import {logger} from "@/shared/logger"
import {formatError, formatRequest, formatSuccess} from "@/shared/messages/formatters"

import type {RawData} from "ws"
import type {Cinema, MessageType} from "./cinema.types"

const methods: Partial<Record<MessageType, Function>> = {
  "cinema.get_all": async () => await getAllCinemas(),
  "cinema.get_one": async (data: {id: number}) => await getCinemaById(Number(data.id)),
  "cinema.create": async (data: {name: string; color: string}) => await createCinema(data),
}

export async function handleCinemaSocketMessage(ws: WebSocket, message: RawData) {
  try {
    const request = formatRequest<MessageType, Cinema | null>(message)

    if (!request) {
      logger.warn("Invalid message format received", {message})
      return
    }

    const {data = null, eid, type} = request

    logger.info(`Received message: ${type}`, {eid, type, data})

    if (!methods[type]) {
      ws.send(formatError({eid, type, code: 404, error: "Unknown message type"}))
      logger.warn(`Unknown message type: ${type}`, {eid, type, data})
      return
    }

    try {
      const result = await methods[type](data)
      ws.send(formatSuccess({eid, type, data: result, status: "success"}))

      logger.info(`Successfully processed message: ${type}`, {eid, type, data: result})
    } catch (error) {
      ws.send(formatError({eid, type, error: error.message, code: 555}))

      logger.error(`Error processing message: ${type}`, {eid, type, error: error.message, stack: error.stack})
    }
  } catch (error) {
    ws.send(formatError({eid: null, type: "unknown", error: "Internal Server Error", code: 500}))

    logger.error("Unhandled socket error", {error: error.message, stack: error.stack})
  }
}
