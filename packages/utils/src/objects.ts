/**
 * Filters an object based on a callback function.
 * @param obj - The object to filter.
 * @param filterCb - The callback function to filter the object.
 * @returns A new object with the filtered values.
 * @example
 * const obj = {a: 1, b: 2, c: 3}
 * const filteredObj = objectFilter(obj, (value, key) => value > 1)
 * // filteredObj = {b: 2, c: 3}
 */
export function objectFilter<T>(
  obj: Record<string, T>,
  filterCb: (value: T, key: string) => boolean,
): Record<string, T> {
  const result: Record<string, T> = {};

  for (const key in obj) {
    const value = obj?.[key] as T;

    if (filterCb(value, key)) {
      result[key] = value;
    }
  }

  return result;
}
