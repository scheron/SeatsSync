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
  width: number
  height: number
  rows: number
  places: number
  seats: {
    id: number
  }[]
}

export type Cinema = {
  id: number
  name: string
  color: string
  created_at: Date
  halls: Hall[]
}

export type Hall = {
  id: number
  name: string
  width: number
  height: number
  rows: number
  places: number
  seats_count: number
}
