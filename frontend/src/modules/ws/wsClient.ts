import {Logger} from "@/utils/logger"
import {randomUUID} from "@/utils/random"
import {BehaviorSubject, catchError, distinctUntilChanged, EMPTY, filter, interval, map, ReplaySubject, Subject, takeUntil, tap} from "rxjs"
import {webSocket} from "rxjs/webSocket"

import type {Observable} from "rxjs"
import type {WebSocketSubject} from "rxjs/webSocket"
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
  connectAttempts: number
}

export class WebSocketClient {
  private socket$: WebSocketSubject<WebSocketMessage<any>> | null = null
  private readonly messages$ = new ReplaySubject<WebSocketMessage<any>>(1)
  private readonly disconnect$ = new Subject<void>()
  private readonly state$ = new BehaviorSubject<State>({connectionState: "INITIALIZED", connectAttempts: 0})

  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private readonly maxReconnectAttempts = 10
  private readonly pingInterval = 4000
  private prevState: State | null = null
  private readonly logger = new Logger(false)

  constructor(private readonly url: string) {
    this.logger.info("[WebSocket] Initializing with URL:", url)
    this.startPing()
    this.connect()
  }

  private startPing() {
    interval(this.pingInterval)
      .pipe(
        takeUntil(this.disconnect$),
        filter(() => this.state$.getValue().connectionState === "CONNECTED" && this.socket$ !== null),
        tap(() => this.socket$ && this.socket$.next(1)),
        tap(() => this.logger.info("[WebSocket] PING")),
        catchError((error) => {
          this.logger.error("[WebSocket] Ping error:", error)
          return EMPTY
        }),
      )
      .subscribe()
  }

  private connect() {
    if (this.socket$) {
      this.socket$.complete()
      this.socket$ = null
    }

    const isReconnecting = this.state$.getValue().connectionState === "RECONNECTING"

    this.updateState({
      connectionState: isReconnecting ? "RECONNECTING" : "CONNECTING",
      connectAttempts: isReconnecting ? this.state$.getValue().connectAttempts : 0,
    })

    this.socket$ = webSocket<WebSocketMessage<any>>({
      url: this.url,
      openObserver: {
        next: () => {
          this.logger.info("[WebSocket] Connected successfully")
          this.updateState({connectionState: "CONNECTED", connectAttempts: 0})
        },
      },
    })

    this.socket$.subscribe({
      next: (message) => {
        if (typeof message === "number") {
          this.logger.info("[WebSocket] PONG")
          return
        }

        if (typeof message === "object") {
          this.logger.info("[WebSocket] Message received:", {
            type: message.type,
            status: "status" in message ? message.status : undefined,
            eid: message.eid,
            data: message.data,
          })
        }

        this.messages$.next(message)
      },
      error: (error) => {
        this.logger.error("[WebSocket] Connection error:", error)
        this.reconnectClient()
      },
      complete: () => {
        this.logger.info("[WebSocket] Connection closed")
      },
    })
  }

  private reconnectClient() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    const {connectAttempts} = this.state$.getValue()
    const attempts = connectAttempts + 1

    if (attempts >= this.maxReconnectAttempts) {
      this.logger.warn("[WebSocket] Max reconnect attempts reached")
      this.updateState({connectionState: "DISCONNECTED"})
      return
    }

    const minTimeout = 2_000
    const maxTimeout = 20_000
    const backoffFactor = 1.2
    const delay = Math.trunc(Math.min(minTimeout * backoffFactor ** attempts, maxTimeout))

    this.logger.info(`[WebSocket] Scheduling reconnect:`, {
      delay,
      attempt: attempts,
      maxAttempts: this.maxReconnectAttempts,
    })

    this.updateState({connectionState: "RECONNECTING", connectAttempts: attempts})

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null
      this.connect()
    }, delay)
  }

  private updateState(patch: Partial<State>) {
    const currentState = this.state$.getValue()
    const newState = {...currentState, ...patch}

    this.prevState = currentState
    this.state$.next(newState)
  }

  send<T = any>(message: RequestMessage<T>) {
    if (!this.socket$ || this.state$.getValue().connectionState !== "CONNECTED") {
      this.logger.warn("[WebSocket] Cannot send message: socket not connected")
      return
    }

    message.eid = message?.eid ?? randomUUID()

    this.logger.info("[WebSocket] Sending message:", {
      type: message.type,
      eid: message.eid,
      data: message.data,
    })

    this.socket$.next(message as WebSocketMessage<T>)
  }

  on(type: MessageType, status: "error"): Observable<ResponseMessageError>
  on<T = any>(type: MessageType, status: Exclude<ResponseStatus, "error">): Observable<ResponseMessageSuccess<T>>
  on<T = any>(type: MessageType): Observable<ResponseMessage<T>>
  on<T = any>(type?: MessageType, status?: ResponseStatus | ResponseStatus[]): Observable<ResponseMessage<T>> {
    this.logger.info("[WebSocket] Subscribing to messages:", {type, status})

    const statuses = Array.isArray(status) ? status : [status]

    return this.messages$.pipe(
      filter((message): message is ResponseMessage<T> => typeof message === "object" && "status" in message),
      filter((message) => (type && type !== "*" ? message.type === type : true)),
      filter((message) => (status ? statuses.includes(message.status) : true)),
      catchError((err) => {
        this.logger.error("[WebSocket] Message processing error:", err)
        return EMPTY
      }),
    )
  }

  get state(): ConnectionState {
    return this.state$.getValue().connectionState
  }

  get connectionState(): Observable<{state: ConnectionState; prevState: ConnectionState | null}> {
    return this.state$.pipe(
      map((state) => state.connectionState),
      distinctUntilChanged(),
      tap((state) => this.logger.info("[WebSocket] Connection state changed:", state)),
      map((state) => ({state, prevState: this.prevState?.connectionState ?? null})),
    )
  }

  reconnect() {
    this.logger.info("[WebSocket] reconnecting...")

    if (this.socket$) {
      this.socket$.complete()
      this.socket$ = null
    }

    this.updateState({connectionState: "RECONNECTING", connectAttempts: 0})
    this.connect()
  }

  destroy() {
    this.logger.info("[WebSocket] Destroying client...")

    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    this.disconnect$.next()
    this.disconnect$.complete()
    this.messages$.complete()
    this.socket$?.complete()
    this.socket$ = null
    this.updateState({connectionState: "DESTROYED", connectAttempts: 0})
  }
}
