import {purchaseTickets, PurchaseTicketsRequest} from "./booking"
import {IWebSocketClient} from "@/core/ws"
import {Methods} from "@/constants/messageTypes"
import {MessageRequest} from "@/shared/messages/types"

export function onMessage(ws: IWebSocketClient, message: MessageRequest<string, any>): boolean {
  switch (message.type) {
    case Methods["booking.purchase"]:
      purchaseTickets(ws, message as PurchaseTicketsRequest)
      return true
    default:
      return false
  }
}
