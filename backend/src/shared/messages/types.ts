export type ResponseStatus = "success" | "error" | "snapshot" | "update"

export type MessageRequest<T extends string, D = any> = {
  /** External user id */
  eid: string | number
  /** Message type */
  type: T
  /** Message data */
  data: D
}

export type MessageSuccess<T extends string, D = any> = {
  /** External user id */
  eid: string | number
  /** Message timestamp */
  ts: number
  /** Message response status */
  status: ResponseStatus
  /** Message data */
  data: D
  /** Message type */
  type: T
}

export type MessageError<T extends string> = {
  /** External user id */
  eid: string | number
  /** Message timestamp */
  ts: number
  /** Message response status */
  status: ResponseStatus
  /** Message data */
  type: T
  /** Error message */
  data: {
    msg: string
    code: number
  }
}
