export type User = {
  username: string
  secret: string
  token: string | null
  recovery_phrase: string | null
}

export type AuthMessageType = "auth.start" | "auth.register" | "auth.login"
