import {DB} from "@/core/db"
import {logger} from "@/shared/logger"

import type {Cinema} from "../types"

class CinemaModel {
  constructor(private db: DB) {}

  async findAll(): Promise<Cinema[]> {
    const result = await this.db.findAll<Cinema>({
      include: {
        halls: {
          select: {
            id: true,
            name: true,
            seats: {
              select: {
                id: true,
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

    return result.data!.map((cinema) => ({
      ...cinema,
      halls: cinema.halls.map((hall) => ({
        ...hall,
        seatsCount: hall.seats.length,
      })),
    }))
  }

  async findById(id: number): Promise<Cinema | null> {
    const result = await this.db.findOne<Cinema>(
      {id},
      {
        include: {
          halls: {
            select: {
              id: true,
              name: true,
              seats: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      },
    )

    if (!result.success) {
      logger.error({message: `Failed to fetch cinema ${id}`, error: result.error})
      return null
    }

    const cinema = result.data!
    return {
      ...cinema,
      halls: cinema.halls.map((hall) => ({
        ...hall,
        seatsCount: hall.seats.length,
      })),
    }
  }
}

export const cinemaModel = new CinemaModel(new DB("cinema"))
