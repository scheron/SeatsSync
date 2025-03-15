import type {ErrorCode} from "@seats-sync/constants/errors"

export type ApiResponse<T> = {
  data: T
  error: ErrorCode | null
  status: "success" | "error"
}
