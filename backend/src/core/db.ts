import {PrismaClient} from "@prisma/client"
import {logger} from "@/shared/logger"
import {LRU} from "@/shared/lru"

const CACHE_TTL = 300_000
const CACHE_MAX_SIZE = 100

export const prisma = new PrismaClient()

type DBResponse<T> = {success: boolean; data: T | null; error?: string}

export interface IDB {
  findAll<T>(): Promise<DBResponse<T[]>>
  findOne<R>(where: Record<string, unknown>): Promise<DBResponse<R>>
  create<T, R>(data: T): Promise<DBResponse<R>>
  update<T, R>(id: number, data: T): Promise<DBResponse<R>>
  delete(id: number): Promise<DBResponse<null>>
}

export class DB implements IDB {
  private cache: LRU<string, unknown>

  constructor(private tableName: string) {
    this.cache = new LRU<string, unknown>(CACHE_MAX_SIZE)
  }

  async findAll<R>(): Promise<DBResponse<R[]>> {
    const cacheKey = this.getCacheKey("all")
    const cached = this.cache.get(cacheKey)

    if (cached) {
      logger.info({message: `Cache hit for ${cacheKey}`})
      return {success: true, data: cached as R[]}
    }

    try {
      const result = await prisma[this.tableName].findMany()
      this.cache.set(cacheKey, result, CACHE_TTL)

      logger.info({message: `Retrieved new records from ${this.tableName}`, data: result})

      return {success: true, data: result}
    } catch (error: any) {
      logger.error({message: `Failed to fetch all records from ${this.tableName}`, error: error.message})
      return {success: false, data: null, error: "Database error"}
    }
  }

  async findOne<R>(where: Record<string, any>): Promise<DBResponse<R>> {
    const cacheKey = this.getCacheKey("find", JSON.stringify(where))
    const cached = this.cache.get(cacheKey)

    if (cached) {
      logger.info({message: `Cache hit for ${cacheKey}`})
      return {success: true, data: cached as R}
    }

    try {
      const result = await prisma[this.tableName].findUnique({where})

      if (!result) {
        logger.info({message: `Record not found in ${this.tableName} for query ${JSON.stringify(where)}`})
        return {success: false, data: null, error: "Record not found"}
      }

      this.cache.set(cacheKey, result, CACHE_TTL)
      logger.info({message: `Retrieved record from ${this.tableName} for query ${JSON.stringify(where)}`, data: result})

      return {success: true, data: result}
    } catch (error: any) {
      logger.error({
        message: `Failed to fetch record from ${this.tableName} for query ${JSON.stringify(where)}`,
        error: error.message,
      })
      return {success: false, data: null, error: "Database error"}
    }
  }

  async create<T, R>(data: T): Promise<DBResponse<R>> {
    try {
      const result = await prisma[this.tableName].create({data})

      this.invalidateCache()

      logger.info({message: `Created new record in ${this.tableName}`, data})

      return {success: true, data: result}
    } catch (error: any) {
      logger.error({message: `Failed to create record in ${this.tableName}`, error: error.message})
      return {success: false, data: null, error: "Database error"}
    }
  }

  async update<T, R>(id: number, data: T): Promise<DBResponse<R>> {
    try {
      const existing = await this.findOne<R>({id})

      if (!existing.success || !existing.data) {
        return {success: false, data: null, error: `Record not found`}
      }

      const result = await prisma[this.tableName].update({where: {id}, data})

      this.invalidateCacheById(id)

      const cacheKey = this.getCacheKey("find", JSON.stringify({id}))
      this.cache.set(cacheKey, result, CACHE_TTL)

      logger.info({message: `Updated record in ${this.tableName} with id ${id}`, data})

      return {success: true, data: result}
    } catch (error: any) {
      logger.error({message: `Failed to update record in ${this.tableName} with id ${id}`, error: error.message})
      return {success: false, data: null, error: "Database error"}
    }
  }

  async delete(id: number): Promise<DBResponse<null>> {
    try {
      const existing = await this.findOne({id})

      if (!existing.success || !existing.data) {
        return {success: false, data: null, error: `Record not found`}
      }

      await prisma[this.tableName].delete({where: {id}})

      this.invalidateCacheById(id)

      const cacheKey = this.getCacheKey("find", JSON.stringify({id}))
      this.cache.delete(cacheKey)

      logger.info({message: `Deleted record from ${this.tableName} with id ${id}`})

      return {success: true, data: null}
    } catch (error: any) {
      logger.error({message: `Failed to delete record from ${this.tableName} with id ${id}`, error: error.message})
      return {success: false, data: null, error: "Database error"}
    }
  }

  private invalidateCache() {
    const cacheKey = `${this.tableName}:all`

    this.cache.delete(cacheKey)

    logger.info({message: `Invalidated cache for ${cacheKey}`})
  }

  private invalidateCacheById(id: string | number) {
    const cacheKey = this.getCacheKey("find", JSON.stringify({id}))
    this.cache.delete(cacheKey)

    logger.info({message: `Invalidated cache for ${cacheKey}`})
  }

  private getCacheKey(suffix: string, postfix?: string) {
    return [this.tableName, suffix, postfix].filter(Boolean).join(":")
  }
}
