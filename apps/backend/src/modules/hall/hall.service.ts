import {Errors} from "@seats-sync/constants/errors"
import {ApiError} from "@/core/ws"
import {hallModel} from "./hall.model"

import type {SeatStatus} from "@seats-sync/types/cinema"

export async function getHall(hallId: number) {
  try {
    return await hallModel.getOne(hallId)
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(Errors.InternalServerError)
  }
}

export async function updateSeatStatus(hallId: number, seatId: number, status: SeatStatus) {
  try {
    const updatedHall = await hallModel.updateSeat(hallId, seatId, {status, updated_at: new Date()})
    if (!updatedHall) throw new ApiError(Errors.SeatUpdateFailed)

    const hall = await hallModel.getOne(hallId)
    if (!hall) throw new ApiError(Errors.NotFound)

    return hall
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(Errors.InternalServerError)
  }
}

export async function getSeatTypes(hallId: number) {
  try {
    return await hallModel.getSeatTypes(hallId)
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(Errors.InternalServerError)
  }
}
