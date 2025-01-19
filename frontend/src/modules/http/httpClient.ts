import {Methods} from "@/constants/messageTypes"
import {Observable, throwError} from "rxjs"
import {ajax} from "rxjs/ajax"
import {catchError, map} from "rxjs/operators"

import type {Method} from "@/constants/messageTypes"
import type {ApiResponse} from "./types"

export class HttpClient {
  constructor(private readonly baseUrl: string) {}

  private createRequest<T, B = any>(endpoint: Method, httpMethod: string, body?: B, headers: Record<string, string> = {}): Observable<T> {
    return ajax<ApiResponse<T>>({
      url: `${this.baseUrl}/${Methods[endpoint]}`,
      method: httpMethod,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body,
    }).pipe(
      map((response) => {
        if (response.response.error) throw new Error(response.response.error)
        return response.response.data
      }),
      catchError((error) => {
        if (error.response) return throwError(() => new Error(error.response.error || "Unknown error occurred"))
        return throwError(() => error)
      }),
    )
  }

  post<T, B = any>(endpoint: Method, body: B): Observable<T> {
    return this.createRequest<T, B>(endpoint, "POST", body)
  }

  get<T>(endpoint: Method): Observable<T> {
    return this.createRequest<T>(endpoint, "GET")
  }
}
