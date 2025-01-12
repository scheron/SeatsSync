import {Errors} from "@/constants/errors"
import {DB} from "@/core/db"
import {ApiError} from "@/shared/errors/ApiError"

import type {HallPlan} from "./types"

const hallDb = new DB("hall")

export async function getHallPlan(id: number): Promise<HallPlan> {
  const hallResult = await hallDb.findOne(
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

  if (!hallResult.success) {
    throw new ApiError(Errors.HallNotFound)
  }

  const hall = hallResult.data!
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
