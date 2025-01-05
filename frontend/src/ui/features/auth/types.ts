type UserStatus = "candidate" | "user"

export type AuthStartMsg = {username: string; qr_url: string; status: UserStatus}
