import {Errors} from "@/constants/errors"
import {DB} from "@/core/db"
import {ApiError} from "@/shared/errors/ApiError"

import type {SeatType} from "./types"

const seatTypeDb = new DB("seat_type")

export async function getAllSeatTypes(): Promise<SeatType[]> {
  const seatTypesResult = await seatTypeDb.findAll({
    include: {
      price: {
        include: {
          ticket_type: true,
        },
      },
    },
  })

  if (!seatTypesResult.success) {
    throw new ApiError(Errors.SeatTypesFetchFailed)
  }

  return seatTypesResult.data!.map((seatType) => ({
    id: seatType.id,
    name: seatType.name,
    ticketTypes: seatType.price.map((pricing) => ({
      id: pricing.ticket_type.id,
      name: pricing.ticket_type.name,
      price: pricing.price,
    })),
  }))
}
