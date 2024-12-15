export type Cinema = {
  id: number
  name: string
  color: string
  halls: Hall[]
}

export type Hall = {
  id: number
  name: string
  seatsCount: number
}

export type HallPlan = {
  id: number
  name: string
  rows: number
  places: number
  width: number
  height: number
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
  status: "free" | "occupied"
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
