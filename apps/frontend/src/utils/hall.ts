import type {Seat} from "@/types/cinema"

/**
 * Get the character for a row
 * @param rowId - The id of the row; Starts from 1
 * @returns The character for the row
 * @example
 * getRowChar(1) // "A"
 * getRowChar(26) // "Z"
 * getRowChar(27) // "AA"
 * getRowChar(52) // "AZ"
 */
export function getSeatRowChar(rowId: number) {
  let rowChar = ""

  rowId = rowId - 1

  while (rowId >= 0) {
    rowChar = String.fromCharCode((rowId % 26) + 65) + rowChar
    rowId = Math.floor(rowId / 26) - 1
  }

  return rowChar
}

/**
 * Create a matrix of seats
 * @param seats - The seats to create the matrix from
 * @returns The matrix of seats sorted by row and place
 */
export function createSeatsSchema(seats: Seat[]): Seat[][] {
  const rowsMap: Record<number, Seat[]> = {}

  seats.forEach((seat) => {
    if (!rowsMap[seat.row]) rowsMap[seat.row] = []
    rowsMap[seat.row].push(seat)
  })

  const sortedRowNumbers = Object.keys(rowsMap)
    .map(Number)
    .sort((a, b) => a - b)

  const matrix: Seat[][] = sortedRowNumbers.map((rowNumber) => {
    const rowSeats = rowsMap[rowNumber]
    rowSeats.sort((a, b) => a.place - b.place)
    return rowSeats
  })

  return matrix
}

/**
 * Calculate the size of the hall
 * @param seats - The seats to calculate the size from
 * @returns The width and height of the hall
 */
export function calculateHallSize(seats: Seat[]) {
  let minX = Number.POSITIVE_INFINITY
  let minY = Number.POSITIVE_INFINITY
  let maxX = Number.NEGATIVE_INFINITY
  let maxY = Number.NEGATIVE_INFINITY

  for (const seat of seats) {
    minX = Math.min(minX, seat.x)
    minY = Math.min(minY, seat.y)
    maxX = Math.max(maxX, seat.x + seat.width)
    maxY = Math.max(maxY, seat.y + seat.height)
  }

  if (minX === Number.POSITIVE_INFINITY || minY === Number.POSITIVE_INFINITY) {
    return {width: 0, height: 0}
  }

  return {width: maxX - minX, height: maxY - minY} as const
}
