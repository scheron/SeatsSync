import {logger} from "@/lib/logger"
import {DB} from "@/core/db"

import type {Cinema, CinemaDB} from "./cinema.types"

class CinemaModel {
  constructor(private db: DB) {}

  async getAll(): Promise<Cinema[]> {
    const result = await this.db.findAll<CinemaDB>({
      include: {
        halls: {
          select: {
            id: true,
            name: true,
            rows: true,
            places: true,
            seats: {
              select: {id: true, status: true},
            },
          },
        },
      },
    })

    if (!result.success) {
      logger.error({message: "Failed to fetch cinemas", error: result.error})
      return []
    }

    return result.data.map((cinema) => ({
      ...cinema,
      halls: cinema.halls.map(({seats, ...hall}) => ({
        ...hall,
        seats_count: seats.reduce((acc, seat) => ({...acc, [seat.status]: (acc[seat.status] || 0) + 1}), {
          VACANT: 0,
          OCCUPIED: 0,
        }),
      })),
    }))
  }
}

export const cinemaModel = new CinemaModel(new DB("Cinema"))
