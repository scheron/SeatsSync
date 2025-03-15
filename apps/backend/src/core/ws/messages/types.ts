export type MessageHandler<TRequest = unknown, TResponse = unknown> = (
  data: TRequest,
  meta: {
    eid: string
    ts: number
  },
) => Promise<TResponse>

export type MessageHandlers<T extends string> = {
  [K in T]: MessageHandler<any, any>
}

export type MessageValidator<T> = (data: unknown) => T
