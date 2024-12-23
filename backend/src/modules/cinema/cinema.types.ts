export type Cinema = {
  id: number
  name: string
  color: string
}

export type CinemaMessageType = "cinema.get_all" | "cinema.get_one" | "cinema.create"
