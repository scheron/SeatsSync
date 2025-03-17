import {logger} from "@/lib/logger"
import {DB} from "@/core/db"
import {getCinemaHalls} from "./cinema.helpers"

import type {Cinema} from "@seats-sync/types/cinema"
import type {CinemaDB} from "./cinema.types"

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

    const cinemas = result.data.map((cinema) => ({
      ...cinema,
      halls: getCinemaHalls(cinema.halls),
    }))

    return cinemas as Cinema[]
  }

  async getOne(id: number): Promise<Cinema> {
    const result = await this.db.findOne<CinemaDB>({
      where: {id},
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

    const {halls, ...cinema} = result.data

    return {...cinema, halls: getCinemaHalls(halls)}
  }
}

export const cinemaModel = new CinemaModel(new DB("Cinema"))
