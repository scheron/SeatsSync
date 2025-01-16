import { WebSocket } from "ws";
import { logger } from "@/shared/logger";
import { getUser } from "@/services/auth/user";
import type { UserStatusEvent } from "@/types/events";

const subscribers = new Map<string, Set<WebSocket>>();

export function subscribe(ws: WebSocket, username: string) {
  if (!subscribers.has(username)) {
    subscribers.set(username, new Set());
  }
  subscribers.get(username)?.add(ws);
}

export function unsubscribe(ws: WebSocket, username: string) {
  subscribers.get(username)?.delete(ws);
  if (subscribers.get(username)?.size === 0) {
    subscribers.delete(username);
  }
}

export async function notifyStatusChange(event: UserStatusEvent) {
  const { username, status } = event;
  const subs = subscribers.get(username);
  
  if (!subs) return;

  try {
    // Get fresh user data
    const user = await getUser(username);
    
    // Notify all subscribers
    const message = {
      type: "auth/user_status",
      payload: {
        user,
        status,
      },
    };

    for (const ws of subs) {
      ws.send(JSON.stringify(message));
    }
  } catch (error) {
    logger.error(`Failed to notify status change for user ${username}:`, error);
  }
}
