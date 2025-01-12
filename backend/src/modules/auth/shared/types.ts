export type User = {
  id?: number
  username: string
  secret: string
  token?: string
  recovery_phrase?: string
}

export type AuthMessageType = "auth.status" | "auth.login" | "auth.register" | "auth.logout"
