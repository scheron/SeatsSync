export type User = {
  id?: number
  username: string
  secret: string
  token?: string
  recovery_phrase?: string
}

export type Candidate = {
  username: string
  secret: string
  qr_url: string
  created_at: number
}

export type UserStatus = "guest" | "user"
