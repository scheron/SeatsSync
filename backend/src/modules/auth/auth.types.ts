export type User = {
  id: number
  username: string
  secret: string
  token: string | null
  recovery_phrase: string | null
}
