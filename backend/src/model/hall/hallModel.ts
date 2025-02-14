import {DB} from "@/core/db"
import {logger} from "@/shared/logger"

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
            seat_type_id: true,
          },
        },
      },
    })
    console.log(result)

    if (!result.success) {
      logger.error({message: "Failed to fetch hall", error: result.error})
      return null
    }

    return result.data
  }

  // async getAllByCinemaId(cinemaId: number): Promise<Hall[]> {
  //   const result = await this.db.findAll<Hall>({where: {cinema_id: cinemaId}})

  //   if (!result.success) {
  //     logger.error({message: "Failed to fetch cinemas", error: result.error})
  //     return []
  //   }

  //   return result.data
  // }

  // async getSeatsStatus(hallId: number): Promise<SeatStatusResponse> {
  //   const result = await this.db.findFirst({
  //     where: {id: hallId},
  //     select: {
  //       id: true,
  //       seats: {
  //         select: {
  //           id: true,
  //           row: true,
  //           place: true,
  //           status: true,
  //           seat_type_id: true
  //         }
  //       }
  //     }
  //   })

  //   if (!result.success) {
  //     logger.error({message: "Failed to fetch hall seats", error: result.error})
  //     throw new ApiError(Errors.InternalServerError)
  //   }

  //   if (!result.data) {
  //     throw new ApiError(Errors.NotFound)
  //   }

  //   return {
  //     hallId: result.data.id,
  //     seats: result.data.seats
  //   }
  // }

  // async reserveSeats(request: ReservationRequest): Promise<ReservationResponse> {
  //   const {hallId, seatIds, sessionId} = request

  //   // Проверяем, что все места свободны
  //   const seatsStatus = await this.getSeatsStatus(hallId)
  //   const unavailableSeats = seatsStatus.seats.filter(
  //     seat => seatIds.includes(seat.id) && seat.status !== 'free'
  //   )

  //   if (unavailableSeats.length > 0) {
  //     return {
  //       success: false,
  //       message: 'Some seats are already taken'
  //     }
  //   }

  //   // Резервируем места
  //   const result = await this.db.transaction(async (tx) => {
  //     // Обновляем статус мест
  //     await tx.updateMany({
  //       where: {
  //         id: {in: seatIds},
  //         hall_id: hallId,
  //         status: 'free'
  //       },
  //       data: {
  //         status: 'reserved'
  //       }
  //     })

  //     // Создаем запись о бронировании
  //     const booking = await tx.create({
  //       data: {
  //         hall_id: hallId,
  //         session_id: sessionId,
  //         status: 'pending',
  //         expires_at: new Date(Date.now() + 15 * 60 * 1000), // 15 минут на оплату
  //         booking_seats: {
  //           create: seatIds.map(seatId => ({
  //             seat_id: seatId
  //           }))
  //         }
  //       }
  //     })

  //     return booking
  //   })

  //   if (!result.success) {
  //     logger.error({message: "Failed to reserve seats", error: result.error})
  //     throw new ApiError(Errors.InternalServerError)
  //   }

  //   return {
  //     success: true,
  //     reservationId: result.data.id.toString()
  //   }
  // }
}

export const hallModel = new HallModel(new DB("hall"))
