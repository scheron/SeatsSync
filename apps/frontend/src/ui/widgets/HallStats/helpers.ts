import type {Hall, Seat} from "@seats-sync/types/cinema"

export function groupSeatsByType(seats: Seat[]) {
  return Object.entries(
    seats.reduce(
      (acc, seat) => {
        if (!acc[seat.seat_type.name]) acc[seat.seat_type.name] = []
        acc[seat.seat_type.name].push(seat)
        return acc
      },
      {} as Record<string, Seat[]>,
    ),
  ).map(([name, seats]) => ({name, seats}))
}

export function calcSeatTypeReservation(seatTypes: Hall["seat_types"], name: string) {
  const seatType = seatTypes.find((seatType) => seatType.name === name)
  if (!seatType) return "0%"

  const percent = seatType.seats.RESERVED / seatType.seats_count
  return `${(percent * 100).toFixed(0)}%`
}
