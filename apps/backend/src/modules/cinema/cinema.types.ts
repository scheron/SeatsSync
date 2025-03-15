import type {SeatStatus} from "@seats-sync/types/cinema"

export type CinemaDB = {
  id: number
  name: string
  color: string
  created_at: Date
  halls: HallDB[]
}

export type HallDB = {
  id: number
  name: string
  rows: number
  places: number
  seats: {
    id: number
    status: SeatStatus
  }[]
}
