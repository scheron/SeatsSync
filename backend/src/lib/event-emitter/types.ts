export type EventMap = Record<string, any>

export type CleanUpFn = () => void
export type EventCallback<T> = (data: T) => void

export type LogOperation = "subscribe" | "unsubscribe" | "unsubscribe_all" | "notify" | "destroy"

export type LogParams<Events extends EventMap> = {
  event?: keyof Events
  data?: any
  message?: string
}
