import {cinemaModel} from "@/models/cinema"
import {createSubscription} from "@/core/subscription"
import {logger} from "@/shared/lib/logger"

export const cinemaSubscription = createSubscription("cinemas.subscribe", async () => {
  try {
    const cinemas = await cinemaModel.getAll()
    return cinemas
  } catch (error) {
    logger.error({message: "Failed to fetch cinemas", error})
    return []
  }
})
