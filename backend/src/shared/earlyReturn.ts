import type {Response} from "express"

function isFunction<T>(value: T | (() => T | Promise<T>)): value is () => T | Promise<T> {
  return typeof value === "function"
}

export async function earlyReturn<T>(
  condition: T | (() => T | Promise<T>),
  conditionMatchedCb: () => unknown | Promise<unknown>,
): Promise<boolean> {
  const result = isFunction(condition) ? await condition() : condition

  if (Boolean(result)) {
    await conditionMatchedCb()
    return true
  }

  return false
}

export async function earlyReturnResponse<T>(
  res: Response,
  condition: T | (() => T | Promise<T>),
  status: number,
  error: string,
): Promise<boolean> {
  return earlyReturn(condition, () => res.status(status).json({error}))
}
