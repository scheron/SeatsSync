import {DB} from "@/core/db"
import {logger} from "@/shared/logger"

import type {Cinema, CinemaDB} from "./types"

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
              select: {id: true},
            },
          },
        },
      },
    })

    console.log("cinemas", result)

    if (!result.success) {
      logger.error({message: "Failed to fetch cinemas", error: result.error})
      return []
    }

    return result.data.map((cinema) => ({
      ...cinema,
      halls: cinema.halls.map(({seats, ...hall}) => ({
        ...hall,
        seats_count: seats.length,
      })),
    }))
  }
}

export const cinemaModel = new CinemaModel(new DB("cinema"))
