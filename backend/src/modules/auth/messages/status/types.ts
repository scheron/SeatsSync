export interface StatusResponse {
  status: "guest" | "user"
  data: {
    username: string
    id: number
  } | null
}
