import {PrismaClient} from "@prisma/client"
import {LRU} from "@/shared/lru"

const CACHE_TTL = 300_000
const CACHE_MAX_SIZE = 100

export const prisma = new PrismaClient()

export interface IDB {
  findAll<T>(): Promise<T[]>
  findById<R>(id: number): Promise<R | null>
  create<T, R>(data: T): Promise<R>
  update<T, R>(id: number, data: T): Promise<R>
  delete(id: number): Promise<void>
}

export class DB implements IDB {
  private cache: LRU<string, unknown>

  constructor(private tableName: string) {
    this.cache = new LRU<string, unknown>(CACHE_MAX_SIZE)
  }

  async findAll<R>(): Promise<R[]> {
    const cacheKey = `${this.tableName}:all`
    const cached = this.cache.get(cacheKey)

    if (cached) return cached as R[]

    const result = await prisma[this.tableName].findMany()
    this.cache.set(cacheKey, result, CACHE_TTL)

    return result
  }

  async findById<R>(id: number): Promise<R | null> {
    const cacheKey = `${this.tableName}:id:${id}`
    const cached = this.cache.get(cacheKey)

    if (cached) return cached as R

    const result = await prisma[this.tableName].findUnique({where: {id}})
    if (result) this.cache.set(cacheKey, result, CACHE_TTL)

    return result
  }

  async create<T, R>(data: T): Promise<R> {
    const result = await prisma[this.tableName].create({data})

    this.invalidateCache()

    return result
  }

  async update<T, R>(id: number, data: T): Promise<R> {
    const existing = await this.findById<R>(id)

    if (!existing) {
      throw new Error(`${this.tableName} with id ${id} not found`)
    }

    const result = await prisma[this.tableName].update({where: {id}, data})

    this.invalidateCache()

    const cacheKey = `${this.tableName}:id:${id}`
    this.cache.set(cacheKey, result, CACHE_TTL)

    return result
  }

  async delete(id: number): Promise<void> {
    const existing = await this.findById(id)

    if (!existing) {
      throw new Error(`${this.tableName} with id ${id} not found`)
    }

    await prisma[this.tableName].delete({where: {id}})

    this.invalidateCache()

    const cacheKey = `${this.tableName}:id:${id}`
    this.cache.delete(cacheKey)
  }

  private invalidateCache(): void {
    const cacheKey = `${this.tableName}:all`
    this.cache.delete(cacheKey)
  }
}
