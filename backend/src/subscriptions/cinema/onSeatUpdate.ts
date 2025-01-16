import { WebSocket } from "ws";
import { logger } from "@/shared/logger";
import { getCinema } from "@/services/cinema/getCinema";
import { getHall } from "@/services/hall/getHall";
import type { SeatUpdateEvent } from "@/types/events";

const subscribers = new Map<string, Set<WebSocket>>();

export function subscribe(ws: WebSocket, cinemaId: string) {
  if (!subscribers.has(cinemaId)) {
    subscribers.set(cinemaId, new Set());
  }
  subscribers.get(cinemaId)?.add(ws);
}

export function unsubscribe(ws: WebSocket, cinemaId: string) {
  subscribers.get(cinemaId)?.delete(ws);
  if (subscribers.get(cinemaId)?.size === 0) {
    subscribers.delete(cinemaId);
  }
}

export async function notifySeatUpdate(event: SeatUpdateEvent) {
  const { cinemaId, seatId } = event;
  const subs = subscribers.get(cinemaId);
  
  if (!subs) return;

  try {
    // Get fresh data
    const cinema = await getCinema(cinemaId);
    const hall = await getHall(cinema.hallId);
    
    // Notify all subscribers
    const message = {
      type: "cinema/seat_update",
      payload: {
        cinema,
        hall,
        updatedSeatId: seatId,
      },
    };

    for (const ws of subs) {
      ws.send(JSON.stringify(message));
    }
  } catch (error) {
    logger.error(`Failed to notify seat update for cinema ${cinemaId}:`, error);
  }
}
