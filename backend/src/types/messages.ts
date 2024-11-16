export type ResponseStatus = "performed" | "error" | "snapshot" | "update"

export type RequestMessage<T extends string, D = any> = {
  type: T
  data: D
  id: string | number
}

export type SuccessMessage<T extends string, D = any> = {
  type: T
  data: D
  id: string | number
  status: ResponseStatus
  ts: number
}

export type ErrorMessage<T extends string> = {
  type: T
  data: {
    msg: string
    code: number
  }
  id: string | number
  status: ResponseStatus
  ts: number
}
