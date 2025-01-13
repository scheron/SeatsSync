export type User = {
  id: number
  username: string
  secret: string
  token?: string
  recovery_phrase?: string
}

export type LoginRequest = {
  username: string
  secret: string
}

export type LoginResponse = {
  token: string
  user: {
    id: number
    username: string
  }
}

export type RegisterRequest = {
  username: string
  secret: string
}

export type RegisterResponse = {
  token: string
  user: {
    id: number
    username: string
  }
}

export type StatusResponse = {
  status: "guest" | "user"
  data: {
    username: string
    id: number
  } | null
}

export type UserStatusSubscriptionData = {
  type: "login" | "logout"
  user: {
    id: number
    username: string
  }
}

export type AuthMessageType = "auth.status"
