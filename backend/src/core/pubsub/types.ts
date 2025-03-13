import type {IWebSocketClient} from "@/core/ws"
import type {MessageRequest} from "@/core/ws/messages"
import type {Subscription} from "@/shared/constants/messageTypes"

export type Subscriber = {
  ws: IWebSocketClient
  eid: string
}

export type SubscriptionHandler<T extends string = string, D = any> = {
  name: Subscription
  prepareSnapshot: (ws: IWebSocketClient, message: MessageRequest<T, D>) => Promise<any>
}
