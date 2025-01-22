import {DB} from "@/core/db"
import {Errors} from "@/constants/errors"
import {ApiError} from "@/shared/errors/ApiError"

import type {MessageHandler} from "@/shared/messages/types"
import type {GetAllCinemasResponse} from "./types"

const cinemaDb = new DB("cinema")
const hallDb = new DB("hall")

export const getAllCinemas: MessageHandler<null, GetAllCinemasResponse> = async () => {
  const cinemasResult = await cinemaDb.findAll()
  if (!cinemasResult.success) {
    throw new ApiError(Errors.CinemaFetchFailed)
  }

  const cinemas = cinemasResult.data!

  // Get halls for each cinema
  const cinemasWithHalls = await Promise.all(
    cinemas.map(async (cinema) => {
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
    }),
  )

  return cinemasWithHalls
}
