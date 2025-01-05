export function filterObject<T>(obj: Record<string, T>, filterCb: (value: T, key: string) => boolean): Record<string, T> {
  const result: Record<string, T> = {}

  for (const key in obj) {
    const value = obj?.[key] as T

    if (filterCb(value, key)) {
      result[key] = value
    }
  }

  return result
}
