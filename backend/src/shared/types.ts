import {Namespaces} from "@/constants/namespaces"

export type Namespace = (typeof Namespaces)[keyof typeof Namespaces]

export type Cinema = {
  id: number
  name: string
  color: string
  created_at: Date
  halls: Hall[]
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
}
