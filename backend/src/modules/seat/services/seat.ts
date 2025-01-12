import {Errors} from "@/constants/errors"
import {DB} from "@/core/db"
import {ApiError} from "@/shared/errors/ApiError"
import {ISeatRepository, SeatRepository} from "../repository/seat.repository"

import type {SeatType} from "../types"

class SeatService {
  constructor(private repository: ISeatRepository) {}

  async getSeatTypes(): Promise<SeatType[]> {
    const result = await this.repository.findAllTypesWithTickets()
    if (!result.success) {
      throw new ApiError(Errors.SeatTypesFetchFailed)
    }
    return result.data!
  }
}

export const seatService = new SeatService(new SeatRepository(new DB("hall")))
