import {Errors} from "@/constants/errors"
import {DB} from "@/core/db"
import {ApiError} from "@/shared/errors/ApiError"

import type {Hall, HallPlan} from "./types"

const db = new DB("hall")

export async function getHallPlan(id: number): Promise<HallPlan> {
  const result = await db.findOne<Hall>(
    {id},
    {
      include: {
        seats: {
          include: {
            seat_type: true,
          },
        },
      },
    },
  )

  if (!result.success) {
    throw new ApiError(Errors.HallNotFound)
  }

  const hall = result.data!
  return {
    id: hall.id,
    name: hall.name,
    canvas: {
      width: hall.width,
      height: hall.height,
    },
    rows: hall.rows,
    places: hall.places,
    seats: hall.seats.map((seat) => ({
      id: seat.id,
      seatType: seat.seat_type_id,
      row: seat.row,
      place: seat.place,
      x: seat.x,
      y: seat.y,
      width: seat.width,
      height: seat.height,
      rotation: seat.rotation,
      status: seat.status || "free",
    })),
  }
}

export async function getHallById(id: number): Promise<Hall> {
  const result = await db.findOne<Hall>(
    {id},
    {
      include: {
        seats: true,
      },
    },
  )

  if (!result.success) {
    throw new ApiError(Errors.HallNotFound)
  }

  const hall = result.data!
  return {
    id: hall.id,
    name: hall.name,
    seatsCount: hall.seats.length,
    cinemaId: hall.cinema_id,
  }
}
