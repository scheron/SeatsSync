import type {Hall} from "../hall/types"

export type Cinema = {
  id: number
  name: string
  color: string
  halls: Hall[]
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

export type SeatType = {
  id: number
  name: string
  ticketTypes: TicketType[]
}

export type TicketType = {
  id: number
  name: string
  price: number
}

export type SeatStatus = "free" | "reserved" | "occupied"
