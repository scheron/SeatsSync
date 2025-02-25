import {from, map} from "rxjs"
import {switchMap} from "rxjs/operators"
import {Errors} from "@/constants/errors"
import {Methods} from "@/constants/messageTypes"

import type {Method} from "@/constants/messageTypes"
import type {Observable} from "rxjs"
import type {ApiResponse} from "./types"

export class HttpClient {
  constructor(private readonly baseUrl: string) {}

  private createRequest<T, B = any>(endpoint: Method, httpMethod: string, body?: B, headers: Record<string, string> = {}): Observable<T> {
    return from(
      fetch(`${this.baseUrl}/${Methods[endpoint]}`, {
        method: httpMethod,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        credentials: "include",
      }),
    ).pipe(
      switchMap((response) => from(response.json())),
      map((response: ApiResponse<T>) => {
        if (response.status === "error") throw response.error ?? Errors.InternalServerError
        return response.data
      }),
    )
  }

  post<T, B = any>(endpoint: Method, body: B): Observable<T> {
    return this.createRequest<T, B>(endpoint, "POST", body)
  }

  get<T>(endpoint: Method): Observable<T> {
    return this.createRequest<T>(endpoint, "GET")
  }

  delete<T>(endpoint: Method): Observable<T> {
    return this.createRequest<T>(endpoint, "DELETE")
  }
}
