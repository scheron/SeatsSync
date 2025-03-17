import {getCinemas} from "@/methods/cinema"
import {cinemaSubscription} from "@/subscriptions/cinema"
import {Errors} from "@seats-sync/constants/errors"
import {Methods} from "@seats-sync/constants/methods"
import {Subscriptions} from "@seats-sync/constants/subscriptions"
import {formatError, formatSuccess} from "@/core/ws/messages"

import type {IWebSocketClient} from "@/core/ws"
import type {MessageRequest} from "@seats-sync/types/websocket"

export const CinemaController = {
  onMessage: async (ws: IWebSocketClient, message: MessageRequest<any>) => {
    switch (message.type) {
      case Methods["cinemas.get_cinemas"]: {
        try {
          const cinemas = await getCinemas()
          ws.send(formatSuccess({eid: message.eid, type: message.type, status: "success", data: cinemas}))
        } catch (error) {
          ws.send(formatError({eid: message.eid, type: message.type, error: error instanceof Error ? error.message : Errors.InternalServerError}))
        }
        return true
      }

      case Subscriptions["cinemas.subscribe"]: {
        cinemaSubscription.subscribe(ws, message)
        return true
      }

      case Subscriptions["cinemas.unsubscribe"]: {
        cinemaSubscription.unsubscribe(ws, message)
        return true
      }

      default: {
        return false
      }
    }
  },

  onDisconnect: (ws: IWebSocketClient) => {
    cinemaSubscription.unsubscribe(ws)
  },
}
