import {publisher} from "@/core/pubsub"
import {IWebSocketClient} from "@/core/ws"
import {HallService} from "@/services/hall"
import {Subscription} from "@/constants/messageTypes"
import {MessageRequest} from "@/shared/messages/types"
import {Hall} from "@/shared/types"

const subscription = publisher.register({
  name: "hall.subscribe",

  async onSnapshot(ws: IWebSocketClient, message: MessageRequest<Subscription, {hall_id: number}>) {
    const {hall_id} = message.data

    const hall = await HallService.getHall(hall_id)

    return hall
  },
})

export function subscribe(ws: IWebSocketClient, message: MessageRequest<Subscription, {hall_id: number}>) {
  return subscription.subscribe(ws, message)
}

export function unsubscribe(ws: IWebSocketClient, eid?: string) {
  subscription.unsubscribe(ws.context.id, eid)
}

export function notifyUpdate(hall: Hall) {
  subscription.notify("update", hall)
}
