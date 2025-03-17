import {updateSeatStatus} from "@/methods/hall"
import {cinemaSubscription} from "@/subscriptions/cinema"
import {hallSubscription} from "@/subscriptions/hall"
import {Errors} from "@seats-sync/constants/errors"
import {Methods} from "@seats-sync/constants/methods"
import {Subscriptions} from "@seats-sync/constants/subscriptions"
import {formatError, formatSuccess} from "@/core/ws/messages"

import type {IWebSocketClient} from "@/core/ws"
import type {MessageRequest} from "@seats-sync/types/websocket"

export const HallController = {
  onMessage: async (ws: IWebSocketClient, message: MessageRequest) => {
    switch (message.type) {
      case Methods["hall.update_seat_status"]: {
        try {
          const {hall, updates} = await updateSeatStatus(message.data)

          hallSubscription.notify(updates.hall)
          cinemaSubscription.notify(updates.cinema)

          ws.send(formatSuccess({eid: message.eid, type: message.type, status: "success", data: hall}))
        } catch (error) {
          ws.send(formatError({eid: message.eid, type: message.type, error: error instanceof Error ? error.message : Errors.InternalServerError}))
        }

        return true
      }

      case Subscriptions["hall.subscribe"]: {
        hallSubscription.subscribe(ws, message)
        return true
      }

      case Subscriptions["hall.unsubscribe"]: {
        hallSubscription.unsubscribe(ws, message)
        return true
      }

      default: {
        return false
      }
    }
  },
  onDisconnect: (ws: IWebSocketClient) => {
    hallSubscription.unsubscribe(ws)
  },
}
