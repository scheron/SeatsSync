import {logger} from "@/lib/logger"
import {DB} from "@/core/db"

import type {Hall, Seat, SeatType, SeatTypeStats} from "@/shared/types"
import type {HallDB} from "./hall.types"

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

    const seatTypes = this.getSeatTypes(result.data.seats)

    return {
      ...result.data,
      seats: result.data.seats as Seat[],
      seat_types: seatTypes,
    }
  }

  private getSeatTypes(seats: HallDB["seats"]): Array<SeatType & SeatTypeStats> {
    const seatTypeMap = seats.reduce((acc, seat) => {
      const {id, name} = seat.seat_type

      if (!acc.has(id)) {
        acc.set(id, {
          id,
          name,
          seats_count: 0,
          seats: {VACANT: 0, OCCUPIED: 0},
        })
      }

      const seatTypeStats = acc.get(id)!
      seatTypeStats.seats_count++
      seatTypeStats.seats[seat.status]++

      return acc
    }, new Map<number, SeatType & SeatTypeStats>())

    return Array.from(seatTypeMap.values())
  }
}

export const hallModel = new HallModel(new DB("Hall"))
