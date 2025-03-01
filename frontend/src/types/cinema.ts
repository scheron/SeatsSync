export type Cinema = {
  id: number
  name: string
  color: string
  created_at: Date
  halls: {
    id: number
    name: string
    rows: number
    places: number
    seats_count: number
  }[]
}

export type Hall = {
  id: number
  created_at: Date
  cinema_id: number
  name: string
  rows: number
  places: number
  seats: Seat[]
}

export type SeatStatus = "free" | "occupied"
export type SeatType = {
  name: string
  price: number
}

export type Seat = {
  id: number
  created_at: Date
  hall_id: number
  row: number
  place: number
  x: number
  y: number
  width: number
  height: number
  rotation: number
  status: SeatStatus
  seat_type: SeatType
}
