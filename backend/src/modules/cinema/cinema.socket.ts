import WebSocket from "ws"
import {createCinema, getAllCinemas, getCinemaById} from "@/modules/cinema/cinema.model"
import {formatRequestMsg, formatResponseErrorMsg, formatResponseSuccessMsg} from "@/shared/messages/formatters"

import type {RawData} from "ws"
import type {Cinema} from "./cinema.types"

type MessageType = "cinema.get_all" | "cinema.get_one" | "cinema.create"

const methods: Partial<Record<MessageType, Function>> = {
  "cinema.get_all": async () => await getAllCinemas(),
  "cinema.get_one": async (data: {id: number}) => await getCinemaById(Number(data.id)),
  "cinema.create": async (data: {name: string; color: string}) => await createCinema(data),
}

export const onMessage = async (ws: WebSocket, message: RawData) => {
  try {
    const request = formatRequestMsg<MessageType, Cinema | null>(message)
    if (!request) return

    const {data = null, eid, type} = request

    if (!methods[type]) {
      ws.send(formatResponseErrorMsg({eid, type, code: 404, error: "Unknown message type"}))
      return
    }

    try {
      const result = await methods[type](data)
      ws.send(formatResponseSuccessMsg({eid, type, data: result, status: "success"}))
    } catch (error) {
      console.log("Error", error.message)
      ws.send(formatResponseErrorMsg({eid, type, error: error.message, code: 555}))
    }
  } catch (error) {
    console.error("Unhandled error:", error)
    ws.send(formatResponseErrorMsg({eid: null, type: "unknown", error: "Internal Server Error", code: 500}))
  }
}
