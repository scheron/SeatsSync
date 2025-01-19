import {onUnmounted} from "vue"
import {filter, map, Subscription} from "rxjs"
import {wsClient} from "@/modules/ws"

import type {ErrorCode} from "@/constants/errors"
import type {ConnectionState} from "@/modules/ws"
import type {MessageType, RequestMessage, ResponseStatus} from "@/modules/ws/types"

type Handler<T> = (data: T) => void
type HandlerWithPrevState<T> = (data: T, prevState: ConnectionState | null) => void
type Unsubscribe = () => void

export function useSubscription<T>(type: MessageType) {
  const subscriptions = new Set<Subscription>()

  function unsubscribe() {
    subscriptions.forEach((sub) => sub.unsubscribe())
    subscriptions.clear()
  }

  function send(message: Omit<RequestMessage<T>, "type">) {
    wsClient.send({...message, type})
  }

  function addSubscription(status: "error", handler: Handler<ErrorCode>): Unsubscribe
  function addSubscription<T = any>(status: Exclude<ResponseStatus, "error">, handler: Handler<T>): Unsubscribe
  function addSubscription<T = any>(status: ResponseStatus, handler: Handler<T | ErrorCode>): Unsubscribe {
    const subscription = wsClient
      .on(type)
      .pipe(
        filter((message) => message.status === status),
        map((message) => (status === "error" ? (message.error as ErrorCode) : (message.data as T))),
      )
      .subscribe(handler)

    subscriptions.add(subscription)
    return () => subscription.unsubscribe()
  }

  function onStateChange(handler: HandlerWithPrevState<ConnectionState>): Unsubscribe {
    const subscription = wsClient.connectionState.subscribe(({state, prevState}) => handler(state, prevState))
    subscriptions.add(subscription)
    return () => subscription.unsubscribe()
  }

  onUnmounted(() => {
    unsubscribe()
  })

  return {
    onSnapshot: (handler: Handler<T>) => addSubscription("snapshot", handler),
    onSuccess: (handler: Handler<T>) => addSubscription("success", handler),
    onUpdate: (handler: Handler<T>) => addSubscription("update", handler),
    onError: (handler: Handler<ErrorCode>) => addSubscription("error", handler),
    onStateChange,
    send,
  }
}
