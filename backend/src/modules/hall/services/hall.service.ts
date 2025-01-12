import {Errors} from "@/constants/errors"
import {ApiError} from "@/shared/errors/ApiError"
import {SeatRepository} from "../../seat/repository/seat.repository"
import {HallRepository} from "../repository/hall.repository"

import type {Hall, HallPlan} from "../types"

export class HallService {
  constructor(
    private hallRepository: HallRepository,
    private seatRepository: SeatRepository,
  ) {}

  async getHallPlan(id: number): Promise<HallPlan> {
    const hallResult = await this.hallRepository.findById(id)
    if (!hallResult.success) {
      throw new ApiError(Errors.HallNotFound)
    }

    const hall = hallResult.data!
    const seatsResult = await this.seatRepository.findByHallId(id)
    if (!seatsResult.success) {
      throw new ApiError(Errors.SeatsFetchFailed)
    }

    return {
      id: hall.id,
      name: hall.name,
      canvas: {
        width: hall.width,
        height: hall.height,
      },
      rows: hall.rows,
      places: hall.places,
      seats: seatsResult.data!.map((seat) => ({
        id: seat.id,
        seatType: seat.seatTypeId,
        row: seat.row,
        place: seat.place,
        x: seat.x,
        y: seat.y,
        width: seat.width,
        height: seat.height,
        rotation: seat.rotation,
        status: seat.status || "free",
      })),
    }
  }
}
