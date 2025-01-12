export type Cinema = {
  id: number
  name: string
  color: string
  halls: {
    id: number
    name: string
    seatsCount: number
  }[]
}

export type CinemaMessageType =
  | "cinema.get_all"
  | "cinema.get_one"
  | "cinema.create"
  | "cinema.update"
  | "cinema.delete"
  | "cinema.subscribe"
  | "cinema.unsubscribe"
