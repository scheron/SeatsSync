import {hallModel} from "@/models/hall"
import {createSubscription} from "@/core/subscription"
import {logger} from "@/shared/lib/logger"

export const hallSubscription = createSubscription<{id: number}>("hall.subscribe", async (_, message) => {
  try {
    const {id} = message.data
    return await hallModel.getOne(id)
  } catch (error) {
    logger.error({message: "Failed to fetch halls", error})
    return []
  }
})
