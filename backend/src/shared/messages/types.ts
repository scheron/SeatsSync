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
  /** Message type */
  type: T
}

export type ErrorCode = number

export type MessageError<T extends string> = BaseMessage & {
  /** Message response status */
  status: Extract<ResponseStatus, "error">
  /** Message type */
  type: T
  /** Error details */
  data: {
    /** Error message */
    message: string
    /** Error code for client handling */
    code: ErrorCode
    /** Optional stack trace for development */
    stack?: string
  }
}

export type Message<T extends string, D = unknown> = MessageRequest<T, D> | MessageSuccess<T, D> | MessageError<T>
