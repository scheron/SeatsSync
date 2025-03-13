import {ApiError, Errors} from "@/shared/errors"
import {hallModel} from "./hall.model"

export async function getHall(hallId: number) {
  try {
    return await hallModel.getOne(hallId)
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(Errors.InternalServerError)
  }
}
