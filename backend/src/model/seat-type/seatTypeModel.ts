import {DB} from "@/core/db"

import type {SeatType} from "./types"

class SeatTypeModel {
  constructor(private db: DB) {}

  async getAll(): Promise<SeatType[]> {
    const result = await this.db.findAll<any>({
      select: {
        id: true,
        name: true,
        price: true,
      },
    })

    if (!result.success || !result.data) return []

    return result.data as SeatType[]
  }
}

export const seatTypeModel = new SeatTypeModel(new DB("SeatType"))
