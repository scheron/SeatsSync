import type {MessageRequest} from "@/core/ws/messages"
import type {Subscription} from "@/shared/constants/messageTypes"
import type {SeatStatus} from "@/shared/types"

export type HallMessage = MessageRequest<Subscription>

export type Seat = {
  id: number
  row: number
  place: number
  status: SeatStatus
  seat_type: string
}

export type Hall = {
  id: number
  name: string
  cinema_id: number
  created_at: string
  rows: number
  places: number
  seats: Seat[]
}
