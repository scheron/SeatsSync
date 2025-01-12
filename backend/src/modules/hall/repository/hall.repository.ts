import {DB} from "@/core/db/db"
import {IBaseRepository, Result} from "@/core/repository/base.repository"
import {BaseRepository} from "@/core/repository/base.repository.impl"
import {Hall, HallPlan} from "../types"

export interface IHallRepository extends IBaseRepository<Hall> {
  findByCinemaId(cinemaId: number): Promise<Result<Hall[]>>
  findPlanById(id: number): Promise<Result<HallPlan>>
}

export class HallRepository extends BaseRepository<Hall> implements IHallRepository {
  constructor(db: DB) {
    super(db, "hall")
  }

  async findAll(): Promise<Result<Hall[]>> {
    return super.findAll()
  }

  async findByCinemaId(cinemaId: number): Promise<Result<Hall[]>> {
    const result = await super.findAllWithInclude({
      where: {cinemaId},
      _count: {
        select: {seats: true},
      },
    })

    if (!result.success) return result

    return {
      success: true,
      data: result.data!.map((hall) => ({
        ...hall,
        seatsCount: hall._count.seats,
      })),
    }
  }

  async findById(id: number): Promise<Result<Hall>> {
    return super.findOne(id)
  }

  async findPlanById(id: number): Promise<Result<HallPlan>> {
    const result = await super.findOneWithInclude(id, {
      seats: {
        include: {
          seatType: {
            select: {id: true},
          },
        },
      },
    })

    if (!result.success) return result

    const {seats, ...hall} = result.data!
    return {
      success: true,
      data: {
        ...hall,
        seats: seats.map((seat) => ({
          ...seat,
          typeId: seat.seatType.id,
        })),
      },
    }
  }

  async create(data: Partial<Hall>): Promise<Result<Hall>> {
    return super.create(data)
  }

  async update(id: number, data: Partial<Hall>): Promise<Result<Hall>> {
    return super.update(id, data)
  }

  async delete(id: number): Promise<Result<void>> {
    return super.delete(id)
  }
}
