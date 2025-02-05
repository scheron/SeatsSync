export type Cinema = {
  id: number
  name: string
  color: string
  createdAt: Date
  halls?: Hall[]
}

export type Hall = {
  id: number
  cinemaId: number
  name: string
  width: number
  height: number
  rows: number
  places: number
  createdAt: Date
  seats?: Seat[]
  bookings?: Booking[]
}

export type Seat = {
  id: number
  hallId: number
  seatTypeId: number
  row: number
  place: number
  x: number
  y: number
  width: number
  height: number
  rotation: number
  status?: string
  seatType?: SeatType
  booking?: BookingSeat[]
}

export type SeatType = {
  id: number
  name: string
  price?: Pricing[]
  ticketTypes?: TicketType[]
}

export type TicketType = {
  id: number
  name: string
  seatTypeId: number
  price?: Pricing[]
}

export type Pricing = {
  id: number
  seatTypeId: number
  ticketTypeId: number
  price: number
}

export type BookingSeat = {
  seatId: number
  bookingId: number
}

export type Booking = {
  id: number
  hallId: number
  sessionId: string
  status?: string
  createdAt: Date
  expiresAt?: Date
  bookingSeats?: BookingSeat[]
}
