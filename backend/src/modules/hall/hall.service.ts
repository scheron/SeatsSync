import {Errors} from "@/constants/errors"
import {ApiError} from "@/shared/errors/ApiError"
import {hallModel} from "./hall.model"

export async function getHall(hallId: number) {
  try {
    return await hallModel.getOne(hallId)
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(Errors.InternalServerError)
  }
}
