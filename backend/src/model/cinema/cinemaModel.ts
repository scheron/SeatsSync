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
            width: true,
            height: true,
            rows: true,
            places: true,
            seats: {
              select: {
                id: true,
                // TODO: REMOVE AFTER CANVAS IS IMPLEMENTED
                row: true,
                place: true,
                status: true,
                x: true,
                y: true,
                width: true,
                height: true,
                rotation: true,
                seat_type_id: true,
              },
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
        seats_count: seats.length,
        // TODO: REMOVE AFTER CANVAS IS IMPLEMENTED
        seats,
      })),
    }))
  }
}

export const cinemaModel = new CinemaModel(new DB("cinema"))
