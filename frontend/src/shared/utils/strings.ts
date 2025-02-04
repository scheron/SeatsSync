type Position = "before" | "after" | "middle"

export function truncate(text: string, length: number = 10, pos: Position = "after", ellipsis = "..."): string {
  if (text.length <= length) return text
  if (length <= 0) return ellipsis

  if (pos === "before") return ellipsis + text.slice(-length)
  if (pos === "after") return text.slice(0, length) + ellipsis

  const halfLength = Math.floor(length / 2)
  return text.slice(0, halfLength) + ellipsis + text.slice(-halfLength)
}

function normalizeString(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}

export function matchesQuery(string: string, query: string): boolean {
  const normalizedString = normalizeString(string)
  const normalizedQuery = normalizeString(query)

  return normalizedString.includes(normalizedQuery)
}
