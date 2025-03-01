import {Seat, SeatStatus} from "./types"
import {DB} from "@/core/db"
import {logger} from "@/shared/logger"

class SeatModel {
  constructor(private db: DB) {}

  async getAvailableSeats(hallId: number, seatIds: number[]) {
    const result = await this.db.findAll({
      where: {
        id: {in: seatIds},
        hall_id: hallId,
        status: "free",
      },
    })

    if (!result.success) {
      logger.error({message: "Failed to fetch available seats", error: result.error})
      return []
    }

    return result.data as Seat[]
  }

  async updateSeatStatus(seatIds: number[], status: SeatStatus) {
    const result = await this.db.updateMany({id: {in: seatIds}}, {status})

    if (!result.success) {
      logger.error({message: "Failed to update seat status", error: result.error})
      return false
    }

    return true
  }
}

export const seatModel = new SeatModel(new DB("Seat"))
