export type User = {
  id?: number
  username: string
  secret: string
  token?: string
  recovery_phrase?: string
}

export type AuthMessageType = "auth.start" | "auth.register" | "auth.login" | "auth.update_user"
