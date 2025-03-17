import {formatSuccess} from "@/core/ws/messages"
import * as CinemaService from "@/modules/cinema/cinema.service"
import {notifyUpdate as notifyUpdateCinema} from "@/modules/cinema/cinema.subscription"
import * as HallService from "./hall.service"
import {notifyUpdate} from "./hall.subscription"

import type {Cinema, IWebSocketClient} from "@/core/ws"
import type {Hall, SeatStatus} from "@seats-sync/types/cinema"
import type {MessageRequest} from "@seats-sync/types/websocket"
import type {PartialDeep} from "type-fest"

export async function updateSeatStatus(ws: IWebSocketClient, message: MessageRequest<{hall_id: number; seat_id: number; status: SeatStatus}>) {
  const {hall_id, seat_id, status} = message.data
  const hall = await HallService.updateSeatStatus(hall_id, seat_id, status)
  const seatTypes = await HallService.getSeatTypes(hall_id)
  const cinema = await CinemaService.getCinema(hall.cinema_id)

  const updatedSeat = hall.seats.find((seat) => seat.id === seat_id)
  const updatedSeatType = seatTypes.find((seatType) => seatType.id === updatedSeat?.seat_type.id)

  ws.send(formatSuccess({eid: message.eid, type: message.type, status: "success", data: hall}))

  notifyUpdate({
    id: hall.id,
    seats: [{id: updatedSeat.id, status: updatedSeat.status, updated_at: updatedSeat.updated_at}],
    seat_types: [{id: updatedSeatType.id, seats: updatedSeatType.seats}],
  } as PartialDeep<Hall>)

  notifyUpdateCinema({
    id: hall.cinema_id,
    halls: [
      {
        id: hall.id,
        seats_count: cinema.halls.find(({id}) => id === hall.id)?.seats_count,
      },
    ],
  } as PartialDeep<Cinema>)
}
