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
