export interface LoginRequest {
  username: string
  secret: string
}

export interface LoginResponse {
  token: string
  user: {
    id: number
    username: string
  }
}
