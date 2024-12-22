import {toast} from "vue3-toastify"

import type {ToastOptions} from "vue3-toastify"

type Options = Omit<ToastOptions, "type">
type FnDisposeToast = () => void

export function useToasts() {
  function show(type: ToastOptions["type"], title: string, options: Options = {}): FnDisposeToast {
    const id = options?.toastId ?? title
    const toastId = toast(title, {...options, toastId: id, type})

    return () => hide(toastId)
  }

  function hide(id: string | number) {
    toast.remove(id)
  }

  function destroy() {
    toast.remove()
  }

  return {
    show: {
      info: (title: string, options?: Options) => show("info", title, options),
      error: (title: string, options?: Options) => show("error", title, options),
      warning: (title: string, options?: Options) => show("warning", title, options),
      success: (title: string, options?: Options) => show("success", title, options),
      default: (title: string, options?: Options) => show("default", title, options),
    },
    hide,
    destroy,
  }
}
