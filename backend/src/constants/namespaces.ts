export const Namespace = {
  System: "System",
  Auth: "Auth",
  Cinema: "Cinema",
  Hall: "Hall",
  Seat: "Seat",
} as const

export type Namespace = (typeof Namespace)[keyof typeof Namespace]
