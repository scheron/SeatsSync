import {randomUUID} from "@/utils/random"
import {catchError, EMPTY, filter, interval, Subject, takeUntil, tap} from "rxjs"
import {webSocket, WebSocketSubject} from "rxjs/webSocket"

type Message =
  | 1
  | {
      type: string
      data: any
      eid: string
    }

export class WebSocketService {
  private socket$: WebSocketSubject<Message> | null = null
  private readonly url: string
  private readonly reconnectInterval = 5000 // 5 секунд
  private readonly pingInterval = 2000 // 2 секунды
  private readonly disconnect$ = new Subject<void>()

  constructor(url: string) {
    this.url = url
    this.initSocket()
  }

  private initSocket() {
    this.socket$ = webSocket<Message>({
      url: this.url,
      openObserver: {
        next: () => console.log("WebSocket connection established"),
      },
      closeObserver: {
        next: () => {
          console.log("WebSocket connection closed, reconnecting...")
          this.reconnect()
        },
      },
    })

    this.startPing()
  }

  private reconnect() {
    setTimeout(() => {
      this.initSocket()
    }, this.reconnectInterval)
  }

  private startPing() {
    interval(this.pingInterval)
      .pipe(
        takeUntil(this.disconnect$),
        tap(() => this.send(1)),
        catchError((err) => {
          console.log("Ping error:", err)
          return EMPTY
        }),
      )
      .subscribe()
  }

  public send(message: Message) {
    if (!this.socket$) {
      console.log("WebSocket is not connected. Message not sent:", message)
      return
    }

    this.socket$.next(message)
  }

  public onMessage(type?: string) {
    if (!this.socket$) {
      console.log("WebSocket is not initialized.")
      return EMPTY
    }

    return this.socket$.asObservable().pipe(
      takeUntil(this.disconnect$),
      filter((message) => typeof message === "object" && message !== null && "type" in message),
      filter((message) => (type ? message.type === type : true)),
      catchError((err) => {
        console.log("WebSocket message error:", err)
        return EMPTY
      }),
    )
  }

  public disconnect() {
    console.log("Closing WebSocket connection")
    this.disconnect$.next()
    this.disconnect$.complete()
    this.socket$?.complete()
    this.socket$ = null
  }

  public generateEid() {
    return randomUUID()
  }
}

export const ws = new WebSocketService("ws://localhost:3001")
