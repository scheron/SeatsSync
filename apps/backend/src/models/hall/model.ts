import {DB} from "@/core/db"
import {logger} from "@/shared/lib/logger"
import {getSeatTypes} from "./helpers"

import type {Hall, Seat} from "@seats-sync/types/cinema"
import type {HallDB, SeatTypeDB} from "./types"

class HallModel {
  constructor(private db: DB) {}

  async getOne(hallId: number): Promise<Hall | null> {
    const result = await this.db.findOne<HallDB>({
      where: {id: hallId},
      include: {
        seats: {
          select: {
            id: true,
            row: true,
            place: true,
            status: true,
            x: true,
            y: true,
            width: true,
            height: true,
            rotation: true,
            seat_type: true,
            updated_at: true,
          },
        },
      },
    })

    if (!result.success) {
      logger.error({message: "Failed to fetch hall", error: result.error})
      return null
    }

    return {
      ...result.data,
      seats: result.data.seats as Seat[],
      seat_types: getSeatTypes(result.data.seats),
    }
  }

  async updateSeat(hallId: number, seatId: number, data: Partial<Seat>) {
    const result = await this.db.update(hallId, {
      seats: {update: [{where: {id: seatId}, data}]},
    })

    if (!result.success) {
      logger.error({message: "Failed to update seat", error: result.error})
      return null
    }

    return result.data
  }

  async getSeatTypes(hallId: number): Promise<SeatTypeDB[]> {
    const result = await this.db.findOne<HallDB>({
      where: {id: hallId},
      include: {seats: {select: {id: true, status: true, seat_type: true}}},
    })

    if (!result.success) {
      logger.error({message: "Failed to fetch seat types", error: result.error})
      return []
    }

    return getSeatTypes(result.data.seats)
  }
}

export const hallModel = new HallModel(new DB("Hall"))
