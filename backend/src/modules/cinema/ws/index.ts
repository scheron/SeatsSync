import {Errors} from "@/constants/errors"
import {WebSocket} from "ws"
import {formatError} from "@/shared/messages/formatters"
import {handleGetAllCinemas, handleGetHallPlan, handleGetSeatTypes} from "./handlers"

import type {Message} from "@/shared/types"

const handlers: Record<string, (ws: WebSocket, message: Message) => Promise<void>> = {
  "cinemas.get_all": handleGetAllCinemas,
  "halls.get_hall_plan": handleGetHallPlan,
  "seat_types.get_all": handleGetSeatTypes,
}

export async function handleCinemaMessages(ws: WebSocket, message: Message) {
  const handler = handlers[message.type]

  if (!handler) {
    ws.send(formatError({eid: message.eid, type: message.type, error: Errors.UnknownMessageType}))
    return
  }

  await handler(ws, message)
}
