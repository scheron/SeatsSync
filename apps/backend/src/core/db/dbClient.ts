import {PrismaClient} from "@prisma/client"
import {env} from "@/shared/constants/env"
import {Errors} from "@/shared/errors"

import type {DBResponse, IDB, QueryOptions} from "./types"

const client: PrismaClient = new PrismaClient({datasourceUrl: env.DB_URL})

export class DB implements IDB {
  constructor(private tableName: string) {}

  async findAll<R>(options?: QueryOptions): Promise<DBResponse<R[]>> {
    try {
      const result = await client[this.tableName].findMany({...options})
      return {success: true, data: result}
    } catch (error: any) {
      return {success: false, data: null, error: Errors.InternalServerError}
    }
  }

  async findOne<R>(options?: QueryOptions): Promise<DBResponse<R>> {
    try {
      const result = await client[this.tableName].findFirst({...options})

      if (!result) {
        return {success: false, data: null, error: `${this.tableName.toUpperCase()}_NOT_FOUND`}
      }

      return {success: true, data: result}
    } catch (error: any) {
      return {success: false, data: null, error: Errors.InternalServerError}
    }
  }

  async create<T, R>(data: T): Promise<DBResponse<R>> {
    try {
      const result = await client[this.tableName].create({data})
      return {success: true, data: result}
    } catch (error: any) {
      return {success: false, data: null, error: `${this.tableName.toUpperCase()}_CREATE_FAILED`}
    }
  }

  async update<T, R>(id: number, data: T): Promise<DBResponse<R>> {
    try {
      const existing = await this.findOne<R>({where: {id}})

      if (!existing.success || !existing.data) {
        return {success: false, data: null, error: `${this.tableName.toUpperCase()}_NOT_FOUND`}
      }

      const result = await client[this.tableName].update({where: {id}, data})
      return {success: true, data: result}
    } catch (error: any) {
      return {success: false, data: null, error: `${this.tableName.toUpperCase()}_UPDATE_FAILED`}
    }
  }

  async updateMany<T, R>(where: Record<string, unknown>, data: T): Promise<DBResponse<R>> {
    try {
      const result = await client[this.tableName].updateMany({where, data})
      return {success: true, data: result as R}
    } catch (error: any) {
      return {success: false, data: null, error: `${this.tableName.toUpperCase()}_UPDATE_FAILED`}
    }
  }

  async delete(id: number): Promise<DBResponse<null>> {
    try {
      const existing = await this.findOne({where: {id}})

      if (!existing.success || !existing.data) {
        return {success: false, data: null, error: `${this.tableName.toUpperCase()}_NOT_FOUND`}
      }

      await client[this.tableName].delete({where: {id}})
      return {success: true, data: null}
    } catch (error: any) {
      return {success: false, data: null, error: `${this.tableName.toUpperCase()}_DELETE_FAILED`}
    }
  }

  async transaction<T>(fn: (tx: PrismaClient) => Promise<T>): Promise<DBResponse<T>> {
    try {
      const result = await client.$transaction(async (tx) => {
        return await fn(tx as PrismaClient)
      })
      return {success: true, data: result}
    } catch (error: any) {
      return {success: false, data: null, error: Errors.InternalServerError}
    }
  }
}
