import {nanoid} from "nanoid"

import type {RawData} from "ws"
import type {RequestMessage, ErrorMessage, SuccessMessage, ResponseStatus} from "@/types/messages"

export function prepareRequestMsg<T extends string, D = any>(message: RawData): RequestMessage<T, D> | null {
  try {
    try {
      const {type, data, id} = JSON.parse(message.toString()) as RequestMessage<T, D>

      return {type, data, id}
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
  id?: number | string
  type: T
  data: D
  status: ResponseStatus
}) {
  const response: SuccessMessage<T, D> = {
    id: msg.id ?? nanoid(),
    type: msg.type,
    data: msg.data,
    status: msg.status,
    ts: Date.now(),
  }

  return JSON.stringify(response)
}

export function prepareErrorMsg<T extends string>({
  id,
  type,
  error,
  code,
}: {
  id?: number | string
  type: T
  error: string
  code: number
}) {
  const response: ErrorMessage<T> = {
    id: id ?? nanoid(),
    type,
    data: {msg: error, code},
    status: "error",
    ts: Date.now(),
  }

  return JSON.stringify(response)
}
