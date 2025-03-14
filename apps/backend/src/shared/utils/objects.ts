/**
 * Filters an object based on a callback function.
 * @param obj - The object to filter.
 * @param filterCb - The callback function to filter the object.
 * @returns A new object with the filtered values.
 * @example
 * const obj = {a: 1, b: 2, c: 3}
 * const filtered = objectFilter(obj, (value, key) => value > 1)
 * // filtered = {b: 2, c: 3}
 */
export function objectFilter<T>(obj: T, filterCb: (value: T[keyof T], key: keyof T) => boolean): T {
  const result: T = {} as T

  for (const key in obj) {
    const value = obj?.[key]

    if (filterCb(value, key)) {
      result[key] = value
    }
  }

  return result
}
