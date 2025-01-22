import {WebSocket} from "ws"
import {ErrorCode, Errors} from "@/constants/errors"
import {logger} from "@/shared/logger"
import {formatError, formatSuccess} from "@/shared/messages/formatters"

import type {IWebSocketClient} from "@/core/ws"
import type {MessageRequest, ResponseStatus} from "@/shared/messages/types"
import type {Subscriber as ISubscriber, SubscriptionHandler} from "./types"

export class Subscriber<T extends string = string, D = any> {
  private subscribers = new Map<string, ISubscriber>()

  constructor(private handler: SubscriptionHandler<T, D>) {}

  async onSubscribe(ws: IWebSocketClient, message: MessageRequest<T, D>) {
    try {
      const clientId = (ws as any).id

      for (const subscriber of this.subscribers.values()) {
        if (subscriber.ws === ws && subscriber.eid === message.eid) {
          ws.send(formatError({eid: message.eid, error: Errors.SubscriptionAlreadyExists}))
          return
        }
      }

      const snapshot = await this.handler.onSnapshot(ws, message)

      ws.send(formatSuccess({eid: message.eid, status: "snapshot", type: this.handler.name, data: snapshot}))

      this.subscribers.set(clientId, {ws, eid: message.eid})

      logger.info(`Client subscribed to ${this.handler.name}`, {clientId, eid: message.eid})
    } catch (error) {
      ws.send(formatError({eid: message.eid, error: Errors.InternalServerError}))
      logger.error(`Failed to handle ${this.handler.name} subscription`, {error: (error as Error).message})
    }
  }

  unsubscribe(clientId: string) {
    this.subscribers.delete(clientId)
  }

  notify<T = any>(status: Extract<ResponseStatus, "update" | "error">, message: T | ErrorCode) {
    this.subscribers.forEach((subscriber, clientId) => {
      const {ws, eid} = subscriber

      if (ws.readyState === WebSocket.OPEN) {
        try {
          if (status === "update") ws.send(formatSuccess({eid, type: this.handler.name, status: "update", data: message as T}))
          else ws.send(formatError({eid, type: this.handler.name, error: message as ErrorCode}))
        } catch (error) {
          logger.error(`Failed to notify client for ${this.handler.name}`, {error: (error as Error).message, clientId, eid})
        }
      } else {
        // TODO: if we connecting, await for reconnect,then send
        this.subscribers.delete(clientId)
      }
    })
  }
}
