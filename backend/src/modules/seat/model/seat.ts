import {DB} from "@/core/db"
import {logger} from "@/shared/logger"

import type {SeatType} from "../types"

class SeatModel {
  constructor(private db: DB) {}

  async findAllTypes(): Promise<SeatType[]> {
    const result = await this.db.findAll<SeatType>({
      include: {
        ticketTypes: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
    })

    if (!result.success) {
      logger.error({message: "Failed to fetch seat types", error: result.error})
      return []
    }

    return result.data!
  }
}

export const seatModel = new SeatModel(new DB("seat_type"))
