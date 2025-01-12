import {DB} from "@/core/db"
import {logger} from "@/shared/logger"

import type {Hall, HallPlan} from "../types"

class HallModel {
  constructor(private db: DB) {}

  async findById(id: number): Promise<HallPlan | null> {
    const result = await this.db.findOne<HallPlan>(
      {id},
      {
        include: {
          seats: {
            include: {
              seatType: true,
            },
          },
        },
      },
    )

    if (!result.success) {
      logger.error({message: `Failed to fetch hall ${id}`, error: result.error})
      return null
    }

    const hall = result.data!
    return {
      id: hall.id,
      name: hall.name,
      canvas: {
        width: hall.canvasWidth,
        height: hall.canvasHeight,
      },
      rows: hall.rows,
      places: hall.places,
      seats: hall.seats.map((seat) => ({
        id: seat.id,
        seatType: seat.seatType.id,
        row: seat.row,
        place: seat.place,
        x: seat.x,
        y: seat.y,
        width: seat.width,
        height: seat.height,
        rotation: seat.rotation,
        status: seat.status,
      })),
    }
  }

  async findByCinema(cinemaId: number): Promise<Hall[]> {
    const result = await this.db.findAll<Hall>({
      where: {cinemaId},
      include: {
        seats: {
          select: {id: true},
        },
      },
    })

    if (!result.success) {
      logger.error({message: `Failed to fetch halls for cinema ${cinemaId}`, error: result.error})
      return []
    }

    return result.data!.map((hall) => ({
      ...hall,
      seatsCount: hall.seats.length,
    }))
  }
}

export const hallModel = new HallModel(new DB("hall"))
