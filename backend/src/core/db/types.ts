export type DBResponse<T> = {
  success: boolean
  data: T | null
  error?: string
}

export type QueryOptions = {
  include?: Record<string, boolean | QueryOptions>
  select?: Record<string, boolean | QueryOptions>
  where?: Record<string, unknown>
}

export interface IDB {
  findAll<T>(options?: QueryOptions): Promise<DBResponse<T[]>>
  findOne<R>(where: Record<string, unknown>, options?: QueryOptions): Promise<DBResponse<R>>
  create<T, R>(data: T): Promise<DBResponse<R>>
  update<T, R>(id: number, data: T): Promise<DBResponse<R>>
  delete(id: number): Promise<DBResponse<null>>
}
