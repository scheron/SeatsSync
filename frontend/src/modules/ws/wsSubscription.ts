import {Logger} from "@/utils/logger"
import {randomUUID} from "@/utils/random"
import {BehaviorSubject, filter, Subject, takeUntil} from "rxjs"

import type {RequestMessage, ResponseMessage, ResponseMessageError, ResponseMessageSuccess, SubscriptionOptions} from "./types"
import type {WebSocketClient} from "./wsClient"

export function defineSubscription(ws: WebSocketClient) {
  const logger = new Logger(true)
  let _id = 0

  const subscriptions = new Map<string, Subscription>()
  const subscriptionEvents$ = new Subject<ResponseMessage>()

  class Subscription {
    readonly #destroyed$ = new BehaviorSubject<boolean>(false)

    id: string
    msg: RequestMessage
    onResult: <T>(msg: ResponseMessageSuccess<T>) => void
    onError: (msg: ResponseMessageError) => void
    onDelete: () => void
    isSubscribed = false
    isOnce: boolean
    isKeepAlive: boolean

    constructor({
      msg = {type: "*"} as RequestMessage,
      onResult = () => {},
      onError = () => {},
      onDelete = () => {},
      isKeepAlive = true,
      isOnce = false,
    }: SubscriptionOptions) {
      this.id = msg.eid ?? `${++_id}`
      this.msg = {...msg, eid: this.id}
      this.onResult = onResult
      this.onError = onError
      this.onDelete = onDelete
      this.isKeepAlive = isKeepAlive
      this.isOnce = isOnce

      logger.info("[Subscription] Created:", {id: this.id, type: msg.type})

      subscriptions.set(this.id, this)

      this.#init()

      if (ws.state === "CONNECTED") this.#subscribe()
    }

    #init() {
      subscriptionEvents$
        .pipe(
          filter((msg) => msg.eid === this.id),
          takeUntil(this.#destroyed$),
        )
        .subscribe((msg) => {
          if (msg.status === "error") {
            this.onError(msg)
            this.destroy()
            this.isSubscribed = false
          } else {
            this.onResult(msg)
            this.isSubscribed = true

            if (this.isOnce) this.unsubscribe()
          }
        })
    }

    #subscribe() {
      logger.info("[Subscription] Subscribing:", {id: this.id, type: this.msg.type})
      ws.send(this.msg as RequestMessage)
    }

    destroy() {
      if (this.#destroyed$.value) return

      logger.info("[Subscription] Destroying:", {id: this.id})
      this.onDelete()
      subscriptions.delete(this.id)
      this.#destroyed$.next(true)
      this.#destroyed$.complete()
    }

    resubscribe() {
      if (this.isSubscribed) this.unsubscribe()

      this.id = `${++_id}`
      this.msg.eid = this.id

      subscriptions.set(this.id, this)

      this.#subscribe()
    }

    unsubscribe() {
      if (this.msg.type.includes("subscribe")) {
        const message: RequestMessage = {
          type: this.msg.type.replace("subscribe", "unsubscribe") as any,
          data: {sub_eid: this.id},
          eid: randomUUID(),
        }

        logger.info("[Subscription] Unsubscribing:", {id: this.id, type: message.type})
        ws.send(message)
      }

      this.isSubscribed = false

      this.destroy()
    }

    static request<T = any>(msg: RequestMessage<T> & {eid?: string}): Promise<T> {
      return new Promise((resolve, reject) => {
        new Subscription({
          msg: {...msg, eid: msg.eid ?? randomUUID()},
          onResult: (data) => resolve(data.data as unknown as T),
          onError: reject,
          isOnce: true,
        })
      })
    }
  }

  ws.connectionState.subscribe(({state}) => {
    if (state === "DISCONNECTED" || state === "DESTROYED") {
      // probably need soft destroy
      console.log("destroying subscriptions", Array.from(subscriptions.values()))
      subscriptions.forEach((sub) => sub.destroy())
      subscriptions.clear()
    }

    if (state === "CONNECTED") {
      subscriptions.forEach((sub) => {
        if (sub.isSubscribed && sub.isOnce) return
        if (sub.isKeepAlive) ws.send(sub.msg as RequestMessage)
      })
    }
  })

  ws.on("*")
    .pipe(filter((msg) => !!msg?.eid && subscriptions.has(msg.eid)))
    .subscribe((msg) => subscriptionEvents$.next(msg))

  return Subscription
}
