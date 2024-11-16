import {createCinema, getAllCinemas, getCinemaById} from "@models/cinemas.model"
import WebSocket from "ws"

import type {Cinema} from "@/types/entities"
import {prepareErrorMsg, prepareRequestMsg, prepareSuccessMsg} from "@/utils/socket"
import type {RawData} from "ws"

type MessageType = "cinemas.get_all" | "cinemas.get_one" | "cinemas.create"

const methods: Partial<Record<MessageType, Function>> = {
  "cinemas.get_all": async () => await getAllCinemas(),
  "cinemas.get_one": async (data: {id: number}) => await getCinemaById(Number(data.id)),
  "cinemas.create": async (data: {name: string; color: string}) => await createCinema(data),
}

export const onMessage = async (ws: WebSocket, message: RawData) => {
  try {
    const request = prepareRequestMsg<MessageType, Cinema | null>(message)
    if (!request) return

    const {data = null, id, type} = request

    if (!methods[type]) {
      ws.send(prepareErrorMsg({id, type, code: 404, error: "Unknown message type"}))
      return
    }

    try {
      const result = await methods[type](data)
      ws.send(prepareSuccessMsg({id, type, data: result, status: "performed"}))
    } catch (error) {
      ws.send(prepareErrorMsg({id, type, error: error.message, code: 555}))
    }
  } catch (error) {
    // ws.send(prepareErrorMsg(internalError)
  }
}
