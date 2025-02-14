import type {PrismaClient} from "@prisma/client"

export type DBResponse<T> = {
  success: boolean
  data: T | null
  error?: string
}

export type QueryOptions = {
  select?: Record<string, unknown>
  include?: Record<string, unknown>
  where?: Record<string, unknown>
  orderBy?: Record<string, unknown>
  skip?: number
  take?: number
}

export interface IDB {
  findAll<R>(options?: QueryOptions): Promise<DBResponse<R[]>>
  findOne<R>(options?: QueryOptions): Promise<DBResponse<R>>
  create<T, R>(data: T): Promise<DBResponse<R>>
  update<T, R>(id: number, data: T): Promise<DBResponse<R>>
  updateMany<T, R>(where: Record<string, unknown>, data: T): Promise<DBResponse<R>>
  delete(id: number): Promise<DBResponse<null>>
  transaction<T>(fn: (tx: PrismaClient) => Promise<T>): Promise<DBResponse<T>>
}
