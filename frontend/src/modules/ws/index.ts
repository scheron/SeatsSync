import {SOCKET_URL} from "@/constants/common"
import {WebSocketClient} from "./wsClient"
import {defineSubscription} from "./wsSubscription"

export const wsClient = new WebSocketClient(SOCKET_URL)
export const Subscription = defineSubscription(wsClient)

export type {ConnectionState} from "./types"
export {isErrorMessage, isSuccessMessage} from "./types"
