import {hallModel} from "@/model/hall"
import {Errors} from "@/constants/errors"
import {ApiError} from "@/shared/errors/ApiError"

export async function getHall(hallId: number) {
  try {
    const hall = await hallModel.getOne(hallId)
    return hall
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(Errors.InternalServerError)
  }
}
