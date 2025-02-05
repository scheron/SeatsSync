import type {Errors} from "@/constants/errors"
import type {Method, Subscription} from "@/constants/messageTypes"

export type MessageType = Method | Subscription | "*"

export type ResponseStatus = "success" | "error" | "snapshot" | "update"

export type RequestMessage<T = any> = {
  type: MessageType
  eid?: string
  data: T
}

export type SubscriptionOptions<T = any, D = any> = {
  msg?: RequestMessage<D>
  onSnapshot?: (data: T) => void
  onUpdate?: (data: T) => void
  onResult?: (msg: ResponseMessageSuccess<T>) => void
  onError?: (msg: ResponseMessageError) => void
  onDelete?: () => void
  isKeepAlive?: boolean
  isOnce?: boolean
}

export type ResponseMessageSuccess<T = any> = {
  type: MessageType
  eid: string
  data: T
  error: null
  status: Exclude<ResponseStatus, "error">
}

export type ResponseMessageError = {
  type: MessageType
  eid: string
  data: null
  error: keyof typeof Errors
  status: "error"
}

export type ResponseMessage<T = any> = ResponseMessageSuccess<T> | ResponseMessageError
export type PingMessage = 1
export type WebSocketMessage<T> = ResponseMessage<T> | PingMessage

export function isErrorMessage<T>(message: ResponseMessage<T>): message is ResponseMessageError {
  return message.status === "error" && message.error !== null
}

export function isSuccessMessage<T>(message: ResponseMessage<T>): message is ResponseMessageSuccess<T> {
  return message.status !== "error" && message.error === null
}

export type ConnectionState = "DISCONNECTED" | "CONNECTING" | "RECONNECTING" | "CONNECTED" | "DESTROYED" | "INITIALIZED"
