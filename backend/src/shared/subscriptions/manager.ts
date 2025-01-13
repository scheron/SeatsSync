import {WebSocket} from "ws"
import {IWebSocketClient} from "@/core/ws"
import {Events} from "../events"
import {formatSuccess} from "../messages/formatters"

type SubscriptionKey = string
type ClientId = string

export class SubscriptionManager {
  private events = new Events()
  private clientSubscriptions: Map<ClientId, Set<SubscriptionKey>> = new Map()

  subscribe(key: SubscriptionKey, ws: IWebSocketClient): void {
    const clientId = (ws as any).id

    if (!this.clientSubscriptions.has(clientId)) {
      this.clientSubscriptions.set(clientId, new Set())
    }
    this.clientSubscriptions.get(clientId)!.add(key)

    this.events.on(key, (data: any, type: string) => {
      if (ws.readyState === WebSocket.OPEN) {
        const message = formatSuccess({
          eid: "broadcast",
          type,
          data,
          status: "update",
        })
        ws.send(message)
      }
    })
  }

  unsubscribe(key: SubscriptionKey, ws: IWebSocketClient): void {
    const clientId = (ws as any).id
    const clientSubs = this.clientSubscriptions.get(clientId)

    if (clientSubs) {
      clientSubs.delete(key)
      if (clientSubs.size === 0) {
        this.clientSubscriptions.delete(clientId)
      }
    }

    this.events.off(key)
  }

  unsubscribeAll(ws: IWebSocketClient): void {
    const clientId = (ws as any).id
    const clientSubs = this.clientSubscriptions.get(clientId)

    if (clientSubs) {
      for (const key of clientSubs) {
        this.unsubscribe(key, ws)
      }
    }
  }

  publish(key: SubscriptionKey, data: any, type: string): void {
    this.events.notify(key, data, type)
  }
}

export const subscriptionManager = new SubscriptionManager()
