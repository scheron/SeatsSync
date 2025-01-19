import {API_URL} from "@/constants/common"
import {HttpClient} from "./httpClient"

export const httpClient = new HttpClient(API_URL)

export type {ApiResponse} from "./types"
