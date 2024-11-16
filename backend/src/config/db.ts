import NodeCache from "node-cache"
import {PrismaClient} from "@prisma/client"

const CACHE_TTL = 300
const cache = new NodeCache()

export const prisma = new PrismaClient()

export interface IDB {
  findAll<T>(): Promise<T[]>
  findById<R>(id: number): Promise<R | null>
  create<T, R>(data: T): Promise<R>
  update<T, R>(id: number, data: T): Promise<R>
  delete(id: number): Promise<void>
}

export class DB implements IDB {
  constructor(private tableName: string) {}

  async findAll<R>(): Promise<R[]> {
    const cached = cache.get(this.tableName)

    if (cached) return cached as R[]

    const result = await prisma[this.tableName].findMany()
    cache.set(this.tableName, result, CACHE_TTL)
    return result
  }

  async findById<R>(id: number): Promise<R | null> {
    return await prisma[this.tableName].findUnique({where: {id}})
  }

  async create<T, R>(data: T): Promise<R> {
    return await prisma[this.tableName].create({data})
  }

  async update<T, R>(id: number, data: T): Promise<R> {
    const existing = await this.findById(id)

    if (!existing) {
      throw new Error(`${this.tableName} with id ${id} not found`)
    }

    return await prisma[this.tableName].update({where: {id}, data})
  }

  async delete(id: number) {
    const existing = await this.findById(id)

    if (!existing) {
      throw new Error(`${this.tableName} with id ${id} not found`)
    }

    await prisma[this.tableName].delete({where: {id}})
  }
}
