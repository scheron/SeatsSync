import { WebSocket } from "ws";
import { logger } from "@/shared/logger";
import { getUser } from "./auth.service";
import { handleLogin } from "./auth.methods";
import type { AuthMessage } from "./auth.types";

export async function handleMessage(ws: WebSocket, message: AuthMessage) {
  try {
    switch (message.type) {
      case "auth/login":
        await handleLogin(ws, message);
        break;
      default:
        logger.warn(`Unknown message type: ${message.type}`);
    }
  } catch (error) {
    logger.error("Error handling auth message:", error);
  }
}

export async function handleLogin(ws: WebSocket, message: AuthMessage) {
  const { username, code } = message.payload;
  try {
    const user = await getUser(username);
    // Add your login logic here
    logger.info(`User ${username} logged in via WebSocket`);
  } catch (error) {
    logger.error(`Login failed for user ${username}:`, error);
  }
}
