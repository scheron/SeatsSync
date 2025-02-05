import {cinemaModel} from "@/model/cinema/cinemaModel"
import {Errors} from "@/constants/errors"
import {ApiError} from "@/shared/errors/ApiError"

export async function getCinemas() {
  try {
    const cinemas = await cinemaModel.findAll()

    return cinemas
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(Errors.InternalServerError)
  }
}
