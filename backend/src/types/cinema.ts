import type { Cinema, Hall } from "@prisma/client";

export interface GetCinemaRequest {
  cinemaId: string;
}

export interface GetCinemaResponse {
  cinema: Cinema;
  hall: Hall;
}

export interface CinemaSubscription {
  type: "cinema/subscribe";
  cinemaId: string;
}

export interface CinemaUnsubscription {
  type: "cinema/unsubscribe";
  cinemaId: string;
}
