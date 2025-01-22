import {DB} from "@/core/db"
import {Errors} from "@/constants/errors"
import {ApiError} from "@/shared/errors/ApiError"
import {subscriptionManager} from "@/shared/subscriptions/manager"

import type {CreateCinemaRequest, CreateCinemaResponse} from "../types"

const cinemaDb = new DB("cinema")

export async function createCinema(data: CreateCinemaRequest): Promise<CreateCinemaResponse> {
  const result = await cinemaDb.create({
    data: {
      name: data.name,
      color: data.color,
    },
  })

  if (!result.success) {
    throw new ApiError(Errors.CinemaCreateFailed)
  }

  const cinema = {
    id: result.data!.id,
    name: result.data!.name,
    color: result.data!.color,
    halls: [],
  }

  // Notify subscribers about new cinema
  subscriptionManager.publish(`cinema:${cinema.id}`, cinema, "cinema.created")

  return cinema
}
