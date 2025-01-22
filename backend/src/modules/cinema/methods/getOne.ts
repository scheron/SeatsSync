import {DB} from "@/core/db"
import {Errors} from "@/constants/errors"
import {ApiError} from "@/shared/errors/ApiError"

import type {GetOneCinemaRequest, GetOneCinemaResponse} from "../types"

const cinemaDb = new DB("cinema")
const hallDb = new DB("hall")

export async function getOneCinema(data: GetOneCinemaRequest): Promise<GetOneCinemaResponse> {
  const cinemaResult = await cinemaDb.findOne({id: data.id})
  if (!cinemaResult.success) {
    throw new ApiError(Errors.CinemaNotFound)
  }

  const cinema = cinemaResult.data!
  const hallsResult = await hallDb.findAll({
    where: {cinema_id: cinema.id},
    include: {
      _count: {
        select: {seats: true},
      },
    },
  })

  if (!hallsResult.success) {
    throw new ApiError(Errors.HallFetchFailed)
  }

  return {
    id: cinema.id,
    name: cinema.name,
    color: cinema.color,
    halls: hallsResult.data!.map((hall) => ({
      id: hall.id,
      name: hall.name,
      seatsCount: hall._count.seats,
    })),
  }
}
