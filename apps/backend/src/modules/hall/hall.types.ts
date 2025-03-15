import type {MessageRequest} from "@/core/ws/messages"
import type {Subscription} from "@/shared/constants/messageTypes"
import type {Hall, Seat, SeatType} from "@prisma/client"
import type {Except} from "type-fest"

export type HallMessage = MessageRequest<Subscription>

type SeatDB = Except<Seat, "seat_type_id" | "hall_id"> & {seat_type: SeatType}
export type HallDB = Hall & {seats: SeatDB[]}
