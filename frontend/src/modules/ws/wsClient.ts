import {randomUUID} from "@/utils/random"
import {BehaviorSubject, catchError, distinctUntilChanged, EMPTY, filter, interval, map, Observable, Subject, takeUntil, tap} from "rxjs"
import {webSocket, WebSocketSubject} from "rxjs/webSocket"

import type {
  ConnectionState,
  MessageType,
  RequestMessage,
  ResponseMessage,
  ResponseMessageError,
  ResponseMessageSuccess,
  ResponseStatus,
  WebSocketMessage,
} from "./types"

type State = {
  connectionState: ConnectionState
  reconnectAttempts: number
  error: string | null
}

export class WebSocketClient {
  private socket$: WebSocketSubject<WebSocketMessage<any>> | null = null
  private readonly baseReconnectInterval = 1000
  private readonly maxReconnectAttempts = 5
  private readonly pingInterval = 2000
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null

  private readonly disconnect$ = new Subject<void>()
  private readonly state$ = new BehaviorSubject<State>({
    connectionState: "disconnected",
    reconnectAttempts: 0,
    error: null,
  })

  constructor(private readonly url: string) {
    this.startPing()
    this.connect(true)
  }

  private startPing() {
    interval(this.pingInterval)
      .pipe(
        takeUntil(this.disconnect$),
        filter(() => this.state$.getValue().connectionState === "connected" && this.socket$ !== null),
        tap(() => this.socket$ && this.socket$.next(1)),
        catchError(() => EMPTY),
      )
      .subscribe()
  }

  private connect(isInitialConnection = false) {
    if (["connecting", "reconnecting"].includes(this.state$.getValue().connectionState)) return

    if (this.socket$) {
      this.socket$.complete()
      this.socket$ = null
    }

    this.updateState({connectionState: isInitialConnection ? "connecting" : "reconnecting"})

    this.socket$ = webSocket<WebSocketMessage<any>>({
      url: this.url,
      openObserver: {
        next: () => {
          this.updateState({connectionState: "connected", reconnectAttempts: 0, error: null})
        },
      },
      closeObserver: {
        next: () => {
          this.updateState({connectionState: "disconnected"})
          this.reconnect()
        },
      },
    })

    this.socket$.subscribe({
      error: (error) => {
        if (this.state$.getValue().connectionState === "reconnecting") return

        this.updateState({connectionState: "disconnected", error: error?.message || "WebSocket error occurred"})
        this.reconnect()
      },
    })
  }

  private updateState(patch: Partial<State>) {
    const currentState = this.state$.getValue()
    const newState = {...currentState, ...patch}

    this.state$.next(newState)
  }

  private reconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    const {reconnectAttempts} = this.state$.getValue()

    if (reconnectAttempts >= this.maxReconnectAttempts) {
      this.updateState({connectionState: "disconnected", error: "Max reconnect attempts reached"})
      return
    }

    const nextAttempt = reconnectAttempts + 1
    const delay = Math.min(this.baseReconnectInterval * Math.pow(2, nextAttempt - 1), 10000)

    this.updateState({reconnectAttempts: nextAttempt})

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null
      this.connect()
    }, delay)
  }

  send<T = any>(message: RequestMessage<T>) {
    if (!this.socket$ || this.state$.getValue().connectionState !== "connected") return

    message.eid = message.eid ?? randomUUID()
    this.socket$.next(message as WebSocketMessage<T>)
  }

  on(type: MessageType, status: "error"): Observable<ResponseMessageError>
  on<T = any>(type: MessageType, status: Exclude<ResponseStatus, "error">): Observable<ResponseMessageSuccess<T>>
  on<T = any>(type: MessageType): Observable<ResponseMessage<T>>
  on<T = any>(type?: MessageType, status?: ResponseStatus): Observable<ResponseMessage<T>> {
    if (!this.socket$) return EMPTY

    return this.socket$.pipe(
      takeUntil(this.disconnect$),
      filter((message): message is ResponseMessage<T> => typeof message === "object" && "status" in message),
      filter((message) => (type && type !== "*" ? message.type === type : true)),
      filter((message) => (status ? message.status === status : true)),
      catchError((err) => {
        console.log("WebSocket message error:", err)
        return EMPTY
      }),
    )
  }

  get connectionState(): Observable<ConnectionState> {
    return this.state$.pipe(
      map((state) => state.connectionState),
      distinctUntilChanged(),
    )
  }

  get error(): Observable<string | null> {
    return this.state$.pipe(
      map((state) => state.error),
      distinctUntilChanged(),
    )
  }

  reconnectForce() {
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    if (this.socket$) {
      this.socket$.complete()
      this.socket$ = null
    }

    this.updateState({
      connectionState: "disconnected",
      reconnectAttempts: 0,
      error: null,
    })

    this.connect()
  }

  disconnect() {
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    this.disconnect$.next()
    this.disconnect$.complete()
    this.socket$?.complete()
    this.socket$ = null
    this.updateState({connectionState: "disconnected"})
  }
}
