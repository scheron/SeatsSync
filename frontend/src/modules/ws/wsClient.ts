import {randomUUID} from "@/utils/random"
import {catchError, EMPTY, filter, interval, Observable, Subject, takeUntil, tap} from "rxjs"
import {webSocket, WebSocketSubject} from "rxjs/webSocket"

import type {
  MessageType,
  RequestMessage,
  ResponseMessage,
  ResponseMessageError,
  ResponseMessageSuccess,
  ResponseStatus,
  WebSocketMessage,
} from "./types"

export class WebSocketClient {
  private socket$: WebSocketSubject<WebSocketMessage<any>> | null = null
  private readonly url: string
  private readonly reconnectInterval = 5000
  private readonly pingInterval = 2000
  private readonly disconnect$ = new Subject<void>()

  constructor(url: string) {
    this.url = url
    this.initSocket()
  }

  private initSocket() {
    this.socket$ = webSocket<WebSocketMessage<any>>({
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
        tap(() => this.sendPing()),
        catchError((err) => {
          console.log("Ping error:", err)
          return EMPTY
        }),
      )
      .subscribe()
  }

  private sendPing() {
    if (!this.socket$) {
      console.log("WebSocket is not connected. Ping not sent.")
      return
    }

    this.socket$.next(1)
  }

  send<T = any>(message: RequestMessage<T>) {
    if (!this.socket$) {
      console.log("WebSocket is not connected. Message not sent:", message)
      return
    }

    message.eid = message.eid ?? randomUUID()

    this.socket$.next(message as WebSocketMessage<T>)
  }

  on(type: MessageType, status: "error"): Observable<ResponseMessageError>
  on<T = any>(type: MessageType, status: Exclude<ResponseStatus, "error">): Observable<ResponseMessageSuccess<T>>
  on<T = any>(type: MessageType): Observable<ResponseMessage<T>>
  on<T = any>(type?: MessageType, status?: ResponseStatus): Observable<ResponseMessage<T>> {
    if (!this.socket$) {
      console.log("WebSocket is not initialized.")
      return EMPTY
    }

    return this.socket$.asObservable().pipe(
      takeUntil(this.disconnect$),
      filter((message): message is ResponseMessage<T> => typeof message === "object" && "status" in message),
      filter((message) => (type ? message.type === type : true)),
      filter((message) => (status ? message.status === status : true)),
      catchError((err) => {
        console.log("WebSocket message error:", err)
        return EMPTY
      }),
    )
  }

  disconnect() {
    console.log("Closing WebSocket connection")
    this.disconnect$.next()
    this.disconnect$.complete()
    this.socket$?.complete()
    this.socket$ = null
  }
}
