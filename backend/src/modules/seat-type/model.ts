import {Errors} from "@/constants/errors"
import {DB} from "@/core/db"
import {ApiError} from "@/shared/errors/ApiError"

import type {SeatType} from "./types"

const db = new DB("seat_type")

export async function getAllSeatTypes(): Promise<SeatType[]> {
  const result = await db.findAll<SeatType>({
    include: {
      ticket_types: {
        include: {
          price: true,
        },
      },
    },
  })

  if (!result.success) {
    throw new ApiError(Errors.SeatTypesFetchFailed)
  }

  // Transform the data to match the expected format
  return result.data!.map((seatType) => ({
    id: seatType.id,
    name: seatType.name,
    ticketTypes: seatType.ticket_types.map((ticketType) => ({
      id: ticketType.id,
      name: ticketType.name,
      price: ticketType.price[0]?.price || 0,
    })),
  }))
}

export async function getSeatTypeById(id: number): Promise<SeatType> {
  const result = await db.findOne<SeatType>(
    {id},
    {
      include: {
        ticket_types: {
          include: {
            price: true,
          },
        },
      },
    },
  )

  if (!result.success) {
    throw new ApiError(Errors.SeatTypeNotFound)
  }

  const seatType = result.data!
  return {
    id: seatType.id,
    name: seatType.name,
    ticketTypes: seatType.ticket_types.map((ticketType) => ({
      id: ticketType.id,
      name: ticketType.name,
      price: ticketType.price[0]?.price || 0,
    })),
  }
}
