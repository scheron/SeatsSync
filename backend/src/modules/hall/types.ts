export type Hall = {
  id: number
  name: string
  seatsCount: number
  cinemaId: number
}

export type HallPlan = {
  id: number
  name: string
  canvas: {
    width: number
    height: number
  }
  rows: number
  places: number
  seats: Seat[]
}

export type Seat = {
  id: number
  seatType: number
  row: number
  place: number
  x: number
  y: number
  width: number
  height: number
  rotation: number
  status: SeatStatus
}

export type SeatStatus = "free" | "reserved" | "occupied"
