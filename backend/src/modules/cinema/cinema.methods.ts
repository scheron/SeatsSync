import {IWebSocketClient} from "@/core/ws"
import {Method} from "@/constants/messageTypes"
import {formatSuccess} from "@/shared/messages/formatters"
import {MessageRequest} from "@/shared/messages/types"
import * as CinemaService from "./cinema.service"

export async function getCinemas(ws: IWebSocketClient, message: MessageRequest<Method>) {
  const cinemas = await CinemaService.getCinemas()
  ws.send(formatSuccess({eid: message.eid, type: message.type, status: "success", data: cinemas}))
}
