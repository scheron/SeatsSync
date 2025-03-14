export type SeatStatus = "VACANT" | "OCCUPIED"

export type SeatType = {
  id: number
  name: string
}

export type SeatTypeStats = {
  seats_count: number
  seats: Record<SeatStatus, number>
}

export type Seat = {
  id: number
  row: number
  place: number
  x: number
  y: number
  width: number
  height: number
  rotation: number
  seat_type: SeatType
  updated_at: Date
  status: SeatStatus
}

export type Hall = {
  id: number
  created_at: Date
  cinema_id: number
  name: string
  rows: number
  places: number
  seats: Seat[]
  seat_types: (SeatType & SeatTypeStats)[]
}

export type Cinema = {
  id: number
  name: string
  color: string
  created_at: Date
  halls: Hall[]
}
