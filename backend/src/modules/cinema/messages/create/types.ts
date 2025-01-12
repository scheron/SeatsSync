import type {Cinema} from "../../shared/types"

export interface CreateCinemaRequest {
  name: string
  color: string
}

export type CreateCinemaResponse = Cinema
