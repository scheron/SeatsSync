import {Observable, throwError} from "rxjs"
import {ajax} from "rxjs/ajax"
import {catchError, map} from "rxjs/operators"

import type {ApiResponse} from "./types"

export class HttpClient {
  constructor(private readonly baseUrl: string) {}

  private createRequest<T, R = any>(endpoint: string, method: string, body?: R, headers: Record<string, string> = {}): Observable<T> {
    return ajax<ApiResponse<T>>({
      url: `${this.baseUrl}${endpoint}`,
      method,
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

  post<T, R = any>(endpoint: string, body: R): Observable<T> {
    return this.createRequest<T, R>(endpoint, "POST", body)
  }

  get<T>(endpoint: string): Observable<T> {
    return this.createRequest<T>(endpoint, "GET")
  }
}
