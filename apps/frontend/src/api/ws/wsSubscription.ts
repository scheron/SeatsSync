import {Logger} from "@seats-sync/logger"
import {randomUUID} from "@seats-sync/utils/random"
import {filter, Subject, takeUntil} from "rxjs"

import type {MessageError, MessageRequest, MessageSuccess} from "@seats-sync/types/websocket"
import type {ResponseMessage, SubscriptionOptions} from "./types"
import type {WebSocketClient} from "./wsClient"

type SubscriptionState = "INIT" | "PENDING" | "SUBSCRIBED" | "ERROR" | "UNSUBSCRIBED" | "DESTROYED"

export function defineSubscription(ws: WebSocketClient, {debug = false} = {}) {
  const logger = new Logger({enabled: debug})
  let _counter = 0

  const subscriptions = new Map<string, Subscription>()
  const subscriptionEvents$ = new Subject<ResponseMessage>()

  class Subscription<DataRes = any, DataReq = any> {
    readonly destroyed$ = new Subject<boolean>()
    state: SubscriptionState = "INIT"

    id: string
    msg: MessageRequest<DataReq>
    onSnapshot: (data: DataRes) => void
    onUpdate: (data: DataRes) => void
    onResult: (msg: MessageSuccess<DataRes>) => void
    onError: (msg: MessageError) => void
    onDelete: () => void
    isOnce: boolean
    isKeepAlive: boolean

    constructor({
      msg = {type: "*"} as MessageRequest<DataReq>,
      onSnapshot = () => {},
      onUpdate = () => {},
      onResult = () => {},
      onError = () => {},
      onDelete = () => {},
      isKeepAlive = true,
      isOnce = false,
    }: SubscriptionOptions<DataRes, DataReq>) {
      this.id = msg?.eid ?? `${++_counter}`
      this.msg = {...msg, eid: this.id} as MessageRequest<DataReq>
      this.onSnapshot = onSnapshot
      this.onUpdate = onUpdate
      this.onResult = onResult
      this.onError = onError
      this.onDelete = onDelete
      this.isKeepAlive = isKeepAlive
      this.isOnce = isOnce

      logger.info("[Subscription] Created:", {id: this.id, type: msg.type})

      subscriptions.set(this.id, this)

      this.#init()

      if (ws.state === "CONNECTED") this.subscribe()
    }

    #init() {
      subscriptionEvents$
        .pipe(
          filter((msg) => msg.eid === this.id),
          takeUntil(this.destroyed$),
        )
        .subscribe((msg) => {
          if (this.state === "DESTROYED") return

          if (msg.status === "error") {
            this.state = "ERROR"
            this.onError(msg as MessageError)
            this.destroy()
            return
          }

          this.state = "SUBSCRIBED"

          this.onResult(msg as MessageSuccess<DataRes>)
          if (msg.status === "snapshot") this.onSnapshot(msg.data as DataRes)
          if (msg.status === "update") this.onUpdate(msg.data as DataRes)

          if (this.isOnce) this.unsubscribe()
        })
    }

    subscribe() {
      logger.info("[Subscription] Subscribing:", {id: this.id, type: this.msg.type})
      if (this.msg.type === "*") return

      this.state = "PENDING"
      ws.send(this.msg as MessageRequest)
    }

    resubscribe() {
      if (this.state === "DESTROYED") return
      if (this.msg.type === "*") return

      this.softUnsubscribe()

      this.id = `${++_counter}`
      this.msg.eid = this.id
      this.state = "INIT"

      subscriptions.set(this.id, this)

      if (ws.state === "CONNECTED") this.subscribe()
    }

    /**
     * Unsubscribe from the WebSocket message.
     * After unsubscribing, the subscription will be destroyed.
     * If subscription has 'subscribe' in the type, it will send 'unsubscribe' message before destroying
     */
    unsubscribe() {
      if (this.msg.type === "*") {
        this.destroy()
        return
      }

      if (this.msg.type.includes("subscribe")) {
        const message: MessageRequest = {
          type: this.msg.type.replace("subscribe", "unsubscribe") as any,
          data: {sub_eid: this.id},
          eid: randomUUID(),
        }

        logger.info("[Subscription] Unsubscribing:", {id: this.id, type: message.type})
        ws.send(message)
      }

      this.destroy()
    }

    /**
     * Same as unsubscribe, but without destroying the subscription
     */
    softUnsubscribe() {
      if (this.state === "DESTROYED") return
      if (this.msg.type === "*") return

      const message: MessageRequest<any> = {
        type: this.msg.type.replace("subscribe", "unsubscribe") as any,
        data: {sub_eid: this.id},
        eid: randomUUID(),
      }

      logger.info("[Subscription] Soft unsubscribe:", {oldId: this.id, unsubMsgType: message.type})

      ws.send(message)
      this.state = "UNSUBSCRIBED"
    }

    destroy() {
      if (this.state === "DESTROYED") return

      logger.info("[Subscription] Destroying:", {id: this.id})

      this.onDelete()
      subscriptions.delete(this.id)

      this.state = "DESTROYED"

      this.destroyed$.next(true)
      this.destroyed$.complete()
    }

    /**
     * Creates a one-time request to the WebSocket.
     * Resolves or rejects based on the response status.
     * @param msg - The WebSocket request message.
     * @returns A promise that resolves with the response data or rejects with an error.
     */
    static request<DataRes, DataReq>(msg: MessageRequest<DataReq> & {eid?: string}): Promise<DataRes> {
      return new Promise((resolve, reject) => {
        new Subscription({
          msg: {...msg, eid: msg.eid ?? randomUUID()},
          onResult: (data) => resolve(data.data as unknown as DataRes),
          onError: reject,
          isOnce: true,
          isKeepAlive: false,
        })
      })
    }
  }

  ws.connectionState.subscribe(({state}) => {
    if (state === "DESTROYED") {
      logger.info("[Subscription] WS state -> DESTROYED; destroying all subs")
      subscriptions.forEach((sub) => sub.destroy())
      subscriptions.clear()
      return
    }

    if (state === "DISCONNECTED") {
      logger.info("[Subscription] WS state -> DISCONNECTED; clearing all subs")
      subscriptions.forEach((sub) => sub.softUnsubscribe())
      return
    }

    if (state === "CONNECTED") {
      subscriptions.forEach((sub) => {
        if (sub.state === "DESTROYED") return
        if (sub.state === "INIT") {
          sub.subscribe()
          return
        }

        if (sub.isOnce) return
        if (sub.isKeepAlive) sub.subscribe()
      })
    }
  })

  ws.on("*")
    .pipe(filter((msg) => !!msg?.eid && subscriptions.has(msg.eid)))
    .subscribe((msg) => subscriptionEvents$.next(msg as ResponseMessage))

  return Subscription
}
