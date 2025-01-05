export type BaseMessage = {
  /** External user id - unique identifier for the message */
  eid: string
  /** Message timestamp in milliseconds */
  ts: number
}

export type ResponseStatus = "success" | "error" | "snapshot" | "update"

export type MessageRequest<T extends string, D = unknown> = BaseMessage & {
  /** Message type */
  type: T
  /** Message payload */
  data: D
}

export type MessageSuccess<T extends string, D = unknown> = BaseMessage & {
  /** Message response status */
  status: Extract<ResponseStatus, "success" | "snapshot" | "update">
  /** Message payload */
  data: D
  /** No error */
  error: null
  /** Message type */
  type: T
}

export type MessageError<T extends string> = BaseMessage & {
  /** Message response status */
  status: Extract<ResponseStatus, "error">
  /** Message type */
  type: T
  /** No data */
  data: null
  /** Error slug for client handling */
  error: string
}

export type Message<T extends string, D = unknown> = MessageRequest<T, D> | MessageSuccess<T, D> | MessageError<T>
