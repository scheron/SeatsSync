import { getCinema } from "@/services/cinema/getCinema";
import { getHall } from "@/services/hall/getHall";
import { logger } from "@/shared/logger";
import type { GetCinemaRequest } from "@/types/cinema";

export async function getOne({ cinemaId }: GetCinemaRequest) {
  try {
    // Get cinema data
    const cinema = await getCinema(cinemaId);
    
    // Get associated hall data
    const hall = await getHall(cinema.hallId);
    
    return {
      cinema,
      hall,
    };
  } catch (error) {
    logger.error(`Failed to get cinema ${cinemaId}:`, error);
    throw error;
  }
}
