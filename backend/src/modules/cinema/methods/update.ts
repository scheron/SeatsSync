import {DB} from "@/core/db"
import {Errors} from "@/constants/errors"
import {ApiError} from "@/shared/errors/ApiError"
import {subscriptionManager} from "@/shared/subscriptions/manager"

import type {UpdateCinemaRequest, UpdateCinemaResponse} from "../types"

const cinemaDb = new DB("cinema")
const hallDb = new DB("hall")

export async function updateCinema(data: UpdateCinemaRequest): Promise<UpdateCinemaResponse> {
  const updateResult = await cinemaDb.update({
    where: {id: data.id},
    data: {
      name: data.name,
      color: data.color,
    },
  })

  if (!updateResult.success) {
    throw new ApiError(Errors.CinemaUpdateFailed)
  }

  const cinema = updateResult.data!

  // Get halls for updated cinema
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

  const updatedCinema = {
    id: cinema.id,
    name: cinema.name,
    color: cinema.color,
    halls: hallsResult.data!.map((hall) => ({
      id: hall.id,
      name: hall.name,
      seatsCount: hall._count.seats,
    })),
  }

  // Notify subscribers about cinema update
  subscriptionManager.publish(`cinema:${cinema.id}`, updatedCinema, "cinema.updated")

  return updatedCinema
}
