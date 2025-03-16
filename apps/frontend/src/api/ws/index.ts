import {SOCKET_URL} from "@/constants/common"
import {WebSocketClient} from "./wsClient"
import {defineSubscription} from "./wsSubscription"

export const wsClient = new WebSocketClient(SOCKET_URL, {debug: true})
export const Subscription = defineSubscription(wsClient)

export type SubscriptionInstance = Omit<InstanceType<typeof Subscription>, "#init" | "#subscribe" | "destroyed$">
export type {ConnectionState, SubscriptionOptions, ResponseMessage} from "./types"
export {isErrorMessage, isSuccessMessage} from "./types"
