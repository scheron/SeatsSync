/**
 * Function type for debug logging in the EventEmitter.
 * Used to log subscription and emission events.
 */
export type DebugLog = (...args: any[]) => void

/**
 * Base type representing a map of event names to their payload types.
 * EventEmitter implementations can extend this with specific event definitions.
 */
export type EventMap = Record<string, any>

/**
 * Function returned from subscription methods that, when called,
 * will unsubscribe the listener.
 */
export type CleanUpFn = () => void

/**
 * The function signature for event listeners.
 *
 * @template T The event payload type
 * @param data The data emitted with the event
 * @returns void or a Promise that resolves to void
 */
export type EventCallback<T> = (data: T) => void | Promise<void>

/**
 * Available strategies for event emission.
 * - "parallel": All listeners execute concurrently (default)
 * - "sequential": Listeners execute one after another in priority order
 */
export type EmitStrategy = "parallel" | "sequential"

/**
 * Configuration options for event emission.
 */
export type EmitOptions = {
  /**
   * Strategy for event emission: "parallel" (default) or "sequential"
   */
  strategy?: EmitStrategy
}

/**
 * Internal type representing a subscriber with its priority.
 * Higher priority values execute earlier than lower ones.
 *
 * @template T The event payload type
 */
export type SubscriberWithPriority<T> = {
  /** The event callback function */
  callback: EventCallback<T>
  /** Higher numbers execute earlier (default: 0) */
  priority: number
}

/**
 * Interface defining the public API of an event emitter.
 *
 * @template Events A map of event names to their corresponding payload types
 */
export interface IEventEmitter<Events extends EventMap = EventMap> {
  /**
   * Returns a list of all currently registered event names.
   */
  eventNames: (keyof Events)[]

  /**
   * Checks whether the emitter has listeners for the given event.
   * @param event Event name
   * @returns `true` if any listeners are registered
   */
  has(event: keyof Events): boolean

  /**
   * Checks whether the emitter has no listeners at all.
   */
  isEmpty(): boolean

  /**
   * Removes all listeners for all events.
   */
  destroy(): void

  /**
   * Registers a listener for the specified event.
   *
   * @template E Event name
   * @param event Event name
   * @param callback Callback to invoke
   * @param priority Listener priority (higher number means earlier execution)
   * @returns A cleanup function that removes the listener
   */
  on<E extends keyof Events>(event: E, callback: EventCallback<Events[E]>, priority?: number): CleanUpFn

  /**
   * Registers a one-time listener that automatically unsubscribes after the first emit.
   *
   * @template E Event name
   * @param event Event name
   * @param callback Callback to invoke once
   * @param priority Listener priority (optional)
   */
  once<E extends keyof Events>(event: E, callback: EventCallback<Events[E]>, priority?: number): void

  /**
   * Removes a specific listener or all listeners for a given event.
   *
   * @template E Event name
   * @param event Event name
   * @param callback Specific listener to remove (optional)
   */
  off<E extends keyof Events>(event: E, callback?: EventCallback<Events[E]>): void

  /**
   * Emits an event with the provided data.
   *
   * @template E Event name
   * @param event Event name
   * @param data Event payload
   * @param options Emit strategy: "parallel" (default) or "sequential"
   */
  emit<E extends keyof Events>(event: E, data: Events[E], options?: EmitOptions): Promise<void>

  /**
   * Returns a promise that resolves when the given event is emitted.
   *
   * @template E Event name
   * @param event Event name
   * @returns Promise that resolves with the event payload
   */
  toPromise<E extends keyof Events>(event: E): Promise<Events[E]>
}

/**
 * Interface for the internal subscription management class.
 * Represents a collection of subscribers for a single event type.
 *
 * @template T Payload type for the event
 */
export interface IEventSubscription<T> {
  /**
   * The string name of the event type
   */
  type: string

  /**
   * Ordered list of subscribers with their priorities
   */
  subscribers: SubscriberWithPriority<T>[]
}
