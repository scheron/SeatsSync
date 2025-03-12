import {Errors} from "@/constants/errors"
import {ApiError} from "@/utils/errors/ApiError"
import {cinemaModel} from "./cinema.model"

import type {Cinema} from "./cinema.types"

export async function getCinemas(): Promise<Cinema[]> {
  try {
    return await cinemaModel.getAll()
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(Errors.InternalServerError)
  }
}
