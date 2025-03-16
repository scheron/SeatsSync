import {formatSuccess} from "@/core/ws/messages"
import * as HallService from "./hall.service"
import {notifyUpdate} from "./hall.subscription"

import type {IWebSocketClient} from "@/core/ws"
import type {Hall, SeatStatus} from "@seats-sync/types/cinema"
import type {MessageRequest} from "@seats-sync/types/websocket"
import type {PartialDeep} from "type-fest"

export async function updateSeatStatus(ws: IWebSocketClient, message: MessageRequest<{hall_id: number; seat_id: number; status: SeatStatus}>) {
  const {hall_id, seat_id, status} = message.data
  const hall = await HallService.updateSeatStatus(hall_id, seat_id, status)
  const seatTypes = await HallService.getSeatTypes(hall_id)

  const updatedSeat = hall.seats.find((seat) => seat.id === seat_id)
  const updatedSeatType = seatTypes.find((seatType) => seatType.id === updatedSeat?.seat_type.id)

  ws.send(formatSuccess({eid: message.eid, type: message.type, status: "success", data: hall}))

  notifyUpdate({
    id: hall.id,
    seats: [{id: updatedSeat.id, status: updatedSeat.status, updated_at: updatedSeat.updated_at}],
    seat_types: [{id: updatedSeatType.id, seats: updatedSeatType.seats}],
  } as PartialDeep<Hall>)
}
