import {ref} from "vue"
import {tryOnBeforeUnmount} from "@vueuse/core"
import {BehaviorSubject} from "rxjs"
import {takeUntil} from "rxjs/operators"
import {Subscription, wsClient} from "@/api/ws"

import type {ConnectionState, SubscriptionInstance, SubscriptionOptions} from "@/api/ws"
import type {MessageRequest} from "@seats-sync/types/websocket"
import type {PartialDeep} from "type-fest"
import type {Ref} from "vue"

type UseWebSocketReturn = {
  connectionState: Ref<ConnectionState>
  subscriptions: Ref<Map<string, SubscriptionInstance>>
  subscribe: <DataRes = any, DataReq = any>(options: SubscriptionOptions<DataRes, DataReq>) => SubscriptionInstance["unsubscribe"]
  unsubscribe: (id: string) => void
  resubscribe: (id: string) => void
  send: <DataRes = any, DataReq = any>(message: PartialDeep<MessageRequest<DataReq>>) => Promise<DataRes>
  cleanup: () => void
}

export function useWebSocket(): UseWebSocketReturn {
  const connectionState = ref(wsClient.state)
  const subscriptions = ref(new Map<string, SubscriptionInstance>())
  const destroy$ = new BehaviorSubject<boolean>(false)

  const connectionStateSubscription = wsClient.connectionState.pipe(takeUntil(destroy$)).subscribe(({state}) => {
    connectionState.value = state
  })

  function subscribe<DataRes = any, DataReq = any>(options: SubscriptionOptions<DataRes, DataReq>): SubscriptionInstance["unsubscribe"] {
    const subscription = new Subscription<DataRes, DataReq>(options)

    subscriptions.value.set(subscription.id, subscription as SubscriptionInstance)

    return () => subscription.unsubscribe()
  }

  function unsubscribe(id: string) {
    const subscription = subscriptions.value.get(id)
    if (!subscription) return

    subscription.unsubscribe()
    subscriptions.value.delete(id)
  }

  function resubscribe(id: string) {
    const subscription = subscriptions.value.get(id)
    if (!subscription) return

    subscription.resubscribe()
  }

  async function send<DataRes = any, DataReq = any>(message: PartialDeep<MessageRequest<DataReq>>): Promise<DataRes> {
    try {
      return await Subscription.request<DataRes, DataReq>(message)
    } catch (error) {
      console.error("Error sending message:", message, error)
      throw error
    }
  }

  function cleanup() {
    destroy$.next(true)
    destroy$.complete()

    connectionStateSubscription.unsubscribe()

    subscriptions.value.forEach((sub) => sub.unsubscribe())
    subscriptions.value.clear()
  }

  tryOnBeforeUnmount(cleanup)

  return {
    connectionState,
    subscriptions,
    subscribe,
    unsubscribe,
    resubscribe,
    send,
    cleanup,
  }
}
