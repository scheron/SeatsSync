import type {HallDB, SeatTypeDB} from "./hall.types"

export function getSeatTypes(seats: HallDB["seats"]): SeatTypeDB[] {
  const seatTypeMap = seats.reduce((acc, seat) => {
    const {id, name} = seat.seat_type

    if (!acc.has(id)) {
      acc.set(id, {
        id,
        name,
        seats_count: 0,
        seats: {VACANT: 0, RESERVED: 0},
      })
    }

    const seatTypeStats = acc.get(id)!
    seatTypeStats.seats_count++
    seatTypeStats.seats[seat.status]++

    return acc
  }, new Map<number, SeatTypeDB>())

  return Array.from(seatTypeMap.values()).sort((a, b) => a.id - b.id)
}
