import {IWebSocketClient} from "@/core/ws"
import {formatSuccess, MessageRequest} from "@/core/ws/messages"
import {Methods} from "@/constants/messageTypes"
import * as CinemaService from "./cinema.service"

export async function getCinemas(ws: IWebSocketClient, message: MessageRequest<keyof typeof Methods>) {
  const cinemas = await CinemaService.getCinemas()
  ws.send(formatSuccess({eid: message.eid, type: message.type, status: "success", data: cinemas}))
}
