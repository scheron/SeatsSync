export type BookingStatus = "pending" | "completed" | "cancelled"

export type BookingSeat = {
  seat_id: number
  booking_id: number
}

export type Booking = {
  id: number
  hall_id: number
  session_id: string
  status: BookingStatus
  created_at: Date
  expires_at?: Date | null
  booking_seats: BookingSeat[]
}
