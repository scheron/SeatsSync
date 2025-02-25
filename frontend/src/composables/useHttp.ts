import {onUnmounted} from "vue"
import {httpClient} from "@/api/http"

import type {ErrorCode} from "@/constants/errors"
import type {Method} from "@/constants/messageTypes"
import type {Observable, Subscription} from "rxjs"

type Handler<TypeResponse> = (data: TypeResponse) => void
type ErrorHandler = (error: ErrorCode) => void

interface RequestConfig<TypeResponse, TypeBody = unknown> {
  method: "GET" | "POST" | "DELETE"
  url: Method
  data?: TypeBody
  onSuccess?: Handler<TypeResponse>
  onError?: ErrorHandler
}

export function useHttp() {
  const subscriptions = new Set<Subscription>()

  function unsubscribe() {
    subscriptions.forEach((sub) => sub.unsubscribe())
    subscriptions.clear()
  }

  onUnmounted(() => {
    unsubscribe()
  })

  return <TypeResponse, TypeBody = unknown>(config: RequestConfig<TypeResponse, TypeBody>) => {
    const {method, url, data, onSuccess, onError} = config

    let observable: Observable<TypeResponse>

    switch (method) {
      case "POST":
        observable = httpClient.post<TypeResponse, TypeBody>(url, data!)
        break
      case "DELETE":
        observable = httpClient.delete<TypeResponse>(url)
        break

      default:
        observable = httpClient.get<TypeResponse>(url)
    }

    const subscription = observable.subscribe({
      next: (response) => onSuccess?.(response),
      error: (error) => onError?.(error as ErrorCode),
    })

    subscriptions.add(subscription)
  }
}
