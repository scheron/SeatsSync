import {cinemaModel} from "@/models/cinema"
import {hallModel} from "@/models/hall"
import {Errors} from "@seats-sync/constants/errors"
import {ApiError} from "@/core/ws"

import type {Cinema, Hall, SeatStatus} from "@seats-sync/types/cinema"
import type {PartialDeep} from "type-fest"

type UpdateSeatStatusResponse = {
  hall: Hall
  updates: {
    hall: PartialDeep<Hall>
    cinema: PartialDeep<Cinema>
  }
}

export async function updateSeatStatus(data: {hall_id: number; seat_id: number; status: SeatStatus}): Promise<UpdateSeatStatusResponse> {
  const {hall_id, seat_id, status} = data

  const updatedHall = await hallModel.updateSeat(hall_id, seat_id, {status, updated_at: new Date()})
  if (!updatedHall) throw new ApiError(Errors.SeatUpdateFailed)

  const hall = await hallModel.getOne(hall_id)
  if (!hall) throw new ApiError(Errors.HallNotFound)

  const seatTypes = await hallModel.getSeatTypes(hall_id)
  if (!seatTypes) throw new ApiError(Errors.SeatTypeNotFound)

  const cinema = await cinemaModel.getOne(hall.cinema_id)
  if (!cinema) throw new ApiError(Errors.CinemaNotFound)

  const updatedSeat = hall.seats.find((seat) => seat.id === seat_id)
  const updatedSeatType = seatTypes.find((seatType) => seatType.id === updatedSeat?.seat_type.id)

  return {
    hall,

    updates: {
      hall: {
        id: hall.id,
        seats: [{id: updatedSeat.id, status: updatedSeat.status, updated_at: updatedSeat.updated_at}],
        seat_types: [{id: updatedSeatType.id, seats: updatedSeatType.seats}],
      },
      cinema: {
        id: hall.cinema_id,
        halls: [{id: hall.id, seats_count: cinema.halls.find(({id}) => id === hall.id)?.seats_count}],
      },
    },
  } as UpdateSeatStatusResponse
}
