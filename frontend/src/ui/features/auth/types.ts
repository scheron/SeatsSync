export type UserStatus = "candidate" | "user"

export type UserAuthStartResponse = {username: string; qr_url: string; status: UserStatus}
