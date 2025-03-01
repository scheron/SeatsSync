export type SeatStatus = "free" | "reserved" | "occupied"

export type Seat = {
  id: number
  hall_id: number
  seat_type_id: number
  row: number
  place: number
  x: number
  y: number
  width: number
  height: number
  rotation: number
  status: SeatStatus
}
