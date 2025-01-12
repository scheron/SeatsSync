export type Result<T> = {
  success: boolean
  data: T | null
  error?: string
}
