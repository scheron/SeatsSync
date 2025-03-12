import {logger} from "@/lib/logger"
import {DB} from "@/core/db"
import {Hall} from "./hall.types"

class HallModel {
  constructor(private db: DB) {}

  async getOne(hallId: number) {
    const result = await this.db.findOne({
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
            seat_type: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    if (!result.success) {
      logger.error({message: "Failed to fetch hall", error: result.error})
      return null
    }

    return result.data as Hall
  }
}

export const hallModel = new HallModel(new DB("Hall"))
