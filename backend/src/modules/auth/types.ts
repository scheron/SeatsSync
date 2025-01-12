// Core types
export type User = {
  id: number
  username: string
  secret: string
  token?: string
  recovery_phrase?: string
}

// Method types
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

// Subscription types
export type UserStatusSubscriptionData = {
  type: "login" | "logout"
  user: {
    id: number
    username: string
  }
}

export type AuthMessageType = "auth.status"
