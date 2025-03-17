import type {Hall, Seat, SeatType} from "@prisma/client"
import type {SeatType as HallSeatType, SeatTypeStats} from "@seats-sync/types/cinema"
import type {Except} from "type-fest"

type SeatDB = Except<Seat, "seat_type_id" | "hall_id"> & {seat_type: SeatType}
export type HallDB = Hall & {seats: SeatDB[]}
export type SeatTypeDB = HallSeatType & SeatTypeStats
