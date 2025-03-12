import {Method, Subscription} from "@/constants/messageTypes"
import {MessageRequest} from "@/shared/messages/types"
import {SeatStatus} from "@/shared/types"

export type CinemaMessage = MessageRequest<Subscription> | MessageRequest<Method>

export type CinemaDB = {
  id: number
  name: string
  color: string
  created_at: Date
  halls: HallDB[]
}

export type HallDB = {
  id: number
  name: string
  rows: number
  places: number
  seats: {
    id: number
    status: SeatStatus
  }[]
}

export type Cinema = {
  id: number
  name: string
  color: string
  created_at: Date
  halls: Hall[]
}

export type Hall = {
  id: number
  name: string
  rows: number
  places: number
  seats_count: Record<SeatStatus, number>
}
