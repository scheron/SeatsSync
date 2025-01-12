import {DB} from "@/core/db"
import {Result} from "@/core/repository/base.repository"
import {Cinema} from "../types"

export class CinemaRepository {
  private db: DB
  private static TABLE = "cinema"

  constructor() {
    this.db = new DB(CinemaRepository.TABLE)
  }

  async findAll(): Promise<Result<Cinema[]>> {
    return this.db.findAll()
  }

  async findAllWithHalls(): Promise<Result<Cinema[]>> {
    const result = await this.db.findAll({
      include: {
        halls: {
          id: true,
          name: true,
          _count: {
            select: {seats: true},
          },
        },
      },
    })

    if (!result.success) return result

    return {
      success: true,
      data: result.data!.map((cinema) => ({
        ...cinema,
        halls: cinema.halls.map((hall) => ({
          ...hall,
          seatsCount: hall._count.seats,
        })),
      })),
    }
  }

  async findById(id: number): Promise<Result<Cinema>> {
    return this.db.findOne({id})
  }

  async findByIdWithHalls(id: number): Promise<Result<Cinema>> {
    const result = await this.db.findOne(
      {id},
      {
        include: {
          halls: {
            id: true,
            name: true,
            _count: {
              select: {seats: true},
            },
          },
        },
      },
    )

    if (!result.success) return result

    return {
      success: true,
      data: {
        ...result.data!,
        halls: result.data!.halls.map((hall) => ({
          ...hall,
          seatsCount: hall._count.seats,
        })),
      },
    }
  }

  async create(data: Partial<Cinema>): Promise<Result<Cinema>> {
    return this.db.create(data)
  }

  async update(id: number, data: Partial<Cinema>): Promise<Result<Cinema>> {
    return this.db.update(id, data)
  }

  async delete(id: number): Promise<Result<void>> {
    return this.db.delete(id)
  }
}
