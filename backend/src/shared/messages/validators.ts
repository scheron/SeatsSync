import {Namespace} from "../types"

export function isMessageType(type: Namespace) {
  return type.startsWith(type)
}
