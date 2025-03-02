import {Hall} from "@prisma/client"
import {PartialDeep} from "type-fest"
import {IWebSocketClient} from "@/core/ws"
import {notifyUpdate as notifyCinemaUpdate} from "@/subscriptions/cinema"
import {notifyUpdate as notifyHallUpdate} from "@/subscriptions/hall"
import * as BookingService from "@/services/booking"
import {Cinema} from "@/model/cinema"
import {Errors} from "@/constants/errors"
import {Methods} from "@/constants/messageTypes"
import {formatError, formatSuccess} from "@/shared/messages/formatters"
import {MessageRequest} from "@/shared/messages/types"
import {SeatStatus} from "@/shared/types"

export type PurchaseTicketsRequest = MessageRequest<(typeof Methods)["booking.purchase"], {hall_id: number; seat_ids: number[]}>

export async function purchaseTickets(ws: IWebSocketClient, message: PurchaseTicketsRequest) {
  try {
    const {hall_id, seat_ids} = message.data

    if (!hall_id) return ws.send(formatError({eid: message.eid, error: Errors.RequiredHallId}))

    if (!seat_ids || !Array.isArray(seat_ids) || !seat_ids.length) {
      return ws.send(formatError({eid: message.eid, error: Errors.InvalidSeatData}))
    }

    const result = await BookingService.purchaseTickets({
      hall_id,
      session_id: ws.context.id,
      seat_ids,
    })
    if (!result) return ws.send(formatError({eid: message.eid, error: Errors.InternalServerError}))

    const hallUpdate = {id: hall_id, seats: seat_ids.map((id) => ({id, status: "occupied"}))}

    notifyHallUpdate(hallUpdate as PartialDeep<Hall>)

    notifyCinemaUpdate({
      id: result.cinema_id,
      halls: [
        {
          id: hall_id,
          seats_count: result.seats.reduce(
            (acc, seat) => {
              acc[seat.status] = (acc[seat.status] || 0) + 1
              return acc
            },
            {free: 0, occupied: 0} as Record<SeatStatus, number>,
          ),
        },
      ],
    } as PartialDeep<Cinema>)

    ws.send(formatSuccess({eid: message.eid, data: result, status: "success"}))
  } catch (error) {
    if (error instanceof Error) ws.send(formatError({eid: message.eid, error: error.message as any}))
    else ws.send(formatError({eid: message.eid, error: Errors.InternalServerError}))
  }
}
