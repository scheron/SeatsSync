import {HallService} from "@/services/hall"
import {bookingModel} from "@/model/booking"
import {seatModel} from "@/model/seat"
import {Errors} from "@/constants/errors"
import {ApiError} from "@/shared/errors/ApiError"

export type PurchaseTicketsParams = {
  hall_id: number
  session_id: string
  seat_ids: number[]
}

export async function purchaseTickets({hall_id, session_id, seat_ids}: PurchaseTicketsParams) {
  try {
    const availableSeats = await seatModel.getAvailableSeats(hall_id, seat_ids)
    if (availableSeats.length !== seat_ids.length) throw new ApiError(Errors.SeatOccupied)

    const booking = await bookingModel.create({hall_id, session_id, status: "completed", seat_ids})
    if (!booking) throw new ApiError(Errors.InternalServerError)

    const updatedHall = await HallService.getHall(hall_id)

    return updatedHall
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(Errors.InternalServerError)
  }
}
