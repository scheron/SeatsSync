export type DebugLog = (...args: any[]) => void

export type EventMap = Record<string, any>

export type CleanUpFn = () => void
export type EventCallback<T> = (data: T) => void | Promise<void>

export type EmitStrategy = "parallel" | "sequential"
export type EmitOptions = {strategy?: EmitStrategy}

export type SubscriberWithPriority<T> = {callback: EventCallback<T>; priority: number}

export interface IEventEmitter<Events extends EventMap = EventMap> {
  eventNames: (keyof Events)[]
  has(event: keyof Events): boolean
  isEmpty(): boolean
  destroy(): void
  on<E extends keyof Events>(event: E, callback: EventCallback<Events[E]>, priority?: number): CleanUpFn
  once<E extends keyof Events>(event: E, callback: EventCallback<Events[E]>, priority?: number): void
  off<E extends keyof Events>(event: E, callback?: EventCallback<Events[E]>): void
  emit<E extends keyof Events>(event: E, data: Events[E], options?: EmitOptions): Promise<void>
  toPromise<E extends keyof Events>(event: E): Promise<Events[E]>
}

export interface IEventSubscription<T> {
  type: string
  subscribers: SubscriberWithPriority<T>[]
}
