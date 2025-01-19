import {SOCKET_URL} from "@/constants/common"
import {WebSocketClient} from "./wsClient"

export const wsClient = new WebSocketClient(SOCKET_URL)

export type {ConnectionState} from "./types"
export {isErrorMessage, isSuccessMessage} from "./types"
