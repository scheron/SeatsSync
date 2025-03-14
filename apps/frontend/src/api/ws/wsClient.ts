import {BehaviorSubject, catchError, distinctUntilChanged, EMPTY, filter, interval, map, ReplaySubject, Subject, takeUntil, tap} from "rxjs"
import {webSocket} from "rxjs/webSocket"
import {Logger} from "@/lib/logger"
import {randomUUID} from "@/utils/random"

import type {Observable, Subscription} from "rxjs"
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

type WebSocketClientConfig = {
  maxReconnectAttempts?: number
  pingInterval?: number
  minReconnectDelay?: number
  maxReconnectDelay?: number
  backoffFactor?: number
  debug?: boolean
}

export class WebSocketClient {
  private socket$: WebSocketSubject<WebSocketMessage<any>> | null = null
  private socketSubscription?: Subscription
  private pingSubscription?: Subscription

  private readonly messages$ = new ReplaySubject<WebSocketMessage<any>>(1)
  private readonly destroy$ = new Subject<void>()
  private readonly state$ = new BehaviorSubject<State>({connectionState: "INITIALIZED", connectAttempts: 0})

  private reconnectTimer: ReturnType<typeof setTimeout> | null = null

  private readonly maxReconnectAttempts: number
  private readonly pingInterval: number
  private readonly minReconnectDelay: number
  private readonly maxReconnectDelay: number
  private readonly backoffFactor: number

  private prevState: State | null = null
  private readonly logger: Logger

  private isManualClose: boolean = false
  private messageQueue: RequestMessage<any>[] = []

  constructor(
    private readonly url: string,
    config: WebSocketClientConfig = {},
  ) {
    this.maxReconnectAttempts = config.maxReconnectAttempts ?? 10
    this.pingInterval = config.pingInterval ?? 4000
    this.minReconnectDelay = config.minReconnectDelay ?? 2000
    this.maxReconnectDelay = config.maxReconnectDelay ?? 20000
    this.backoffFactor = config.backoffFactor ?? 1.2
    this.isManualClose = false

    this.logger = new Logger(config.debug ?? false)
    this.logger.info("[WebSocket] Initializing with URL:", url)

    this.startPing()
    this.connect()
  }

  private startPing() {
    this.pingSubscription?.unsubscribe()

    this.pingSubscription = interval(this.pingInterval)
      .pipe(
        takeUntil(this.destroy$),
        filter(() => this.state$.getValue().connectionState === "CONNECTED" && this.socket$ !== null),
        tap(() => this.socket$?.next(1)),
        catchError(() => EMPTY),
      )
      .subscribe()
  }

  private connect() {
    this.logger.info("[WebSocket] Connecting...")

    this.socket$?.complete()
    this.socket$ = null

    this.socketSubscription?.unsubscribe()
    this.socketSubscription = undefined

    const current = this.state$.getValue()
    const isReconnecting = current.connectionState === "RECONNECTING"

    this.updateState({
      connectionState: isReconnecting ? "RECONNECTING" : "CONNECTING",
      connectAttempts: isReconnecting ? current.connectAttempts : 0,
    })

    this.socket$ = webSocket<WebSocketMessage<any>>({
      url: this.url,
      openObserver: {
        next: () => {
          this.logger.info("[WebSocket] Connected successfully")
          this.updateState({connectionState: "CONNECTED", connectAttempts: 0})

          this.flushQueue()
        },
      },
      closeObserver: {
        next: (event) => {
          this.logger.info("[WebSocket] Connection closed by server:", event.code, event.reason)
          if (!this.isManualClose) this.reconnectClient()
        },
      },
    })

    this.socketSubscription = this.socket$.subscribe({
      next: (message) => {
        if (typeof message === "number") return

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
        this.logger.info("[WebSocket] Connection completed")
        // this.reconnectClient()
      },
    })
  }

  private flushQueue() {
    while (this.messageQueue.length > 0 && this.socket$ && this.state$.getValue().connectionState === "CONNECTED") {
      const msg = this.messageQueue.shift()
      if (msg) {
        this.socket$.next(msg as WebSocketMessage<any>)
      }
    }
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

    const delay = Math.trunc(Math.min(this.minReconnectDelay * this.backoffFactor ** attempts, this.maxReconnectDelay))

    this.logger.info("[WebSocket] Scheduling reconnect:", {
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

  send<T = any>(message: RequestMessage<T>) {
    if (!message.eid) {
      message.eid = randomUUID()
    }

    const state = this.state$.getValue().connectionState
    if (!this.socket$ || state !== "CONNECTED") {
      this.logger.warn("[WebSocket] Socket not connected, queueing message", {
        type: message.type,
        eid: message.eid,
      })
      this.messageQueue.push(message)
      return
    }

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

    const statuses = Array.isArray(status) ? status : status ? [status] : []

    return this.messages$.pipe(
      filter((msg): msg is ResponseMessage<T> => typeof msg === "object" && "status" in msg),
      filter((msg) => (type && type !== "*" ? msg.type === type : true)),
      filter((msg) => (statuses.length ? statuses.includes(msg.status) : true)),
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
      map((s) => s.connectionState),
      distinctUntilChanged(),
      tap((st) => this.logger.info("[WebSocket] Connection state changed:", st)),
      map((st) => ({
        state: st,
        prevState: this.prevState?.connectionState ?? null,
      })),
    )
  }

  reconnect() {
    this.logger.info("[WebSocket] Manual reconnect...")

    this.isManualClose = true
    this.socket$?.complete()
    this.socket$ = null

    this.updateState({connectionState: "CONNECTING", connectAttempts: 0})
    this.connect()
  }

  destroy() {
    this.logger.info("[WebSocket] Destroying client...")

    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    this.destroy$.next()
    this.destroy$.complete()

    this.messages$.complete()

    this.socket$?.complete()
    this.socket$ = null
    this.socketSubscription?.unsubscribe()
    this.socketSubscription = undefined

    this.pingSubscription?.unsubscribe()
    this.pingSubscription = undefined

    this.updateState({connectionState: "DESTROYED", connectAttempts: 0})
  }

  private updateState(patch: Partial<State>) {
    const currentState = this.state$.getValue()
    const newState = {...currentState, ...patch}

    if (currentState.connectionState === newState.connectionState && currentState.connectAttempts === newState.connectAttempts) return

    this.prevState = currentState
    this.state$.next(newState)
  }
}
