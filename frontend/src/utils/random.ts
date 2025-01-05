export function getRandomItem(list: any[]) {
  return list[Math.floor(Math.random() * list.length)] ?? null
}

export function generateRandomString(length = 8) {
  const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

  return Array.from({length})
    .map(() => getRandomItem([...abc]))
    .join("")
}

export function randomUUID(length = 8): string {
  // @ts-ignore
  if (randomUUID?.idCounter === undefined) randomUUID.idCounter = 0

  // @ts-ignore
  return generateRandomString(length).concat("-", String(randomUUID.idCounter++))
}
