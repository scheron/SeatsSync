import {nanoid} from "nanoid"
import {MessageError, MessageRequest, MessageSuccess, ResponseStatus} from "./types"

import type {RawData} from "ws"

export function formatRequestMsg<T extends string, D = any>(message: RawData): MessageRequest<T, D> | null {
  try {
    try {
      const {type, data, eid} = JSON.parse(message.toString()) as MessageRequest<T, D>

      return {type, data, eid}
    } catch {
      return null
    }
  } catch {
    return null
  }
}

export function formatResponseSuccessMsg<T extends string, D = any>(msg: {
  eid?: number | string
  type: T
  data: D
  status: ResponseStatus
}) {
  const response: MessageSuccess<T, D> = {
    eid: msg.eid ?? nanoid(),
    type: msg.type,
    data: msg.data,
    status: msg.status,
    ts: Date.now(),
  }

  return JSON.stringify(response)
}

export function formatResponseErrorMsg<T extends string>({
  eid,
  type,
  error,
  code,
}: {
  eid?: number | string
  type: T
  error: string
  code: number
}) {
  const response: MessageError<T> = {
    eid: eid ?? nanoid(),
    type,
    data: {msg: error, code},
    status: "error",
    ts: Date.now(),
  }

  return JSON.stringify(response)
}
