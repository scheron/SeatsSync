import {reactive} from "vue"

import type {Id, Toast, ToastOptions, ToastPromiseOptions, ToastProps, ToastSimpleOptions} from "./types"

const DEFAULT_OPTIONS = {
  type: "success",
  message: "Hello from Toasts Lite",
  autoClose: true,
  duration: 3000,
  position: "top-center",
}

class ToastsController implements Toast {
  toasts: Map<Id, ToastProps>
  private counter = 0
  private ID() {
    return `toast:${Date.now().toString(16)}-${this.counter++}`
  }

  constructor() {
    this.toasts = reactive(new Map())
  }

  private addOrUpdate(_options: ToastOptions): Id {
    let {id = this.ID(), ...options} = _options

    if (this.toasts.has(id)) {
      Object.assign(this.toasts.get(id)!, options)
      return id
    }

    this.toasts.set(id, {id, ...DEFAULT_OPTIONS, ...options} as ToastProps)
    return id
  }

  /**
   * Add a toast
   * @param options - The options for the toast
   * @returns The id of the toast
   */
  public add(options: ToastOptions) {
    return this.addOrUpdate(options)
  }

  /**
   * Update a toast by id
   * @param id - The id of the toast to update
   * @param options - The options for the toast
   * @returns The id of the toast
   */
  public update(id: Id, options: ToastOptions) {
    return this.addOrUpdate({...options, id})
  }

  /**
   * Remove a toast by id
   * If no id is provided, all current toasts will be removed
   * @param id - The id of the toast to remove
   */
  public remove(id?: Id) {
    if (id && !this.toasts.has(id)) return

    if (id) this.toasts.delete(id)
    else this.clear()
  }

  /**
   * Remove all current toasts
   */
  public clear() {
    this.toasts.clear()
  }

  /**
   * Add a success toast
   * @param message - The message to display in the toast
   * @param options - The options for the toast
   * @returns The id of the toast
   */
  public success(message: string, options?: Omit<ToastSimpleOptions, "type">) {
    return this.addOrUpdate({...options, message, type: "success"})
  }

  /**
   * Add an error toast
   * @param message - The message to display in the toast
   * @param options - The options for the toast
   * @returns The id of the toast
   */
  public error(message: string, options?: Omit<ToastSimpleOptions, "type">) {
    return this.addOrUpdate({...options, message, type: "error"})
  }

  /**
   * Add a loading toast
   * @param message - The message to display in the toast
   * @param options - The options for the toast
   * @returns The id of the toast
   */
  public loading(message: string, options?: Omit<ToastSimpleOptions, "type">) {
    return this.addOrUpdate({...options, message, type: "loading"})
  }

  /**
   * Add a promise toast
   * @param promise - The promise to display in the toast
   * @param options - The options for the toast
   * @returns The id of the toast
   */
  public async promise<T>(promise: Promise<T>, options: ToastPromiseOptions) {
    const id = this.loading(options.loading, {position: options.position, id: options.id})

    try {
      await promise
      this.success(options.success, {position: options.position, id})
      return id
    } catch {
      this.error(options.error, {position: options.position, id})
      throw new Error(options.error)
    }
  }
}

export const toastsController = new ToastsController()
