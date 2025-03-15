import {formatSuccess} from "@/core/ws/messages"
import * as CinemaService from "./cinema.service"

import type {IWebSocketClient} from "@/core/ws"
import type {Method} from "@seats-sync/constants/methods"
import type {MessageRequest} from "@seats-sync/types/websocket"

export async function getCinemas(ws: IWebSocketClient, message: MessageRequest<Method>) {
  const cinemas = await CinemaService.getCinemas()
  ws.send(formatSuccess({eid: message.eid, type: message.type, status: "success", data: cinemas}))
}
