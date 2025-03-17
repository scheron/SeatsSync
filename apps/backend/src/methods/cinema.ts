import {cinemaModel} from "@/models/cinema"
import {Errors} from "@seats-sync/constants/errors"
import {ApiError} from "@/core/ws"

export async function getCinemas() {
  const cinemas = await cinemaModel.getAll()
  if (!cinemas) throw new ApiError(Errors.CinemaNotFound)
  return cinemas
}
