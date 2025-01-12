export interface RegisterRequest {
  username: string
  secret: string
}

export interface RegisterResponse {
  token: string
  user: {
    id: number
    username: string
  }
}
