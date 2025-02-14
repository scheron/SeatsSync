export type SeatStatus = "free" | "reserved" | "occupied"

export type Seat = {
  id: number
  row: number
  place: number
  status: SeatStatus
  seat_type_id: number
}

export type SeatStatusResponse = {
  hallId: number
  seats: Seat[]
}

export type ReservationRequest = {
  hallId: number
  seatIds: number[]
  sessionId: string
}

export type ReservationResponse = {
  success: boolean
  message?: string
  reservationId?: string
}
