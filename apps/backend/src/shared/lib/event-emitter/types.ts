export type EventMap = Record<string, any>

export type CleanUpFn = () => void
export type EventCallback<T> = (data: T) => void | Promise<void>

export type LogParams<Events extends EventMap> = {
  event?: keyof Events
  data?: any
  message?: string
}

export type DebugLog = (...args: any[]) => void

export interface IEventEmitter<Events extends EventMap = EventMap> {
  eventNames: (keyof Events)[]
  has(event: keyof Events): boolean
  isEmpty(): boolean
  destroy(): void
  on<E extends keyof Events>(event: E, callback: EventCallback<Events[E]>): CleanUpFn
  once<E extends keyof Events>(event: E, callback: EventCallback<Events[E]>): void
  off<E extends keyof Events>(event: E, callback?: EventCallback<Events[E]>): void
  emit<E extends keyof Events>(event: E, data: Events[E]): Promise<void>
  toPromise<E extends keyof Events>(event: E): Promise<Events[E]>
}

export interface IEventSubscription<T> {
  type: string
  subscribers: Set<EventCallback<T>>
}
