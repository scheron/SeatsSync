import {createCinema, getAllCinemas, getCinemaById} from "@/modules/cinema/cinema.model"
import {Errors} from "@/constants/errors"
import {formatError, formatSuccess} from "@/shared/messages/formatters"
import {MessageRequest} from "@/shared/messages/types"

import type {WebSocket} from "ws"
import type {Cinema, CinemaMessageType} from "./cinema.types"

const methods: Partial<Record<CinemaMessageType, Function>> = {
  "cinema.get_all": async () => await getAllCinemas(),
  "cinema.get_one": async (data: {id: number}) => await getCinemaById(Number(data.id)),
  "cinema.create": async (data: {name: string; color: string}) => await createCinema(data),
}

export async function handleCinemaMessages(ws: IWebSocketClient, {data = null, eid, type}: MessageRequest<CinemaMessageType, Cinema>) {
  try {
    console.log(data, methods, type)
    if (!methods[type]) {
      ws.send(formatError({eid, type, error: Errors.UnknownMessageType}))
      return
    }

    try {
      const result = await methods[type](data)
      ws.send(formatSuccess({eid, type, data: result, status: "success"}))
    } catch (error) {
      ws.send(formatError({eid, type, error: error.message}))
    }
  } catch (error) {
    ws.send(formatError({eid: null, type: "unknown", error: Errors.InternalServerError}))
  }
}
