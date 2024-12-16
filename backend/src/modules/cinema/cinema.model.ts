import {DB} from "@/core/db"
import {logger} from "@/shared/logger"
import {Cinema} from "./cinema.types"

const db = new DB("cinema")

export async function getAllCinemas(): Promise<Cinema[]> {
  const result = await db.findAll<Cinema>()

  if (!result.success) {
    logger.error({message: "Failed to fetch cinemas", error: result.error})
    throw new Error(result.error || "Failed to fetch cinemas")
  }

  return result.data!
}

export async function getCinemaById(id: number): Promise<Cinema> {
  const result = await db.findOne<Cinema>({id})

  if (!result.success) {
    logger.error({message: `Failed to fetch cinema with id ${id}`, error: result.error})
    throw new Error(result.error || `Cinema with id ${id} not found`)
  }

  return result.data!
}

export async function createCinema(data: {name: string; color: string}): Promise<Cinema> {
  const result = await db.create<typeof data, Cinema>(data)

  if (!result.success) {
    logger.error({message: "Failed to create cinema", error: result.error})
    throw new Error(result.error || "Failed to create cinema")
  }

  return result.data!
}

export async function updateCinema(id: number, data: {name?: string; color?: string}): Promise<Cinema> {
  const result = await db.update<typeof data, Cinema>(id, data)

  if (!result.success) {
    logger.error({message: `Failed to update cinema with id ${id}`, error: result.error})
    throw new Error(result.error || `Failed to update cinema with id ${id}`)
  }

  return result.data!
}

export async function deleteCinema(id: number): Promise<void> {
  const result = await db.delete(id)

  if (!result.success) {
    logger.error({message: `Failed to delete cinema with id ${id}`, error: result.error})
    throw new Error(result.error || `Failed to delete cinema with id ${id}`)
  }
}
