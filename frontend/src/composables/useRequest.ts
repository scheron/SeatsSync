import {onUnmounted} from "vue"
import {Observable, Subscription} from "rxjs"
import {httpClient} from "@/modules/http"

import type {ErrorCode} from "@/constants/errors"
import type {Method} from "@/constants/messageTypes"

type Handler<T> = (data: T) => void
type ErrorHandler = (error: ErrorCode) => void

interface RequestConfig<T, B = unknown> {
  method: "GET" | "POST" | "DELETE"
  url: Method
  data?: B
  onSuccess?: Handler<T>
  onError?: ErrorHandler
}

export function useRequest() {
  const subscriptions = new Set<Subscription>()

  function unsubscribe() {
    subscriptions.forEach((sub) => sub.unsubscribe())
    subscriptions.clear()
  }

  onUnmounted(() => {
    unsubscribe()
  })

  return <T, B = unknown>(config: RequestConfig<T, B>) => {
    const {method, url, data, onSuccess, onError} = config

    let observable: Observable<T>

    switch (method) {
      case "POST":
        observable = httpClient.post<T, B>(url, data!)
        break
      case "DELETE":
        observable = httpClient.delete<T>(url)
        break

      default:
        observable = httpClient.get<T>(url)
    }

    const subscription = observable.subscribe({
      next: (response) => onSuccess?.(response),
      error: (error) => onError?.(error as ErrorCode),
    })

    subscriptions.add(subscription)
  }
}
