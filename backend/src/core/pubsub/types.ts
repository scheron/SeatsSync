import type {Subscription} from "@/constants/messageTypes"
import type {IWebSocketClient} from "@/core/ws"
import type {MessageRequest} from "@/shared/messages/types"

export type Subscriber = {
  ws: IWebSocketClient
  eid: string
}

export type SubscriptionHandler<T extends string = string, D = any> = {
  name: Subscription
  prepareSnapshot: (ws: IWebSocketClient, message: MessageRequest<T, D>) => Promise<any>
}
