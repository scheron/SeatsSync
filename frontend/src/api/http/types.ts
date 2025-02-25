import type {ErrorCode} from "@/constants/errors"

export type ApiResponse<T> = {
  data: T
  error: ErrorCode | null
  status: "success" | "error"
}
