export const Subscriptions = {
  "cinemas.subscribe": "cinemas.subscribe",
  "cinemas.unsubscribe": "cinemas.unsubscribe",

  "user.subscribe": "user.subscribe",
  "user.unsubscribe": "user.unsubscribe",

  "hall.subscribe": "hall.subscribe",
  "hall.unsubscribe": "hall.unsubscribe",
} as const;

export type Subscription = keyof typeof Subscriptions;
