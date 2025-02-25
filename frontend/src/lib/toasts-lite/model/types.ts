export type ToastType = "success" | "loading" | "error"
export type ToastPosition = "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right" | "middle-center"

export type ToastProps = {
  /** toast id */
  id: Id
  /** toast type */
  type: ToastType
  /** toast message */
  message: string
  /** auto close the toast */
  autoClose: boolean
  /** duration in milliseconds */
  duration: number
  /** Position of the toast on the screen. */
  position?: ToastPosition
}

export type Id = string
export type ToastOptions = Partial<ToastProps>
export type ToastSimpleOptions = Partial<Omit<ToastProps, "message">>
export type ToastPromiseOptions = {loading: string; success: string; error: string; position?: ToastPosition; id?: Id}

export interface Toast {
  add: (options: ToastOptions) => Id
  update: (id: Id, options: ToastOptions) => Id
  success: (message: string, options?: ToastSimpleOptions) => Id
  loading: (message: string, options?: ToastSimpleOptions) => Id
  error: (message: string, options?: ToastSimpleOptions) => Id
  promise: <T>(promise: Promise<T>, options: ToastPromiseOptions) => Promise<Id>
}
