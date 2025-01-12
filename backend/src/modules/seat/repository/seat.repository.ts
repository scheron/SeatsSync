import {IBaseRepository, Result} from "@/core/repository/base.repository"
import {SeatType} from "../types"

export interface ISeatRepository extends IBaseRepository<SeatType> {
  findAllTypesWithTickets(): Promise<Result<SeatType[]>>
}

export class SeatRepository implements ISeatRepository {
  constructor(private db: DB) {}

  async findAll(): Promise<Result<SeatType[]>> {
    return this.db.findAll("seat_type")
  }

  async findAllTypesWithTickets(): Promise<Result<SeatType[]>> {
    return this.db.findAll("seat_type", {
      ticketTypes: {
        select: {
          id: true,
          name: true,
          price: true,
        },
      },
    })
  }

  async findById(id: number): Promise<Result<SeatType>> {
    return this.db.findOne("seat_type", {id})
  }

  async create(data: Partial<SeatType>): Promise<Result<SeatType>> {
    return this.db.create("seat_type", data)
  }

  async update(id: number, data: Partial<SeatType>): Promise<Result<SeatType>> {
    return this.db.update("seat_type", id, data)
  }

  async delete(id: number): Promise<Result<void>> {
    return this.db.delete("seat_type", id)
  }
}
