/**
 * Inserts an item into an array in descending order based on a numeric key.
 *
 * @template T
 * @param array The array to insert into
 * @param item The item to insert
 * @param getKey A function to get the sorting key
 */
export function insertSorted<T>(array: T[], item: T, getKey: (item: T) => number): void {
  let i = 0
  const key = getKey(item)
  while (i < array.length && getKey(array[i]) >= key) {
    i++
  }
  array.splice(i, 0, item)
}

/**
 * Removes the first item from the array that matches the predicate.
 *
 * @template T
 * @param array The array to remove from
 * @param match Predicate function to find the item
 */
export function removeFromArray<T>(array: T[], match: (item: T) => boolean): void {
  const index = array.findIndex(match)
  if (index !== -1) array.splice(index, 1)
}
