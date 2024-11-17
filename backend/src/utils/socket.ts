import {nanoid} from "nanoid"

import type {MessageError, MessageSuccess, MessageRequest, ResponseStatus} from "@/types/messages"
import type {RawData} from "ws"

export function prepareRequestMsg<T extends string, D = any>(message: RawData): MessageRequest<T, D> | null {
  try {
    try {
      const {type, data, eid} = JSON.parse(message.toString()) as MessageRequest<T, D>

      return {type, data, eid}
    } catch (error) {
      console.log(error)
      return null
    }
  } catch (error) {
    console.log(error)
    return null
  }
}

export function prepareSuccessMsg<T extends string, D = any>(msg: {
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

export function prepareErrorMsg<T extends string>({
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
