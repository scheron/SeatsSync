import {Booking} from "./types"
import {DB} from "@/core/db"
import {logger} from "@/shared/logger"

class BookingModel {
  constructor(private db: DB) {}

  async create(data: {hall_id: number; session_id: string; status: string; seat_ids: number[]}) {
    const result = await this.db.transaction(async (tx) => {
      const booking = await tx.booking.create({
        data: {
          hall_id: data.hall_id,
          session_id: data.session_id,
          status: data.status,
          booking_seats: {
            create: data.seat_ids.map((seat_id) => ({
              seat_id,
            })),
          },
        },
        include: {
          booking_seats: true,
        },
      })

      await tx.seat.updateMany({
        where: {
          id: {in: data.seat_ids},
        },
        data: {
          status: "occupied",
        },
      })

      return booking
    })

    if (!result.success) {
      logger.error({message: "Failed to create booking", error: result.error})
      return null
    }

    return result.data as Booking
  }

  async getBookingsByHall(hallId: number) {
    const result = await this.db.findAll({
      where: {hall_id: hallId},
      include: {
        booking_seats: true,
      },
    })

    if (!result.success) {
      logger.error({message: "Failed to fetch bookings", error: result.error})
      return []
    }

    return result.data as Booking[]
  }

  async getBookingsBySession(sessionId: string) {
    const result = await this.db.findAll({
      where: {session_id: sessionId},
      include: {
        booking_seats: true,
      },
    })

    if (!result.success) {
      logger.error({message: "Failed to fetch bookings", error: result.error})
      return []
    }

    return result.data as Booking[]
  }
}

export const bookingModel = new BookingModel(new DB("Booking"))
