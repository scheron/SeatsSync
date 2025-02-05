import {DB} from "@/core/db"
import {logger} from "@/shared/logger"

import type {Cinema} from "./types"

class CinemaModel {
  constructor(private db: DB) {}

  async findAll(): Promise<Cinema[]> {
    const result = await this.db.findAll<Cinema>({
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
                row: true,
                place: true,
                seat_type_id: true,
                x: true,
                y: true,
                width: true,
                height: true,
                rotation: true,
                status: true,
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

    return result.data
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
              width: true,
              height: true,
              rows: true,
              places: true,
              seats: {
                select: {
                  id: true,
                  row: true,
                  place: true,
                  seat_type_id: true,
                  x: true,
                  y: true,
                  width: true,
                  height: true,
                  rotation: true,
                  status: true,
                },
              },
            },
          },
        },
      },
    )

    if (!result.success) {
      logger.error({message: "Failed to fetch cinema", error: result.error})
      return null
    }

    return result.data
  }
}

export const cinemaModel = new CinemaModel(new DB("cinema"))
