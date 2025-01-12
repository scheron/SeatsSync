import {Errors} from "@/constants/errors"
import {DB} from "@/core/db/db"
import {ApiError} from "@/shared/errors/ApiError"
import {HallRepository, IHallRepository} from "../repository/hall.repository"

import type {Hall, HallPlan} from "../types"

class HallService {
  constructor(private repository: IHallRepository) {}

  async getHallsByCinema(cinemaId: number): Promise<Hall[]> {
    const result = await this.repository.findByCinemaId(cinemaId)
    if (!result.success) {
      throw new ApiError(500, Errors.HallFetchFailed)
    }
    return result.data!
  }

  async getHallPlan(hallId: number): Promise<HallPlan> {
    const result = await this.repository.findPlanById(hallId)
    if (!result.success) {
      throw new ApiError(404, Errors.HallNotFound)
    }
    return result.data!
  }
}

export const hallService = new HallService(new HallRepository(new DB()))
