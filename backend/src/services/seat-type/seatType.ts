import {seatTypeModel} from "@/model/seat-type/seatTypeModel"
import {Errors} from "@/constants/errors"
import {ApiError} from "@/shared/errors/ApiError"

import type {SeatType} from "@/model/seat-type/types"

export async function getSeatTypes(): Promise<SeatType[]> {
  try {
    return seatTypeModel.getAll()
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(Errors.InternalServerError)
  }
}
