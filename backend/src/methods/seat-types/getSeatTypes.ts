import {IWebSocketClient} from "@/core/ws"
import {SeatTypeService} from "@/services/seat-type"
import {Errors} from "@/constants/errors"
import {Method} from "@/constants/messageTypes"
import {ApiError} from "@/shared/errors/ApiError"
import {formatError, formatSuccess} from "@/shared/messages/formatters"
import {MessageRequest} from "@/shared/messages/types"

export async function getSeatTypes(ws: IWebSocketClient, message: MessageRequest<Method>) {
  try {
    const seatTypes = await SeatTypeService.getSeatTypes()
    ws.send(formatSuccess({eid: message.eid, type: message.type, status: "success", data: seatTypes}))
  } catch (error) {
    const errorMessage = error instanceof ApiError ? error.message : Errors.InternalServerError
    ws.send(formatError({eid: message.eid, type: message.type, error: errorMessage}))
  }
}
