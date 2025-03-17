import {Errors} from "@seats-sync/constants/errors"
import {ApiError} from "@/core/ws"
import {cinemaModel} from "./cinema.model"

import type {Cinema} from "@seats-sync/types/cinema"

export async function getCinemas(): Promise<Cinema[]> {
  try {
    return await cinemaModel.getAll()
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(Errors.InternalServerError)
  }
}

export async function getCinema(id: number): Promise<Cinema> {
  try {
    return await cinemaModel.getOne(id)
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(Errors.InternalServerError)
  }
}