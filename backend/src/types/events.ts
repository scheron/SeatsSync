export interface SeatUpdateEvent {
  cinemaId: string;
  seatId: string;
  status: "occupied" | "available";
  updatedBy: string;
  timestamp: number;
}

export interface UserStatusEvent {
  username: string;
  status: "online" | "offline" | "away";
  timestamp: number;
}
