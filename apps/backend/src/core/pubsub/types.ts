import type {IWebSocketClient} from "@/core/ws"
import type {Subscription} from "@seats-sync/constants/subscriptions"
import type {MessageRequest} from "@seats-sync/types/websocket"

export type Subscriber = {
  ws: IWebSocketClient
  eid: string
}

export type SubscriptionHandler<D = any> = {
  name: Subscription
  prepareSnapshot: (ws: IWebSocketClient, message: MessageRequest<D>) => Promise<any>
}
