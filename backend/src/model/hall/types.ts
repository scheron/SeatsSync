export type SeatStatus = "free" | "reserved" | "occupied"

export type Seat = {
  id: number
  row: number
  place: number
  status: SeatStatus
  seat_type: {
    name: string
    price: number
  }
}

export type Hall = {
  id: number
  name: string
  cinema_id: number
  created_at: string
  rows: number
  places: number
  seats: Seat[]
}
