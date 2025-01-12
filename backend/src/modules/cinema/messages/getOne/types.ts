import type {Cinema} from "../../shared/types"

export interface GetOneCinemaRequest {
  id: number
}

export type GetOneCinemaResponse = Cinema
