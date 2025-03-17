import type {Cinema} from "@seats-sync/types/cinema"
import type {CinemaDB} from "./types"

export function getCinemaHalls(halls: CinemaDB["halls"]): Cinema["halls"] {
  return halls.map(({seats, ...hall}) => ({
    ...hall,
    seats_count: seats.reduce((acc, seat) => ({...acc, [seat.status]: (acc[seat.status] || 0) + 1}), {
      VACANT: 0,
      RESERVED: 0,
    }),
  }))
}
